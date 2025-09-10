// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, loginWithGoogle, loginWithKakao } from "../hooks/useSupabaseAuth";

// 공통 토큰 (회원가입 화면과 동일 톤)
const CARD =
  "mx-auto w-[min(92vw,560px)] rounded-2xl bg-[#0E1324] shadow-2xl border border-white/10 p-8 md:p-10";
const TITLE = "text-3xl md:text-4xl font-extrabold mb-8";
const LABEL = "block mb-2 text-sm text-white/70";
const INPUT =
  "w-full h-12 rounded-lg bg-white/10 text-white placeholder-white/50 px-4 outline-none focus:ring-2 focus:ring-[rgba(51,102,255,.45)]";
const PRIMARY_BTN =
  "w-full h-12 rounded-lg bg-[#3867FF] hover:brightness-110 text-white font-semibold transition";
const SECONDARY_BTN =
  "w-full h-12 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition";
const KAKAO_BTN =
  "w-full h-12 rounded-lg bg-[#FEE500] text-[#191600] font-semibold transition hover:brightness-95";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr("");

    const { error } = await login(form);
    setBusy(false);

    if (error) {
      setErr(error.message || "로그인 실패");
      return;
    }
    nav("/", { replace: true });
  };

  // 소셜 로그인은 내부에서 redirect URL을 받아 직접 이동(location.assign)
  const handleGoogle = async () => {
    setErr("");
    await loginWithGoogle();
  };
  const handleKakao = async () => {
    setErr("");
    await loginWithKakao();
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 text-white">
      <form onSubmit={onSubmit} className={CARD}>
        <h1 className={TITLE}>로그인</h1>

        <label className={LABEL}>이메일</label>
        <input
          className={INPUT}
          type="email"
          name="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
          required
        />

        <div className="mt-4">
          <label className={LABEL}>비밀번호</label>
          <input
            className={INPUT}
            type="password"
            name="password"
            placeholder="영문 대/소문자+숫자 조합"
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
            required
          />
        </div>

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        <button className={`mt-6 ${PRIMARY_BTN}`} disabled={busy}>
          {busy ? "로그인 중…" : "로그인"}
        </button>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            className={SECONDARY_BTN}
            onClick={handleGoogle}
            aria-label="구글로 로그인"
          >
            Google
          </button>
          <button
            type="button"
            className={KAKAO_BTN}
            onClick={handleKakao}
            aria-label="카카오로 로그인"
          >
            Kakao
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-white/70">
          처음이신가요?{" "}
          <Link to="/signup" className="text-[#86a6ff] underline">
            간편 가입
          </Link>
        </p>
      </form>
    </div>
  );
}
