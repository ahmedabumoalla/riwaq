import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(raw: string) {
  return raw.replace(/\/rest\/v1\/?$/, "");
}

/**
 * عميل بصلاحية service_role — للاستخدام في Route Handlers / Server Actions فقط.
 *
 * ⚠️ لا تستورد هذا الملف من أي Client Component.
 * ⚠️ لا تضع SUPABASE_SERVICE_ROLE_KEY في NEXT_PUBLIC_*.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(normalizeSupabaseUrl(url), serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
