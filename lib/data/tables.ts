import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import { seedManagedTables, type ManagedTable, type TableOperationalStatus } from "@/lib/mock/reservations-center";

function mapDbStatus(isActive: boolean | null): TableOperationalStatus {
  return isActive === false ? "out_of_service" : "available";
}

export async function listCafeTables(supabase: SupabaseClient, branchId: string | null): Promise<DataResult<ManagedTable[]>> {
  const mock = seedManagedTables(new Date());

  return withMockFallback("tables.list", mock, async () => {
    let q = supabase.from("cafe_tables").select("id, label, capacity, floor_label, is_active").limit(200);
    if (branchId) q = q.eq("branch_id", branchId);
    const { data, error } = await q;
    if (error) return { data: null, error };
    if (!data?.length) return { data: null, error: null };

    const merged: ManagedTable[] = (data as Record<string, unknown>[]).map((r, i) => {
      const base = mock[i % mock.length];
      return {
        ...base,
        id: String(r.id),
        label: String(r.label ?? base.label),
        displayName: `${String(r.label ?? base.label)} — ${String(r.floor_label ?? "")}`.trim(),
        capacity: Number(r.capacity ?? base.capacity),
        status: mapDbStatus(r.is_active as boolean | null),
      };
    });

    return { data: merged, error: null };
  });
}
