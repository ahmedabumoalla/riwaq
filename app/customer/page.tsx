import type { Metadata } from "next";
import { CustomerHomeView } from "@/components/customer/views/home-view";

export const metadata: Metadata = {
  title: "الرئيسية",
};

export default function CustomerHomePage() {
  return <CustomerHomeView />;
}
