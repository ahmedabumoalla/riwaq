/**
 * عميل Supabase (Auth، JS، SSR) يحتاج جذر مشروع Supabase فقط:
 * https://<project-ref>.supabase.co
 *
 * لا تستخدم نقطة REST مثل .../rest/v1 — ذلك يسبب أخطاء شبكة أو "fetch failed".
 */

export function normalizeSupabaseProjectUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");

  if (/\/rest\/v1/i.test(trimmed)) {
    console.error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL يجب أن يكون رابط المشروع فقط (مثل https://xxxx.supabase.co) وليس رابط REST API (/rest/v1). تم إزالة /rest/v1 تلقائيًا."
    );
  }

  return trimmed.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}
