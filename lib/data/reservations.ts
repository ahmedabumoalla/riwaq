import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import { initialReservationRows, type ReservationRow } from "@/lib/mock/reservations-table";

export async function listReservationRows(
  supabase: SupabaseClient,
  branchId: string | null,
): Promise<DataResult<ReservationRow[]>> {
  return withMockFallback("reservations.list", initialReservationRows, async () => {
    let q = supabase.from("reservations").select("id, status, party_size, starts_at, table_label, meta").limit(100);
    if (branchId) q = q.eq("branch_id", branchId);
    const { data, error } = await q.order("starts_at", { ascending: true });
    if (error) return { data: null, error };
    if (!data?.length) return { data: null, error: null };

    const statusMap: Record<string, ReservationRow["status"]> = {
      pending: "في الانتظار",
      confirmed: "مؤكد",
      rejected: "مرفوض",
    };

    const rows: ReservationRow[] = data.map((r: Record<string, unknown>) => ({
      id: String(r.id),
      customer: String((r.meta as { guestName?: string })?.guestName ?? "ضيف"),
      guests: Number(r.party_size ?? 2),
      time: r.starts_at ? new Date(String(r.starts_at)).toLocaleTimeString("ar-SA", { hour: "numeric", minute: "2-digit" }) : "—",
      tableNumber: String(r.table_label ?? "—"),
      status: statusMap[String(r.status)] ?? "في الانتظار",
    }));
    return { data: rows, error: null };
  });
}
