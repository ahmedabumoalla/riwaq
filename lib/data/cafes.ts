import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import type { DataLoad } from "@/lib/types/data-load";
import { mapSupabaseError } from "@/lib/types/data-load";
import {
  mapCafes as mockMapCafes,
  type MapCafe,
  type CoffeeStyle,
  type CrowdLevel,
  type PriceTier,
  type ProductTag,
  type ViewType,
} from "@/lib/mock/map-cafes";

type CafeRow = {
  id: string;
  name: string;
  slug: string | null;
  region: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  review_count: number | null;
  map_extras: Record<string, unknown> | null;
  branches?: Array<{
    id: string;
    name: string;
    city: string | null;
    lat: number | null;
    lng: number | null;
    is_active: boolean | null;
  }> | null;
};

function defaultsFromExtras(ex: Record<string, unknown> | null | undefined): Partial<MapCafe> {
  if (!ex || typeof ex !== "object") return {};
  const g = <K extends keyof MapCafe>(k: K, d: MapCafe[K]): MapCafe[K] => (ex[k as string] as MapCafe[K]) ?? d;
  return {
    hoursLabel: g("hoursLabel", "٨ ص — ١٢ م"),
    crowd: (ex.crowd as CrowdLevel) ?? "medium",
    coffeeStyle: (ex.coffeeStyle as CoffeeStyle) ?? "mixed",
    productTags: (ex.productTags as ProductTag[]) ?? ["specialty_coffee"],
    viewTypes: (ex.viewTypes as ViewType[]) ?? ["interior"],
    priceTier: (ex.priceTier as PriceTier) ?? "mid",
    tablesAvailableNow: Boolean(ex.tablesAvailableNow),
    hasPartition: Boolean(ex.hasPartition),
    hasHeater: Boolean(ex.hasHeater),
    hasScreen: Boolean(ex.hasScreen),
    activeOffers: Boolean(ex.activeOffers),
    loyaltyPointsHigh: Boolean(ex.loyaltyPointsHigh),
    workStudyFriendly: ex.workStudyFriendly !== false,
    familyFriendly: ex.familyFriendly !== false,
    heroImage: (ex.heroImage as string) ?? "/og-image.png",
    tagline: (ex.tagline as string) ?? "",
    address: (ex.address as string) ?? "",
    menuHighlights: (ex.menuHighlights as string[]) ?? [],
    tableLabels: (ex.tableLabels as string[]) ?? [],
    promos: (ex.promos as string[]) ?? [],
    loyaltySnippet: (ex.loyaltySnippet as string) ?? "",
    communityPreview: (ex.communityPreview as MapCafe["communityPreview"]) ?? [],
    reviews: (ex.reviews as MapCafe["reviews"]) ?? [],
  };
}

function mapRowToMapCafe(row: CafeRow): MapCafe {
  const b = row.branches?.find((x) => x.lat != null && x.lng != null) ?? row.branches?.[0];
  const lat = Number(row.lat ?? b?.lat ?? 24.7);
  const lng = Number(row.lng ?? b?.lng ?? 46.67);
  const ex = defaultsFromExtras(row.map_extras);
  const city = row.city ?? b?.city ?? "—";
  const region = row.region ?? city;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? row.id,
    region,
    city,
    lat,
    lng,
    rating: Number(row.rating ?? 4.5),
    reviewCount: row.review_count ?? 0,
    hoursLabel: ex.hoursLabel ?? "٨ ص — ١٢ م",
    crowd: ex.crowd ?? "medium",
    coffeeStyle: ex.coffeeStyle ?? "mixed",
    productTags: ex.productTags ?? ["specialty_coffee"],
    viewTypes: ex.viewTypes ?? ["interior"],
    priceTier: ex.priceTier ?? "mid",
    tablesAvailableNow: ex.tablesAvailableNow ?? false,
    hasPartition: ex.hasPartition ?? false,
    hasHeater: ex.hasHeater ?? false,
    hasScreen: ex.hasScreen ?? false,
    activeOffers: ex.activeOffers ?? false,
    loyaltyPointsHigh: ex.loyaltyPointsHigh ?? false,
    workStudyFriendly: ex.workStudyFriendly ?? true,
    familyFriendly: ex.familyFriendly ?? true,
    heroImage: ex.heroImage ?? "/og-image.png",
    tagline: ex.tagline ?? row.name,
    address: ex.address ?? `${city}`,
    menuHighlights: ex.menuHighlights ?? [],
    tableLabels: ex.tableLabels ?? (b?.name ? [b.name] : []),
    promos: ex.promos ?? [],
    loyaltySnippet: ex.loyaltySnippet ?? "",
    communityPreview: ex.communityPreview ?? [],
    reviews: ex.reviews ?? [],
  };
}

