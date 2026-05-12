import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import { buildDirectionsUrl, isCafeOpenNow, toHoursLabel } from "@/lib/data/map-cafes";
import type { DataLoad } from "@/lib/types/data-load";
import { mapSupabaseError } from "@/lib/types/data-load";
import {
  mapCafes as mockMapCafes,
  type MapCafe,
  type PriceTier,
  type ViewType,
} from "@/lib/mock/map-cafes";

type CafeRow = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  cover_url: string | null;
  opening_hours: unknown;
  general_discount_percent: number | null;
  map_visibility: boolean | null;
  location?: {
    latitude: number | null;
    longitude: number | null;
    city: string | null;
    district: string | null;
    address: string | null;
    google_maps_url: string | null;
    view_types: string[] | null;
    price_level: string | null;
  } | null;
};

function mapRowToMapCafe(row: CafeRow): MapCafe {
  const loc = row.location ?? null;
  const lat = Number(loc?.latitude ?? 24.7);
  const lng = Number(loc?.longitude ?? 46.67);
  const city = loc?.city ?? "—";
  const region = city;
  const vts = loc?.view_types ?? [];
  const viewTypes = (vts.filter((v) =>
    ["interior", "outdoor", "roof", "mountain", "sea", "garden"].includes(v)
  ) as ViewType[]) || [];
  const priceTier: PriceTier =
    loc?.price_level === "budget" || loc?.price_level === "mid" || loc?.price_level === "premium"
      ? loc.price_level
      : "mid";
  const isOpenNow = isCafeOpenNow(row.opening_hours);
  const directionsUrl = buildDirectionsUrl(loc?.google_maps_url, lat, lng);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? row.id,
    region,
    city,
    lat,
    lng,
    rating: 4.5,
    reviewCount: 0,
    hoursLabel: toHoursLabel(row.opening_hours),
    crowd: "medium",
    coffeeStyle: "mixed",
    productTags: ["specialty_coffee"],
    viewTypes: viewTypes.length ? viewTypes : ["interior"],
    priceTier,
    tablesAvailableNow: isOpenNow,
    hasPartition: false,
    hasHeater: false,
    hasScreen: false,
    activeOffers: Number(row.general_discount_percent ?? 0) > 0,
    loyaltyPointsHigh: false,
    workStudyFriendly: true,
    familyFriendly: true,
    heroImage: row.cover_url ?? "/og-image.png",
    tagline: row.description ?? row.name,
    address: loc?.address ?? [loc?.district, city].filter(Boolean).join("، "),
    menuHighlights: [],
    tableLabels: [],
    promos:
      Number(row.general_discount_percent ?? 0) > 0
        ? [`خصم عام ${Number(row.general_discount_percent).toLocaleString("ar-SA")}%`]
        : [],
    loyaltySnippet: "",
    communityPreview: [],
    reviews: [],
    googleMapsUrl: directionsUrl,
    isOpenNow,
  };
}

function firstRel<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

type CafeLocJoin = {
  cafe_id: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  district: string | null;
  address: string | null;
  google_maps_url: string | null;
  is_visible: boolean | null;
  view_types: string[] | null;
  price_level: string | null;
  cafes:
    | {
        id: string;
        name: string;
        slug: string | null;
        description: string | null;
        cover_url: string | null;
        opening_hours: unknown;
        general_discount_percent: number | null;
        map_visibility: boolean | null;
      }
    | {
        id: string;
        name: string;
        slug: string | null;
        description: string | null;
        cover_url: string | null;
        opening_hours: unknown;
        general_discount_percent: number | null;
        map_visibility: boolean | null;
      }[]
    | null;
};

/** خريطة العميل — من cafe_locations + cafés (RLS) — حد أقصى للصفوف ثم إزالة تكرار cafe_id */
export async function loadMapCafesFromLocations(supabase: SupabaseClient): Promise<DataLoad<MapCafe[]>> {
  try {
    const { data, error } = await supabase
      .from("cafe_locations")
      .select(
        "cafe_id, latitude, longitude, city, district, address, google_maps_url, is_visible, view_types, price_level, cafes(id, name, slug, description, cover_url, opening_hours, general_discount_percent, map_visibility)",
      )
      .eq("is_visible", true)
      .limit(20);

    if (error) return { status: "error", message: error.message };
    if (!data?.length) return { status: "empty" };

    const mapped = (data as CafeLocJoin[]).map((loc) => {
      const c = firstRel(loc.cafes);
      if (!c || c.map_visibility === false) return null;
      const row: CafeRow = {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        cover_url: c.cover_url,
        opening_hours: c.opening_hours,
        general_discount_percent: c.general_discount_percent,
        map_visibility: c.map_visibility,
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          city: loc.city,
          district: loc.district,
          address: loc.address,
          google_maps_url: loc.google_maps_url,
          view_types: loc.view_types,
          price_level: loc.price_level,
        },
      };
      const mappedCafe = mapRowToMapCafe(row);
      return mappedCafe.isOpenNow ? mappedCafe : null;
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
      .from("cafe_locations")
      .select(
        "cafe_id, latitude, longitude, city, district, address, google_maps_url, is_visible, view_types, price_level, cafes(id, name, slug, description, cover_url, opening_hours, general_discount_percent, map_visibility)",
      )
      .eq("is_visible", true)
      .limit(20);

    if (error) return { data: null, error };
    if (!data?.length) return { data: null, error: null };
    const list = (data as CafeLocJoin[])
      .map((loc) => {
        const c = firstRel(loc.cafes);
        if (!c || c.map_visibility === false) return null;
        const row: CafeRow = {
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          cover_url: c.cover_url,
          opening_hours: c.opening_hours,
          general_discount_percent: c.general_discount_percent,
          map_visibility: c.map_visibility,
          location: {
            latitude: loc.latitude,
            longitude: loc.longitude,
            city: loc.city,
            district: loc.district,
            address: loc.address,
            google_maps_url: loc.google_maps_url,
            view_types: loc.view_types,
            price_level: loc.price_level,
          },
        };
        const mappedCafe = mapRowToMapCafe(row);
        return mappedCafe.isOpenNow ? mappedCafe : null;
      })
      .filter(Boolean) as MapCafe[];
    return { data: list, error: null };
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
          "id, name, slug, description, cover_url, opening_hours, general_discount_percent, map_visibility, cafe_locations(latitude, longitude, city, district, address, google_maps_url, is_visible, view_types, price_level)",
        )
        .eq("id", id)
        .maybeSingle();

      if (error) return { data: null, error };
      if (!data) return { data: null, error: null };
      const row = data as unknown as {
        id: string;
        name: string;
        slug: string | null;
        description: string | null;
        cover_url: string | null;
        opening_hours: unknown;
        general_discount_percent: number | null;
        map_visibility: boolean | null;
        cafe_locations:
          | {
              latitude: number | null;
              longitude: number | null;
              city: string | null;
              district: string | null;
              address: string | null;
              google_maps_url: string | null;
              is_visible: boolean | null;
              view_types: string[] | null;
              price_level: string | null;
            }[]
          | null;
      };
      const loc = row.cafe_locations?.find((x) => x.is_visible !== false) ?? row.cafe_locations?.[0] ?? null;
      const mapped = mapRowToMapCafe({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        cover_url: row.cover_url,
        opening_hours: row.opening_hours,
        general_discount_percent: row.general_discount_percent,
        map_visibility: row.map_visibility,
        location: loc,
      });
      return { data: mapped, error: null };
    },
  );
}
