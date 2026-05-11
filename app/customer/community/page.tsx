import type { Metadata } from "next";
import { CustomerCommunityView } from "@/components/customer/views/community-view";

export const metadata: Metadata = {
  title: "المجتمع",
};

export default function CustomerCommunityPage() {
  return <CustomerCommunityView />;
}
