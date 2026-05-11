import type { Metadata } from "next";
import { ReportsPageClient } from "@/components/dashboard/pages/reports-page-client";

export const metadata: Metadata = {
  title: "التقارير",
};

export default function DashboardReportsPage() {
  return <ReportsPageClient />;
}
