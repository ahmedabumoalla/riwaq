import type { Metadata } from "next";
import { CustomerCommunityView } from "@/components/customer/views/community-view";
import { DataEmptyState, DataErrorState } from "@/components/ui/data-state";
import { loadApprovedCommunityPosts } from "@/lib/data/community";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "المجتمع",
};

export default async function CustomerCommunityPage() {
  const supabase = await createClient();
  const load = await loadApprovedCommunityPosts(supabase);

  if (load.status === "error") {
    return (
      <div className="min-w-0 space-y-8 px-1 py-8">
        <DataErrorState message={load.message} />
      </div>
    );
  }

  if (load.status === "empty") {
    return (
      <div className="min-w-0 space-y-8 px-1 py-8">
        <DataEmptyState title="لا منشورات معتمدة بعد" description="ستظهر هنا المنشورات التي وافق عليها الكافيهات (حالة approved)." />
      </div>
    );
  }

  return <CustomerCommunityView posts={load.data} />;
}
