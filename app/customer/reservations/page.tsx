import type { Metadata } from "next";
import { CustomerReservationsView } from "@/components/customer/views/reservations-view";

export const metadata: Metadata = {
  title: "حجوزاتي",
};

export default function CustomerReservationsPage() {
  return <CustomerReservationsView />;
}
