import type { Metadata } from "next";
import { TablesPageClient } from "@/components/dashboard/pages/tables-page-client";
import { DataErrorState } from "@/components/ui/data-state";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { loadDashboardTables } from "@/lib/data/dashboard-tables";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "الطاولات",
};

export default async function DashboardTablesPage() {
  const ctx = await getOwnerCafeContext();
  if (!ctx?.branchIds.length) {
    return (
      <div className="px-4 py-10">
        <DataErrorState message="لم يُعثر على فروع لهذا الكوفي. أضف فرعًا في جدول branches." />
      </div>
    );
  }
  const supabase = await createClient();
  const load = await loadDashboardTables(supabase, ctx.branchIds);
  if (load.status === "error") {
    return (
      <div className="px-4 py-10">
        <DataErrorState message={load.message} />
      </div>
    );
  }
  return <TablesPageClient initialTables={load.status === "ok" ? load.data : []} />;
}
