import type { Metadata } from "next";
import { CustomerOrdersView } from "@/components/customer/views/orders-view";

export const metadata: Metadata = {
  title: "طلباتي",
};

export default function CustomerOrdersPage() {
  return <CustomerOrdersView />;
}
