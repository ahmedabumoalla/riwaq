import type { Metadata } from "next";
import { MenuPageClient } from "@/components/dashboard/pages/menu-page";

export const metadata: Metadata = {
  title: "المنيو الرقمي",
};

export default function DashboardMenuPage() {
  return <MenuPageClient />;
}
