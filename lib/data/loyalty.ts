import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import { initialLoyaltyCustomers, type LoyaltyCustomer, type LoyaltyTier } from "@/lib/mock/loyalty";

function tierForPoints(p: number): LoyaltyTier {
  if (p >= 1500) return "ذهبي";
  if (p >= 500) return "فضي";
  return "برونزي";
}

/** نقاط ولاء المستخدم الحالي (RLS على profiles) */
export async function getMyLoyaltyPoints(supabase: SupabaseClient, userId: string): Promise<DataResult<number>> {
  return withMockFallback("loyalty.myPoints", 0, async () => {
    const { data, error } = await supabase.from("profiles").select("loyalty_points").eq("id", userId).maybeSingle();
    if (error) return { data: null, error };
    return { data: data?.loyalty_points ?? 0, error: null };
  });
}

/**
 * قائمة عملاء ولاء للوحة الكوفي — يتطلب سياسات RLS مناسبة؛ حتى ذلك الحين يعود للـ mock عند الفشل.
 */
export async function listLoyaltyCustomers(supabase: SupabaseClient): Promise<DataResult<LoyaltyCustomer[]>> {
  return withMockFallback("loyalty.list", initialLoyaltyCustomers, async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, loyalty_points, updated_at")
      .eq("role", "customer")
      .order("loyalty_points", { ascending: false })
      .limit(20);

    if (error) return { data: null, error };
    if (!data?.length) return { data: null, error: null };

    const rows: LoyaltyCustomer[] = data.map((r: Record<string, unknown>) => {
      const pts = Number(r.loyalty_points ?? 0);
      return {
        id: String(r.id),
        name: String(r.full_name ?? "—"),
        phone: String(r.phone ?? "—"),
        points: pts,
        lastVisit: r.updated_at ? new Date(String(r.updated_at)).toLocaleDateString("ar-SA") : "—",
        tier: tierForPoints(pts),
      };
    });
    return { data: rows, error: null };
  });
}