function firstRel<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

type CafeLocJoin = {
  id: string;
  lat: number;
  lng: number;
  label: string | null;
  cafe_id: string;
  cafes:
    | {
        id: string;
        name: string;
        slug: string | null;
        region: string | null;
        city: string | null;
        rating: number | null;
        review_count: number | null;
        map_extras: Record<string, unknown> | null;
      }
    | {
        id: string;
        name: string;
        slug: string | null;
        region: string | null;
        city: string | null;
        rating: number | null;
        review_count: number | null;
        map_extras: Record<string, unknown> | null;
      }[]
    | null;
};

/** خريطة العميل — من cafe_locations + cafés (RLS) — حد أقصى للصفوف ثم إزالة تكرار cafe_id */
export async function loadMapCafesFromLocations(supabase: SupabaseClient): Promise<DataLoad<MapCafe[]>> {
  try {
    const { data, error } = await supabase
      .from("cafe_locations")
      .select("id, lat, lng, label, cafe_id, cafes(id, name, slug, region, city, rating, review_count, map_extras)")
      .order("sort_order", { ascending: true })
      .limit(20);

    if (error) return { status: "error", message: error.message };
    if (!data?.length) return { status: "empty" };

    const mapped = (data as CafeLocJoin[]).map((loc) => {
      const c = firstRel(loc.cafes);
      if (!c) return null;
      const row: CafeRow = {
        id: c.id,
        name: c.name,
        slug: c.slug,
        region: c.region,
        city: c.city,
        lat: loc.lat,
        lng: loc.lng,
        rating: c.rating,
        review_count: c.review_count,
        map_extras: c.map_extras,
        branches: null,
      };
      return mapRowToMapCafe(row);
    });

    const list = mapped.filter(Boolean) as MapCafe[];
    const seen = new Set<string>();
    const deduped: MapCafe[] = [];
    for (const c of list) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      deduped.push(c);
    }
    if (!deduped.length) return { status: "empty" };
    return { status: "ok", data: deduped };
  } catch (e) {
    return { status: "error", message: mapSupabaseError(e) };
  }
}

/** كافيهات للخريطة — عميل anon/جلسة + RLS */
export async function listMapCafes(supabase: SupabaseClient): Promise<DataResult<MapCafe[]>> {
  return withMockFallback("cafes.listMap", mockMapCafes, async () => {
    const { data, error } = await supabase
      .from("cafes")
      .select(
        "id, name, slug, region, city, lat, lng, rating, review_count, map_extras, branches(id, name, city, lat, lng, is_active)",
      )
      .limit(20);

    if (error) return { data: null, error };
    if (!data?.length) return { data: null, error: null };
    return { data: (data as unknown as CafeRow[]).map(mapRowToMapCafe), error: null };
  });
}

/** كوفي واحد للصفحة العامة */
export async function getMapCafeByIdData(supabase: SupabaseClient, id: string): Promise<DataResult<MapCafe | null>> {
  const fallback = mockMapCafes.find((c) => c.id === id) ?? null;
  return withMockFallback(
    "cafes.byId",
    fallback,
    async () => {
      const { data, error } = await supabase
        .from("cafes")
        .select(
          "id, name, slug, region, city, lat, lng, rating, review_count, map_extras, branches(id, name, city, lat, lng, is_active)",
        )
        .eq("id", id)
        .maybeSingle();

      if (error) return { data: null, error };
      if (!data) return { data: null, error: null };
      return { data: mapRowToMapCafe(data as unknown as CafeRow), error: null };
    },
  );
}
