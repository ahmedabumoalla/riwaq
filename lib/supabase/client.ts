import { createBrowserClient } from "@supabase/ssr";

function normalizeSupabaseUrl(raw: string) {
  return raw.replace(/\/rest\/v1\/?$/, "");
}

/**
 * عميل Supabase للمتصفح — يستخدم anon key فقط.
 * لا تستورد هذا الملف في Server Components إن كنت تريد جلسة الكوكيز؛ استخدم `@/lib/supabase/server`.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createBrowserClient(normalizeSupabaseUrl(url), anon);
}
