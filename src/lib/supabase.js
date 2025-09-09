// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const key = import.meta.env.VITE_SUPABASE_API_KEY;

if (!url || !key) {
  console.warn("[supabase] VITE_SUPABASE_PROJECT_URL / VITE_SUPABASE_API_KEY가 필요합니다.");
}

export const supabase = createClient(url, key); // ✅ named export
