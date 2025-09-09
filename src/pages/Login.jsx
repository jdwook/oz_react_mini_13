import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import { isEmail, isPassword } from "../utils/validators.js";
import useSupabaseAuth from "../hooks/useSupabaseAuth.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { setUser } = useAuth();
  const { login, loginWithGoogle, loginWithKakao } = useSupabaseAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const e = {};
    if (!isEmail(email)) e.email = "이메일 형식으로 입력하세요.";
    if (!isPassword(pw)) e.pw = "영문 대/소문자 + 숫자, 8자 이상";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setSubmitting(true);
    const { user, error } = await login({ email, password: pw });
    setSubmitting(false);
    if (error) return setGeneralError(error.message);
    setUser(user);
    const to = new URLSearchParams(loc.search).get("redirect") || "/";
    nav(to, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className={[
          "w-full max-w-md rounded-2xl",
          "bg-white/[0.06] border border-white/10 backdrop-blur",
          "p-7 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,.35)]",
        ].join(" ")}
      >
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight">로그인</h1>

        <div className="space-y-4">
          <FormInput
            label="이메일"
            value={email}
            onChange={setEmail}
            placeholder="example@email.com"
            error={errors.email}
          />
          <FormInput
            label="비밀번호"
            type="password"
            value={pw}
            onChange={setPw}
            placeholder="영문 대/소문자+숫자 조합"
            error={errors.pw}
          />
        </div>

        {generalError && (
          <p className="mt-3 text-sm text-red-400">{generalError}</p>
        )}

        <button
          disabled={submitting}
          className={[
            "mt-6 w-full rounded-xl py-3.5 text-base font-semibold",
            "bg-[#3366FF] hover:bg-[#2B55D6] transition-colors",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "shadow-[0_6px_18px_rgba(51,102,255,.35)]",
          ].join(" ")}
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm hover:bg-white/10"
            title="Google 로그인"
          >
            Google
          </button>
          <button
            type="button"
            onClick={loginWithKakao}
            className="rounded-xl bg-[#FEE500] text-[#2B1717] font-semibold py-2.5 text-sm hover:brightness-95"
            title="Kakao 로그인"
          >
            Kakao
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-white/70">
          처음이신가요?{" "}
          <Link to="/signup" className="underline underline-offset-2 text-white">
            간편 가입
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
