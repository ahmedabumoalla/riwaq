import type { Metadata } from "next";
import { CampaignsPageClient } from "@/components/dashboard/pages/campaigns-page";

export const metadata: Metadata = {
  title: "الحملات",
};

export default function DashboardCampaignsPage() {
  return <CampaignsPageClient />;
}
