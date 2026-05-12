import type { SupabaseClient } from "@supabase/supabase-js";

export type CafePromotionType = "banner" | "latest_products" | "contest";

export type CafePromotion = {
  id: string;
  cafeId: string;
  promoType: CafePromotionType;
  title: string;
  description: string;
  imageUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
};

function activeNow(row: CafePromotion, now = Date.now()) {
  if (!row.isActive) return false;
  const start = row.startsAt ? new Date(row.startsAt).getTime() : null;
  const end = row.endsAt ? new Date(row.endsAt).getTime() : null;
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

export async function listCafePromotions(
  supabase: SupabaseClient,
  cafeId: string,
  onlyActive = false,
): Promise<CafePromotion[]> {
  try {
    const { data, error } = await supabase
      .from("cafe_promotions")
      .select("id, cafe_id, promo_type, title, description, image_url, starts_at, ends_at, is_active")
      .eq("cafe_id", cafeId)
      .order("starts_at", { ascending: false })
      .limit(20);
    if (error || !data) return [];
    const rows = (data as Record<string, unknown>[]).map((r) => ({
      id: String(r.id),
      cafeId: String(r.cafe_id),
      promoType: String(r.promo_type ?? "banner") as CafePromotionType,
      title: String(r.title ?? ""),
      description: String(r.description ?? ""),
      imageUrl: r.image_url ? String(r.image_url) : null,
      startsAt: r.starts_at ? String(r.starts_at) : null,
      endsAt: r.ends_at ? String(r.ends_at) : null,
      isActive: Boolean(r.is_active),
    }));
    return onlyActive ? rows.filter((r) => activeNow(r)) : rows;
  } catch {
    return [];
  }
}
