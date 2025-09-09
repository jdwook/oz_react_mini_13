import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

function getCachedUser() {
  try {
    let sbKey = null;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) { sbKey = k; break; }
    }
    if (!sbKey) return null;
    const parsed = JSON.parse(localStorage.getItem(sbKey) || "{}");
    const cur = parsed.currentSession || parsed.session || parsed;
    const u = cur?.user;
    if (!u?.id) return null;
    return {
      id: u.id,
      email: u.email || "",
      userName: u.user_metadata?.name || u.user_metadata?.user_name || "",
      profileImageUrl:
        u.user_metadata?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(u.user_metadata?.name || u.email || "user")}&background=3366FF&color=FFFFFF&bold=true&size=96&format=png`,
    };
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const cached = getCachedUser();
  const [user, setUser] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  // ✅ 반드시 Context에서 logout 함수 제공
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("signOut error:", e);
    } finally {
      localStorage.removeItem("userInfo");
      setUser(null);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!alive) return;
        if (session?.user) {
          setUser(getCachedUser() || {
            id: session.user.id,
            email: session.user.email || "",
            userName: session.user.user_metadata?.name || session.user.user_metadata?.user_name || "",
            profileImageUrl:
              session.user.user_metadata?.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.name || session.user.email || "user")}&background=3366FF&color=FFFFFF&bold=true&size=96&format=png`,
          });
        } else setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!alive) return;
      if (session?.user) setUser(getCachedUser());
      else {
        setUser(null);
        localStorage.removeItem("userInfo");
      }
    });
    return () => { alive = false; sub.subscription?.unsubscribe?.(); };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
