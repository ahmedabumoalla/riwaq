import type { Metadata } from "next";
import { CustomerLoyaltyView } from "@/components/customer/views/loyalty-view";

export const metadata: Metadata = {
  title: "الولاء ونقاطي",
};

export default function CustomerLoyaltyPage() {
  return <CustomerLoyaltyView />;
}
