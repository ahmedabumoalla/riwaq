import type { Metadata } from "next";
import { MenuPageClient } from "@/components/dashboard/pages/menu-page";
import { DataErrorState } from "@/components/ui/data-state";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { loadMenuForCafe } from "@/lib/data/menu";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "المنيو الرقمي",
};

export default async function DashboardMenuPage() {
  const ctx = await getOwnerCafeContext();
  if (!ctx) {
    return (
      <div className="px-4 py-10">
        <DataErrorState message="لم يُعثر على كوفي مرتبط بحسابك." />
      </div>
    );
  }
  const supabase = await createClient();
  const load = await loadMenuForCafe(supabase, ctx.cafeId);
  if (load.status === "error") {
    return (
      <div className="px-4 py-10">
        <DataErrorState message={load.message} />
      </div>
    );
  }
  return <MenuPageClient initialProducts={load.status === "ok" ? load.data : []} />;
}
