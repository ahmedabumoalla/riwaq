import type { Metadata } from "next";
import { CustomersPageClient } from "@/components/dashboard/pages/customers-page-client";

export const metadata: Metadata = {
  title: "العملاء",
};

export default function DashboardCustomersPage() {
  return <CustomersPageClient />;
}
