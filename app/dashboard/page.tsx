import type { Metadata } from "next";
import ExecutiveDashboard from "@/components/dashboard/executive/executive-dashboard";

export const metadata: Metadata = {
  title: "لوحة التحكم — الرئيسية",
};

export default function DashboardHomePage() {
  return <ExecutiveDashboard />;
}
