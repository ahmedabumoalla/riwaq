import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformAdminOverview, SubscriptionHealthCounts, TopCafeRow } from "@/lib/mock/platform-admin";

export type PlatformAdminDashboardPayload = {
  overview: PlatformAdminOverview;
  subscriptionHealth: SubscriptionHealthCounts;
  topCafes: TopCafeRow[];
  invoiceCount: number;
  topCafesPage: number;
  topCafesPageSize: number;
};

export type BuildPlatformAdminDashboardOpts = {
  /** صفحة جدول أحدث الكافيهات (1-based) */
  topCafesPage?: number;
  topCafesPageSize?: number;
};

export async function buildPlatformAdminDashboard(
  admin: SupabaseClient,
  opts?: BuildPlatformAdminDashboardOpts,
): Promise<PlatformAdminDashboardPayload> {
  const topCafesPage = Math.max(1, Math.floor(opts?.topCafesPage ?? 1));
  const topCafesPageSize = Math.min(50, Math.max(1, Math.floor(opts?.topCafesPageSize ?? 12)));
  const from = (topCafesPage - 1) * topCafesPageSize;
  const to = from + topCafesPageSize - 1;

  const [
    cafesHead,
    invHead,
    postsHead,
    logsHead,
    custHead,
    ordersHead,
    resHead,
    cafeList,
    mrrPrices,
    cntActive,
    cntExpired,
    cntExpires7d,
    cntPastDue,
    cntPaused,
    cntTrial,
  ] = await Promise.all([
    admin.from("cafes").select("id", { count: "exact", head: true }),
    admin.from("subscription_invoices").select("id", { count: "exact", head: true }),
    admin.from("community_posts").select("id", { count: "exact", head: true }),
    admin.from("platform_activity_logs").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
    admin.from("orders").select("id", { count: "exact", head: true }),
    admin.from("reservations").select("id", { count: "exact", head: true }),
    admin.from("cafes").select("id, name").order("created_at", { ascending: false }).range(from, to),
    admin.from("cafe_subscriptions").select("monthly_price").eq("lifecycle", "active").limit(5000),
    admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", "active"),
    admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", "expired"),
    admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", "expires_7d"),
    admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", "past_due"),
    admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", "paused"),
    admin.from("cafe_subscriptions").select("id", { count: "exact", head: true }).eq("lifecycle", "trial"),
  ]);

  const errs = [
    cafesHead.error,
    invHead.error,
    postsHead.error,
    logsHead.error,
    custHead.error,
    ordersHead.error,
    resHead.error,
    cafeList.error,
    mrrPrices.error,
    cntActive.error,
    cntExpired.error,
    cntExpires7d.error,
    cntPastDue.error,
    cntPaused.error,
    cntTrial.error,
  ].filter(Boolean);
  if (errs.length) {
    throw new Error(String(errs[0]?.message ?? errs[0]));
  }

  const totalCafes = cafesHead.count ?? 0;
  const activeSubsCount = cntActive.count ?? 0;
  const expiredSubsCount = cntExpired.count ?? 0;
  const mrr =
    (mrrPrices.data as { monthly_price: number | string }[] | null)?.reduce(
      (s, r) => s + Number(r.monthly_price ?? 0),
      0,
    ) ?? 0;

  const health: SubscriptionHealthCounts = {
    active: activeSubsCount,
    expiringSoon: cntExpires7d.count ?? 0,
    pastDue: cntPastDue.count ?? 0,
    paused: cntPaused.count ?? 0,
    trial: cntTrial.count ?? 0,
  };

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
    rank: from + i + 1,
  }));

  return {
    overview,
    subscriptionHealth: health,
    topCafes,
    invoiceCount: invHead.count ?? 0,
    topCafesPage,
    topCafesPageSize,
  };
}
