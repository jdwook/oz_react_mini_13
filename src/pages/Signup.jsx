// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import { isEmail, isPassword, isName, equals } from "../utils/validators.js";
import useSupabaseAuth from "../hooks/useSupabaseAuth.js";
import { useAuth } from "../context/AuthContext.jsx";

function Signup() {
  const nav = useNavigate();
  const loc = useLocation();
  const { setUser } = useAuth();
  const { signup } = useSupabaseAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const e = {};
    if (!isEmail(email)) e.email = "이메일 형식으로 입력하세요.";
    if (!isName(name)) e.name = "2~8자, 한글·영문·숫자만 사용";
    if (!isPassword(pw)) e.pw = "영문 대/소문자 + 숫자, 8자 이상";
    if (!equals(pw, pw2)) e.pw2 = "비밀번호가 일치하지 않습니다.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setGeneralError("");
    if (!validate()) return;

    setSubmitting(true);
    const { user, error } = await signup({ email, password: pw, userName: name });
    setSubmitting(false);

    if (error) {
      setGeneralError(error.message || "회원가입 실패");
      return;
    }

    // 전역 유저 상태 반영 후 이동
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
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight">회원가입</h1>

        <div className="space-y-4">
          <FormInput
            label="이메일"
            value={email}
            onChange={setEmail}
            placeholder="example@email.com"
            error={errors.email}
          />
          <FormInput
            label="이름"
            value={name}
            onChange={setName}
            placeholder="2~8자, 숫자·한글·영어"
            error={errors.name}
          />
          <FormInput
            label="비밀번호"
            type="password"
            value={pw}
            onChange={setPw}
            placeholder="영문 대/소문자 + 숫자"
            error={errors.pw}
          />
          <FormInput
            label="비밀번호 확인"
            type="password"
            value={pw2}
            onChange={setPw2}
            placeholder="동일하게 입력"
            error={errors.pw2}
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
          {submitting ? "가입 중..." : "회원가입"}
        </button>

        <p className="mt-5 text-center text-sm text-white/70">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="underline underline-offset-2 text-white">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
