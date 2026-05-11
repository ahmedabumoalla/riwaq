import type { Metadata } from "next";
import { NearbyCafesMap } from "@/components/map/nearby-cafes-map";

export const metadata: Metadata = {
  title: "خريطة الكافيهات",
};

export default function CustomerMapPage() {
  return <NearbyCafesMap />;
}
