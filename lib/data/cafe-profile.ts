import type { SupabaseClient } from "@supabase/supabase-js";
import type { OwnerCafeContext } from "@/lib/data/cafe-context";

export type CafeProfilePayload = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  email: string;
  websiteUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  snapchatUrl: string;
  xUrl: string;
  whatsappUrl: string;
  welcomeMessage: string;
  generalDiscountPercent: number;
  openingHours: unknown;
  mapVisibility: boolean;
  latitude: number | null;
  longitude: number | null;
  city: string;
  district: string;
  address: string;
  googleMapsUrl: string;
  gallery: string[];
};

export const emptyCafeProfile: CafeProfilePayload = {
  id: "",
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  coverUrl: "",
  phone: "",
  email: "",
  websiteUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  snapchatUrl: "",
  xUrl: "",
  whatsappUrl: "",
  welcomeMessage: "",
  generalDiscountPercent: 0,
  openingHours: {},
  mapVisibility: true,
  latitude: null,
  longitude: null,
  city: "",
  district: "",
  address: "",
  googleMapsUrl: "",
  gallery: [],
};

export async function loadOwnerCafeProfile(
  supabase: SupabaseClient,
  ctx: OwnerCafeContext,
): Promise<CafeProfilePayload | null> {
  const { data, error } = await supabase
    .from("cafes")
    .select(
      "id, name, slug, description, logo_url, cover_url, phone, email, website_url, instagram_url, tiktok_url, snapchat_url, x_url, whatsapp_url, welcome_message, general_discount_percent, opening_hours, map_visibility",
    )
    .eq("id", ctx.cafeId)
    .maybeSingle();
  if (error || !data) return null;

  const locRes = await supabase
    .from("cafe_locations")
    .select("latitude, longitude, city, district, address, google_maps_url")
    .eq("cafe_id", ctx.cafeId)
    .limit(1)
    .maybeSingle();

  let gallery: string[] = [];
  try {
    const gRes = await supabase.from("cafe_gallery_images").select("image_url").eq("cafe_id", ctx.cafeId).limit(20);
    gallery = (gRes.data ?? [])
      .map((r) => (r as { image_url?: string }).image_url)
      .filter((v): v is string => Boolean(v));
  } catch {
    gallery = [];
  }

  const row = data as Record<string, unknown>;
  const loc = (locRes.data as Record<string, unknown> | null) ?? null;

  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    description: String(row.description ?? ""),
    logoUrl: String(row.logo_url ?? ""),
    coverUrl: String(row.cover_url ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    websiteUrl: String(row.website_url ?? ""),
    instagramUrl: String(row.instagram_url ?? ""),
    tiktokUrl: String(row.tiktok_url ?? ""),
    snapchatUrl: String(row.snapchat_url ?? ""),
    xUrl: String(row.x_url ?? ""),
    whatsappUrl: String(row.whatsapp_url ?? ""),
    welcomeMessage: String(row.welcome_message ?? ""),
    generalDiscountPercent: Number(row.general_discount_percent ?? 0),
    openingHours: row.opening_hours ?? {},
    mapVisibility: row.map_visibility !== false,
    latitude: loc?.latitude ? Number(loc.latitude) : null,
    longitude: loc?.longitude ? Number(loc.longitude) : null,
    city: String(loc?.city ?? ""),
    district: String(loc?.district ?? ""),
    address: String(loc?.address ?? ""),
    googleMapsUrl: String(loc?.google_maps_url ?? ""),
    gallery,
  };
}
