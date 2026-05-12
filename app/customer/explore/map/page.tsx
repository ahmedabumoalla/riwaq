import type { Metadata } from "next";
import { NearbyCafesMap } from "@/components/map/nearby-cafes-map";
import { DataEmptyState, DataErrorState } from "@/components/ui/data-state";
import { loadMapCafesFromLocations } from "@/lib/data/cafes";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "الخريطة — استكشف",
};

export default async function CustomerExploreMapPage() {
  const supabase = await createClient();
  const load = await loadMapCafesFromLocations(supabase);

  if (load.status === "error") {
    return (
      <div className="px-4 py-10">
        <DataErrorState message={load.message} />
      </div>
    );
  }

  if (load.status === "empty") {
    return (
      <div className="px-4 py-10">
        <DataEmptyState
          title="لا مواقع على الخريطة"
          description="أضف صفوفًا في جدول cafe_locations مرتبطة بالكافيهات (lat/lng) لتظهر هنا."
        />
      </div>
    );
  }

  return <NearbyCafesMap variant="explore" initialCafes={load.data} />;
}
