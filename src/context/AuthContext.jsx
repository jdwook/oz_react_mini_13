// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);
const LS_KEY = "userInfo";

function normUser(sessionUser) {
  if (!sessionUser) return null;
  const { id, email, user_metadata } = sessionUser;
  return {
    id,
    email: email ?? "",
    userName: user_metadata?.name || user_metadata?.user_name || "",
    profileImageUrl:
      user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user_metadata?.name || email || "user"
      )}&background=3366FF&color=FFFFFF&bold=true&size=96&format=png`,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // 앱 시작 시 세션 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const u = normUser(data.session?.user);
      if (alive) {
        setUser(u);
        if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 세션 변경 구독 (로그인/로그아웃/토큰갱신)
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = normUser(session?.user);
      setUser(u);
      if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
      else localStorage.removeItem(LS_KEY);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem(LS_KEY);
  }

  const value = useMemo(() => ({ user, ready, logout }), [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
