import type { Metadata } from "next";
import { EmployeesPageClient } from "@/components/dashboard/pages/employees-page";

export const metadata: Metadata = {
  title: "الموظفون",
};

export default function DashboardEmployeesPage() {
  return <EmployeesPageClient />;
}
