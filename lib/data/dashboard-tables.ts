import type { SupabaseClient } from "@supabase/supabase-js";
import type { DataLoad } from "@/lib/types/data-load";
import { mapSupabaseError } from "@/lib/types/data-load";
import { seedManagedTables, type ManagedTable, type TableOperationalStatus } from "@/lib/mock/reservations-center";

function mapDbTableStatus(isActive: boolean | null): TableOperationalStatus {
  return isActive === false ? "out_of_service" : "available";
}

export async function loadDashboardTables(supabase: SupabaseClient, branchIds: string[]): Promise<DataLoad<ManagedTable[]>> {
  if (!branchIds.length) return { status: "empty" };
  try {
    const { data, error } = await supabase
      .from("cafe_tables")
      .select("id, label, capacity, floor_label, is_active, branch_id")
      .in("branch_id", branchIds)
      .order("label", { ascending: true });

    if (error) return { status: "error", message: error.message };
    if (!data?.length) return { status: "empty" };

    const templates = seedManagedTables(new Date());
    const merged: ManagedTable[] = (data as Record<string, unknown>[]).map((r, i) => {
      const base = templates[i % templates.length]!;
      return {
        ...base,
        id: String(r.id),
        label: String(r.label ?? base.label),
        displayName: `${String(r.label ?? base.label)}${r.floor_label ? ` — ${String(r.floor_label)}` : ""}`,
        capacity: Number(r.capacity ?? base.capacity),
        status: mapDbTableStatus(r.is_active as boolean | null),
      };
    });

    return { status: "ok", data: merged };
  } catch (e) {
    return { status: "error", message: mapSupabaseError(e) };
  }
}

/** خريطة branch_id + label → id للحجوزات */
export async function loadTableLabelToIdMap(
  supabase: SupabaseClient,
  branchIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!branchIds.length) return map;
  const { data } = await supabase.from("cafe_tables").select("id, label, branch_id").in("branch_id", branchIds);
  for (const t of data ?? []) {
    const row = t as { id: string; label: string; branch_id: string };
    map.set(`${row.branch_id}:${row.label}`, row.id);
  }
  return map;
}
