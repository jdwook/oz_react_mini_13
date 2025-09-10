// src/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const nav = useNavigate();
  const loc = useLocation();
  const [msg, setMsg] = useState("초기화 중…");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // A. 이미 세션이 있으면 바로 홈으로 (detectSessionInUrl가 먼저 처리했을 때)
        const { data: s } = await supabase.auth.getSession();
        if (s?.session) {
          if (alive) nav("/", { replace: true });
          return;
        }

        // B. PKCE 코드로 교환
        const sp = new URLSearchParams(loc.search);
        const code = sp.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession({
            authCode: code,
          });
          if (error) throw error;
          if (alive) nav("/", { replace: true });
          return;
        }

        // C. implicit(flowType 미사용)로 해시 토큰이 올 때
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hash.get("access_token");
        if (accessToken) {
          // detectSessionInUrl=true라면 supabase가 자체 처리/정리함
          await supabase.auth.getSession();
          if (alive) nav("/", { replace: true });
          return;
        }

        // D. 여기까지 오면 정말로 코드가 없는 케이스(설정 점검 필요)
        setMsg("유효한 인증 코드가 없어 로그인 페이지로 이동합니다.");
        setTimeout(() => nav("/login", { replace: true }), 800);
      } catch (e) {
        console.error(e);
        if (alive) setMsg(`로그인 처리 실패: ${e?.message || "알 수 없는 오류"}`);
      }
    })();
    return () => { alive = false; };
  }, [loc.search, nav]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-white">
      <div className="rounded-xl border border-white/10 bg-[#0E1324] px-6 py-8 shadow-2xl">
        <p className="text-sm text-white/80">{msg}</p>
        <p className="mt-4 text-xs text-white/50">
          문제가 계속되면 <Link to="/login" className="underline">로그인</Link>으로 돌아가세요.
        </p>
      </div>
    </div>
  );
}
