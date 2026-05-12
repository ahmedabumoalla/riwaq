import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import { mockCustomerOrders, type CustomerOrder } from "@/lib/mock/customer-app";

export async function listCustomerOrders(supabase: SupabaseClient, customerId: string): Promise<DataResult<CustomerOrder[]>> {
  return withMockFallback("orders.customer", mockCustomerOrders, async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, total, created_at, meta")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return { data: null, error };
    if (!data?.length) return { data: null, error: null };

    const mapped: CustomerOrder[] = data.map((row: Record<string, unknown>) => {
      const meta = (row.meta as {
        items?: { name: string; qty: number; price: number }[];
        timeline?: CustomerOrder["timeline"];
        promo?: string;
        etaMin?: number;
      }) ?? {};
      return {
        id: String(row.id),
        status: String(row.status ?? "مكتمل"),
        total: Number(row.total ?? 0),
        etaMin: meta.etaMin,
        items: meta.items ?? [{ name: "—", qty: 1, price: Number(row.total ?? 0) }],
        promo: meta.promo,
        timeline: meta.timeline ?? [
          { step: "تم الاستلام", done: true },
          { step: "قيد التجهيز", done: String(row.status) !== "pending" },
        ],
      };
    });
    return { data: mapped, error: null };
  });
}
