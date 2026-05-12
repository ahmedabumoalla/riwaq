import type { Metadata } from "next";
import { ReservationsPageClient } from "@/components/dashboard/reservations/reservations-center-page";
import { DataErrorState } from "@/components/ui/data-state";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { loadDashboardReservations } from "@/lib/data/dashboard-reservations";
import { loadDashboardTables, loadTableLabelToIdMap } from "@/lib/data/dashboard-tables";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "الحجوزات",
};

export default async function DashboardReservationsPage() {
  const ctx = await getOwnerCafeContext();
  if (!ctx?.branchIds.length) {
    return (
      <div className="px-4 py-10">
        <DataErrorState message="لم يُعثر على فروع لهذا الكوفي." />
      </div>
    );
  }
  const supabase = await createClient();
  const labelMap = await loadTableLabelToIdMap(supabase, ctx.branchIds);
  const [resLoad, tblLoad] = await Promise.all([
    loadDashboardReservations(supabase, ctx.branchIds, labelMap),
    loadDashboardTables(supabase, ctx.branchIds),
  ]);

  if (resLoad.status === "error") {
    return (
      <div className="px-4 py-10">
        <DataErrorState message={resLoad.message} />
      </div>
    );
  }
  if (tblLoad.status === "error") {
    return (
      <div className="px-4 py-10">
        <DataErrorState message={tblLoad.message} />
      </div>
    );
  }

  return (
    <ReservationsPageClient
      initialReservations={resLoad.status === "ok" ? resLoad.data : []}
      initialManagedTables={tblLoad.status === "ok" ? tblLoad.data : []}
    />
  );
}
