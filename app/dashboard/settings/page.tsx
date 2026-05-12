import type { Metadata } from "next";
import { CafeProfileSettingsClient } from "@/components/dashboard/settings/cafe-profile-settings-client";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { listCafePromotions } from "@/lib/data/cafe-promotions";
import { emptyCafeProfile, loadOwnerCafeProfile } from "@/lib/data/cafe-profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "الإعدادات",
};

export default async function DashboardSettingsPage() {
  const supabase = await createClient();
  const ctx = await getOwnerCafeContext();
  if (!ctx) {
    return (
      <div className="rounded-3xl border border-riwaq-beige bg-white/90 p-6 text-sm font-bold text-riwaq-muted">
        لا يوجد كوفي مرتبط بحسابك حاليًا.
      </div>
    );
  }

  const profile = (await loadOwnerCafeProfile(supabase, ctx)) ?? { ...emptyCafeProfile, id: ctx.cafeId };
  const promotions = await listCafePromotions(supabase, ctx.cafeId, false);

  return <CafeProfileSettingsClient initialProfile={profile} initialPromotions={promotions} />;
}
