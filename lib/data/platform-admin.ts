import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import {
  activityLog as mockActivity,
  overview as mockOverview,
  subscriptionHealth as mockSubscriptionHealth,
  type ActivityLogRow,
  type ActivityType,
  type PlatformAdminOverview,
  type SubscriptionHealthCounts,
} from "@/lib/mock/platform-admin";

/** تجميعات إدارة المنصة — يُستدعى فقط من مسارات تستخدم service role بعد التحقق من الجلسة. */
export async function getPlatformAdminOverview(admin: SupabaseClient): Promise<DataResult<PlatformAdminOverview>> {
  return withMockFallback("platformAdmin.overview", mockOverview, async () => {
    const [cafes, subs, orders, reservations, customers, posts] = await Promise.all([
      admin.from("cafes").select("id", { count: "exact", head: true }),
      admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", "active"),
      admin.from("orders").select("id", { count: "exact", head: true }),
      admin.from("reservations").select("id", { count: "exact", head: true }),
      admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
      admin.from("community_posts").select("id", { count: "exact", head: true }),
    ]);

    const errs = [cafes.error, subs.error, orders.error, reservations.error, customers.error, posts.error].filter(Boolean);
    if (errs.length) return { data: null, error: errs[0] };

    const totalCafes = cafes.count ?? 0;
    const activeSubs = subs.count ?? 0;

    const data: PlatformAdminOverview = {
      ...mockOverview,
      totalCafes,
      activeCafes: totalCafes,
      activeMonthlySubscriptions: activeSubs,
      totalOrders: orders.count ?? 0,
      totalReservations: reservations.count ?? 0,
      totalCustomers: customers.count ?? 0,
      totalCustomerPosts: posts.count ?? 0,
    };

    return { data, error: null };
  });
}

export async function getSubscriptionHealthCounts(admin: SupabaseClient): Promise<DataResult<SubscriptionHealthCounts>> {
  return withMockFallback("platformAdmin.subHealth", mockSubscriptionHealth, async () => {
    const lifecycleKeys = ["active", "expires_7d", "past_due", "paused", "trial"] as const;
    const results = await Promise.all(
      lifecycleKeys.map((lc) =>
        admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", lc),
      ),
    );
    const errs = results.map((r) => r.error).filter(Boolean);
    if (errs.length) return { data: null, error: errs[0] };

    const counts: SubscriptionHealthCounts = {
      active: results[0]?.count ?? 0,
      expiringSoon: results[1]?.count ?? 0,
      pastDue: results[2]?.count ?? 0,
      paused: results[3]?.count ?? 0,
      trial: results[4]?.count ?? 0,
    };
    return { data: counts, error: null };
  });
}

export async function listPlatformActivityLogs(admin: SupabaseClient, limit = 30): Promise<DataResult<ActivityLogRow[]>> {
  const cap = Math.min(30, Math.max(1, limit));
  return withMockFallback("platformAdmin.activity", mockActivity, async () => {
    const { data, error } = await admin
      .from("platform_activity_logs")
      .select("id, actor_id, cafe_id, branch_id, activity_type, before_json, after_json, ip, device, created_at")
      .order("created_at", { ascending: false })
      .limit(cap);

    if (error) return { data: null, error };
    if (!data?.length) return { data: [], error: null };

    const rowsRaw = data as Record<string, unknown>[];
    const actorIds = [...new Set(rowsRaw.map((r) => r.actor_id).filter(Boolean).map(String))];
    const cafeIds = [...new Set(rowsRaw.map((r) => r.cafe_id).filter(Boolean).map(String))];
    const branchIds = [...new Set(rowsRaw.map((r) => r.branch_id).filter(Boolean).map(String))];

    const profRes =
      actorIds.length > 0
        ? await admin.from("profiles").select("id, full_name, role").in("id", actorIds).limit(20)
        : { data: [] as { id: string; full_name: string | null; role: string | null }[], error: null };
    const cafeRes =
      cafeIds.length > 0
        ? await admin.from("cafes").select("id, name").in("id", cafeIds).limit(20)
        : { data: [] as { id: string; name: string | null }[], error: null };
    const branchRes =
      branchIds.length > 0
        ? await admin.from("branches").select("id, name").in("id", branchIds).limit(20)
        : { data: [] as { id: string; name: string | null }[], error: null };

    const profMap = new Map((profRes.data ?? []).map((p) => [p.id, p]));
    const cafeMap = new Map((cafeRes.data ?? []).map((c) => [c.id, c.name]));
    const branchMap = new Map((branchRes.data ?? []).map((b) => [b.id, b.name]));

    const rows: ActivityLogRow[] = rowsRaw.map((r) => {
      const aid = r.actor_id ? String(r.actor_id) : "";
      const prof = aid ? profMap.get(aid) : undefined;
      const cid = r.cafe_id ? String(r.cafe_id) : "";
      const bid = r.branch_id ? String(r.branch_id) : "";
      return {
        id: String(r.id),
        actorName: prof?.full_name ?? "—",
        actorRole: String(prof?.role ?? "—"),
        cafeName: cid ? (cafeMap.get(cid) ?? null) : null,
        branchName: bid ? (branchMap.get(bid) ?? null) : null,
        activityType: String(r.activity_type ?? "order_created") as ActivityType,
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
