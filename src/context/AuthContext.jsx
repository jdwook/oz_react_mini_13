// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUserInfo } from "../hooks/useSupabaseAuth.js"; // 우리가 만든 표준화 함수 사용

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1) 현재 세션 확인
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            // 표준화 + localStorage 저장
            const u = await getUserInfo();
            setUser(u);
          } else {
            // 2) 세션이 없으면 localStorage 값이라도 복구
            const raw = localStorage.getItem("userInfo");
            setUser(raw ? JSON.parse(raw) : null);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // 3) 로그인/로그아웃/토큰변경 구독
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const u = await getUserInfo();
        setUser(u);
      } else {
        setUser(null);
        localStorage.removeItem("userInfo");
      }
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
