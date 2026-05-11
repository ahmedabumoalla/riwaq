import type { Metadata } from "next";
import { NearbyCafesMap } from "@/components/map/nearby-cafes-map";

export const metadata: Metadata = {
  title: "الخريطة — استكشف",
};

export default function CustomerExploreMapPage() {
  return <NearbyCafesMap variant="explore" />;
}
