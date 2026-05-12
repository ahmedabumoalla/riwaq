import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import {
  platformSubscriptions as mockSubs,
  type PlatformSubscriptionRow,
  type SubscriptionPlan,
  type SubscriptionLifecycle,
  type PaymentStatus,
} from "@/lib/mock/platform-admin";

function daysBetween(end: string | null | undefined): number {
  if (!end) return 0;
  const d = new Date(end);
  if (Number.isNaN(d.getTime())) return 0;
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
}

export async function listCafeSubscriptions(supabase: SupabaseClient): Promise<DataResult<PlatformSubscriptionRow[]>> {
  return withMockFallback("subscriptions.list", mockSubs, async () => {
    const { data, error } = await supabase
      .from("cafe_subscriptions")
      .select("id, cafe_id, plan, monthly_price, starts_at, ends_at, lifecycle, payment_status, notes")
      .order("ends_at", { ascending: true })
      .limit(20);

    if (error) return { data: null, error };
    if (!data?.length) return { data: [], error: null };

    const cafeIds = [...new Set((data as { cafe_id: string }[]).map((r) => r.cafe_id))];
    const { data: cafes } = await supabase.from("cafes").select("id, name").in("id", cafeIds).limit(20);
    const nameById = new Map((cafes ?? []).map((c: { id: string; name: string }) => [c.id, c.name]));

    const mapped: PlatformSubscriptionRow[] = (data as Record<string, unknown>[]).map((r) => {
      const endDate = r.ends_at ? String(r.ends_at) : "";
      const startDate = r.starts_at ? String(r.starts_at) : "";
      return {
        id: String(r.id),
        cafeId: String(r.cafe_id),
        cafeName: nameById.get(String(r.cafe_id)) ?? "كوفي",
        plan: (String(r.plan ?? "starter")) as SubscriptionPlan,
        monthlyPrice: Number(r.monthly_price ?? 0),
        startDate,
        endDate,
        lifecycle: (String(r.lifecycle ?? "active")) as SubscriptionLifecycle,
        paymentStatus: (String(r.payment_status ?? "pending")) as PaymentStatus,
        paymentMethod: "—",
        lastInvoiceId: "—",
        totalPaid: 0,
        daysRemaining: daysBetween(endDate),
        notes: r.notes ? String(r.notes) : "—",
      };
    });

    return { data: mapped, error: null };
  });
}
