import { supabase } from "../lib/supabase";

/** 로컬스토리지 키 */
const LS_KEY = "userInfo";

/** 공통: 유저 객체 표준화 */
function normUser(sessionUser, profileImageUrl) {
  if (!sessionUser) return null;
  const { id, email, user_metadata } = sessionUser;
  return {
    id,
    email: email ?? "",
    userName: user_metadata?.name || user_metadata?.user_name || "",
    profileImageUrl:
      profileImageUrl ||
      user_metadata?.avatar_url ||
      "https://api.dicebear.com/9.x/initials/svg?seed=" +
        encodeURIComponent(user_metadata?.name || email || "user"),
  };
}

/** 현재 세션 기반 유저정보 가져오기 + LocalStorage 저장 */
export async function getUserInfo() {
  const { data: { session } } = await supabase.auth.getSession();
  const user = normUser(session?.user);
  if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
  return user;
}

/** 이메일/비번 회원가입 */
export async function signup({ email, password, userName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: userName } },
  });

  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }

  const user = normUser(data.user);
  if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
  return { user };
}

/** 이메일/비번 로그인 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }

  const user = normUser(data.user);
  if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
  return { user };
}

/** 로그아웃 */
export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem(LS_KEY);
  return { ok: true };
}

/** Google 소셜 로그인 */
export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }
  return { ok: true };
}

/** Kakao 소셜 로그인 (Supabase Auth에 제공자 활성화 필요) */
export async function loginWithKakao() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
  });
  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }
  return { ok: true };
}

/** 훅 래퍼 (요구사항 이름) */
export default function useSupabaseAuth() {
  return {
    login,
    signup,
    logout,
    getUserInfo,
    loginWithGoogle,
    loginWithKakao,
  };
}

