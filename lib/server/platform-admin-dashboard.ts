import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformAdminOverview, SubscriptionHealthCounts, TopCafeRow } from "@/lib/mock/platform-admin";

export type PlatformAdminDashboardPayload = {
  overview: PlatformAdminOverview;
  subscriptionHealth: SubscriptionHealthCounts;
  topCafes: TopCafeRow[];
  invoiceCount: number;
};

export async function buildPlatformAdminDashboard(admin: SupabaseClient): Promise<PlatformAdminDashboardPayload> {
  const [
    cafesHead,
    subsHead,
    invHead,
    postsHead,
    logsHead,
    custHead,
    ordersHead,
    resHead,
    subsRows,
    cafeList,
  ] = await Promise.all([
    admin.from("cafes").select("id", { count: "exact", head: true }),
    admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }),
    admin.from("subscription_invoices").select("id", { count: "exact", head: true }),
    admin.from("community_posts").select("id", { count: "exact", head: true }),
    admin.from("platform_activity_logs").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    admin.from("orders").select("id", { count: "exact", head: true }),
    admin.from("reservations").select("id", { count: "exact", head: true }),
    admin.from("cafe_subscriptions").select("lifecycle, monthly_price"),
    admin.from("cafes").select("id, name").order("created_at", { ascending: false }).limit(12),
  ]);

  const errs = [
    cafesHead.error,
    subsHead.error,
    invHead.error,
    postsHead.error,
    logsHead.error,
    custHead.error,
    ordersHead.error,
    resHead.error,
    subsRows.error,
    cafeList.error,
  ].filter(Boolean);
  if (errs.length) {
    throw new Error(String(errs[0]?.message ?? errs[0]));
  }

  const totalCafes = cafesHead.count ?? 0;
  const activeSubsCount =
    (subsRows.data as { lifecycle: string }[] | null)?.filter((r) => r.lifecycle === "active").length ?? 0;
  const expiredSubsCount =
    (subsRows.data as { lifecycle: string }[] | null)?.filter((r) => r.lifecycle === "expired").length ?? 0;
  const mrr =
    (subsRows.data as { lifecycle: string; monthly_price: number | string }[] | null)
      ?.filter((r) => r.lifecycle === "active")
      .reduce((s, r) => s + Number(r.monthly_price ?? 0), 0) ?? 0;

  const health: SubscriptionHealthCounts = {
    active: 0,
    expiringSoon: 0,
    pastDue: 0,
    paused: 0,
    trial: 0,
  };
  for (const row of (subsRows.data ?? []) as { lifecycle: string }[]) {
    const l = row.lifecycle;
    if (l === "active") health.active += 1;
    else if (l === "expires_7d") health.expiringSoon += 1;
    else if (l === "past_due") health.pastDue += 1;
    else if (l === "paused") health.paused += 1;
    else if (l === "trial") health.trial += 1;
  }

  const overview: PlatformAdminOverview = {
    totalCafes,
    activeCafes: totalCafes,
    activeMonthlySubscriptions: activeSubsCount,
    expiredSubscriptions: expiredSubsCount,
    mrr,
    gmv: 0,
    totalOrders: ordersHead.count ?? 0,
    totalReservations: resHead.count ?? 0,
    totalCustomers: custHead.count ?? 0,
    totalCustomerPosts: postsHead.count ?? 0,
    totalViews: 0,
    totalEngagement: 0,
    contentCommissionRevenue: 0,
    monthlyGrowthRate: 0,
  };

  const topCafes: TopCafeRow[] = ((cafeList.data ?? []) as { id: string; name: string }[]).map((c, i) => ({
    id: c.id,
    name: c.name,
    sales: 0,
    orders: 0,
    views: 0,
    rank: i + 1,
  }));

  return {
    overview,
    subscriptionHealth: health,
    topCafes,
    invoiceCount: invHead.count ?? 0,
  };
}
