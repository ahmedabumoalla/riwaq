import type { Metadata } from "next";
import { OrdersPageClient } from "@/components/dashboard/orders/orders-operations-page";
import { DataErrorState } from "@/components/ui/data-state";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { loadDashboardOrders } from "@/lib/data/dashboard-orders";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "الطلبات",
};

export default async function DashboardOrdersPage() {
  const ctx = await getOwnerCafeContext();
  if (!ctx?.branchIds.length) {
    return (
      <div className="px-4 py-10">
        <DataErrorState message="لم يُعثر على فروع لهذا الكوفي." />
      </div>
    );
  }
  const supabase = await createClient();
  const load = await loadDashboardOrders(supabase, ctx.branchIds);
  if (load.status === "error") {
    return (
      <div className="px-4 py-10">
        <DataErrorState message={load.message} />
      </div>
    );
  }
  return <OrdersPageClient initialOrders={load.status === "ok" ? load.data : []} />;
}
