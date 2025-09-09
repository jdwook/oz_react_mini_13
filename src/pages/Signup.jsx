import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../hooks/useSupabaseAuth";
import { isEmail, isName, isPassword, equals } from "../utils/validators";

const CARD =
  "mx-auto w-[min(92vw,560px)] rounded-2xl bg-[#0E1324] shadow-2xl border border-white/10 p-8 md:p-10";
const TITLE = "text-3xl md:text-4xl font-extrabold mb-8";
const LABEL = "block mb-2 text-sm text-white/70";
const INPUT =
  "w-full h-12 rounded-lg bg-white/10 text-white placeholder-white/50 px-4 outline-none focus:ring-2 focus:ring-[rgba(51,102,255,.45)]";
const PRIMARY_BTN =
  "w-full h-12 rounded-lg bg-[#3867FF] hover:brightness-110 text-white font-semibold transition";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "",
    userName: "",
    password: "",
    confirm: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!isEmail(form.email)) return "이메일 형식을 확인해 주세요.";
    if (!isName(form.userName)) return "이름은 2~8자, 한글/영어/숫자만 가능합니다.";
    if (!isPassword(form.password))
      return "비밀번호는 영문 대/소문자 + 숫자 조합(8자 이상).";
    if (!equals(form.password, form.confirm)) return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const v = validate();
    if (v) return setErr(v);

    setBusy(true);
    setErr("");
    const { error } = await signup({
      email: form.email,
      password: form.password,
      userName: form.userName,
    });
    setBusy(false);
    if (error) return setErr(error.message || "회원가입 실패");

    // 회원가입 → 자동 로그인되면 홈으로
    nav("/", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 text-white">
      <form onSubmit={onSubmit} className={CARD}>
        <h1 className={TITLE}>회원가입</h1>

        <label className={LABEL}>이메일</label>
        <input
          className={INPUT}
          type="email"
          name="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={onChange}
          autoComplete="email"
        />

        <div className="mt-4">
          <label className={LABEL}>이름</label>
          <input
            className={INPUT}
            type="text"
            name="userName"
            placeholder="2~8자, 숫자·한글·영어"
            value={form.userName}
            onChange={onChange}
            autoComplete="nickname"
          />
        </div>

        <div className="mt-4">
          <label className={LABEL}>비밀번호</label>
          <input
            className={INPUT}
            type="password"
            name="password"
            placeholder="영문 대/소문자 + 숫자"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
          />
        </div>

        <div className="mt-4">
          <label className={LABEL}>비밀번호 확인</label>
          <input
            className={INPUT}
            type="password"
            name="confirm"
            placeholder="동일하게 입력"
            value={form.confirm}
            onChange={onChange}
            autoComplete="new-password"
          />
        </div>

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        <button className={`mt-6 ${PRIMARY_BTN}`} disabled={busy}>
          {busy ? "가입 중…" : "회원가입"}
        </button>

        <p className="mt-6 text-center text-sm text-white/70">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-[#86a6ff] underline">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}
