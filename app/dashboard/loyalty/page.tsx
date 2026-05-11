import type { Metadata } from "next";
import { LoyaltyPageClient } from "@/components/dashboard/pages/loyalty-page";

export const metadata: Metadata = {
  title: "الولاء",
};

export default function DashboardLoyaltyPage() {
  return <LoyaltyPageClient />;
}
