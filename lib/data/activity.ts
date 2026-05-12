import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import { activityLog as mockActivity, type ActivityLogRow, type ActivityType } from "@/lib/mock/platform-admin";

/** سجل نشاط للوحة الكوفي أو العميل — عميل جلسة؛ عند فشل RLS يعود للـ mock الفارغ أو الوهمي. */
export async function listActivityLogsForUser(
  supabase: SupabaseClient,
  userId: string,
  limit = 40,
): Promise<DataResult<ActivityLogRow[]>> {
  return withMockFallback("activity.user", mockActivity.slice(0, 5), async () => {
    const { data, error } = await supabase
      .from("platform_activity_logs")
      .select("id, activity_type, before_json, after_json, ip, device, created_at")
      .eq("actor_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { data: null, error };
    if (!data?.length) return { data: [], error: null };

    const rows: ActivityLogRow[] = (data as Record<string, unknown>[]).map((r) => {
      return {
        id: String(r.id),
        actorName: "أنا",
        actorRole: "—",
        cafeName: null,
        branchName: null,
        activityType: String(r.activity_type ?? "staff_login") as ActivityType,
        beforeJson: r.before_json != null ? JSON.stringify(r.before_json) : null,
        afterJson: r.after_json != null ? JSON.stringify(r.after_json) : null,
        occurredAt: r.created_at ? new Date(String(r.created_at)).toISOString() : "",
        ip: String(r.ip ?? "—"),
        device: String(r.device ?? "—"),
      };
    });

    return { data: rows, error: null };
  });
}
