import type { Metadata } from "next";
import { TablesPageClient } from "@/components/dashboard/pages/tables-page-client";

export const metadata: Metadata = {
  title: "الطاولات",
};

export default function DashboardTablesPage() {
  return <TablesPageClient />;
}
