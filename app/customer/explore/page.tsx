import type { Metadata } from "next";
import { CustomerExploreView } from "@/components/customer/views/explore-view";

export const metadata: Metadata = {
  title: "استكشف الفرع",
};

export default function CustomerExplorePage() {
  return <CustomerExploreView />;
}
