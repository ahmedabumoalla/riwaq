import type { Metadata } from "next";
import { DataEmptyState, DataErrorState } from "@/components/ui/data-state";
import { DashboardCommunityPageClient } from "@/components/dashboard/community/dashboard-community-page-client";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { loadCommunityPostsForCafe } from "@/lib/data/community";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "مجتمع الكوفي",
};

export default async function DashboardCommunityPage() {
  const ctx = await getOwnerCafeContext();
  if (!ctx) {
    return (
      <div className="px-4 py-8">
        <DataErrorState message="لم يُعثر على كوفي مرتبط بحسابك. تأكد أن دورك مالك كوفي وأن السجل موجود في جدول cafés." />
      </div>
    );
  }

  const supabase = await createClient();
  const load = await loadCommunityPostsForCafe(supabase, ctx.cafeId);

  if (load.status === "error") {
    return (
      <div className="px-4 py-8">
        <DataErrorState message={load.message} />
      </div>
    );
  }

  if (load.status === "empty") {
    return (
      <div className="space-y-6 px-4 py-8">
        <DataEmptyState title="لا منشورات بعد" description="عندما ينشر العملاء عن كوفيك ستظهر هنا." />
      </div>
    );
  }

  return <DashboardCommunityPageClient posts={load.data} />;
}
