import type { Metadata } from "next";
import { ReservationsPageClient } from "@/components/dashboard/pages/reservations-page";

export const metadata: Metadata = {
  title: "الحجوزات",
};

export default function DashboardReservationsPage() {
  return <ReservationsPageClient />;
}
