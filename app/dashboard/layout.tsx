import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | رِواق",
    default: "لوحة التحكم",
  },
  description: "لوحة تشغيل الكافيه — طلبات، حجوزات، ولاء، وحملات.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
