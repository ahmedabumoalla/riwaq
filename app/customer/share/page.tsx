import type { Metadata } from "next";
import { CustomerShareView } from "@/components/customer/views/share-view";

export const metadata: Metadata = {
  title: "شارك تجربتك",
};

export default function CustomerSharePage() {
  return <CustomerShareView />;
}
