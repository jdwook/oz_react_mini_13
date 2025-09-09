import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../hooks/useSupabaseAuth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, setUser, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(loc.state?.msg || "");
  const [error, setError] = useState("");

  // 로그인되어 있으면 이 페이지에 머물 이유가 없음
  useEffect(() => {
    if (!loading && user) nav("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setMsg("");
    setSubmitting(true);

    try {
      const { user: u, error: err } = await login({ email, password: pw });

      if (err) {
        const pretty =
          err.message === "Invalid login credentials"
            ? "이메일/비밀번호가 올바르지 않거나 이메일 인증이 완료되지 않았습니다."
            : err.message || "로그인 실패";
        setError(pretty);
        return;
      }

      setUser(u);                 // ✅ 전역 상태 갱신
      nav("/", { replace: true }); // ✅ 즉시 이동
    } catch (ex) {
      setError(ex?.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);        // ✅ 절대 멈추지 않게
    }
  };

  // 초기 세션 복구 중이면 살짝 로딩만
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center text-white">
        초기화 중…
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-[#0B0F1E] px-4">
      <form onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl bg-[#0F1428] p-8 shadow-2xl">
        <h1 className="mb-6 text-3xl font-extrabold">로그인</h1>

        {msg && <p className="mb-3 text-sm text-green-400">{msg}</p>}
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <label className="mb-1 block text-sm text-white/70">이메일</label>
        <input
          className="mb-4 w-full rounded-lg bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-[#4C6FFF]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          autoComplete="email"
          disabled={submitting}
        />

        <label className="mb-1 block text-sm text-white/70">비밀번호</label>
        <input
          type="password"
          className="mb-4 w-full rounded-lg bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-[#4C6FFF]"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="영문 대/소문자+숫자 조합"
          autoComplete="current-password"
          disabled={submitting}
        />

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-lg py-3 font-semibold transition ${
            submitting ? "bg-[#4C6FFF]/60 cursor-wait" : "bg-[#4C6FFF] hover:bg-[#3C59FF]"
          }`}
        >
          {submitting ? "로그인 중…" : "로그인"}
        </button>

        <div className="mt-3 flex gap-2">
          <button type="button" disabled className="flex-1 rounded-lg bg-white/10 py-2">Google</button>
          <button type="button" disabled className="flex-1 rounded-lg bg-[#FFD43B] text-black py-2">Kakao</button>
        </div>

        <p className="mt-6 text-center text-sm text-white/60">
          처음이신가요? <Link to="/signup" className="underline">간편 가입</Link>
        </p>
      </form>
    </div>
  );
}
