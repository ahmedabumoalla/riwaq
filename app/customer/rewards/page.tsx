import type { Metadata } from "next";
import { CustomerRewardsView } from "@/components/customer/views/rewards-view";

export const metadata: Metadata = {
  title: "المكافآت",
};

export default function CustomerRewardsPage() {
  return <CustomerRewardsView />;
}
