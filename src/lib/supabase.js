import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing env: VITE_SUPABASE_PROJECT_URL / VITE_SUPABASE_API_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: "ozwave-auth", // ← 위 AUTH_STORAGE_KEY와 값만 동일하면 됨
  },
});

if (typeof window !== "undefined" && import.meta.env.DEV) {
  window.supabase = supabase; // 디버깅 편의
}
