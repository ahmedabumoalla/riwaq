import type { Metadata } from "next";
import { CustomerMenuView } from "@/components/customer/views/menu-view";

export const metadata: Metadata = {
  title: "المنيو",
};

export default function CustomerMenuPage() {
  return <CustomerMenuView />;
}
