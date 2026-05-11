import type { Metadata } from "next";
import { OrdersPageClient } from "@/components/dashboard/pages/orders-page";

export const metadata: Metadata = {
  title: "الطلبات",
};

export default function DashboardOrdersPage() {
  return <OrdersPageClient />;
}
