import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import type { DataLoad } from "@/lib/types/data-load";
import { mapSupabaseError } from "@/lib/types/data-load";
import {
  initialMenuProducts,
  type MenuProduct,
  type MenuCategory,
  type MenuImageVariant,
} from "@/lib/mock/menu";

function rowToMenuProduct(row: {
  id: string;
  name: string;
  description: string | null;
  price: number;
  calories: number | null;
  ingredients: string | null;
  promo_label: string | null;
  loyalty_points: number | null;
  is_active: boolean | null;
}): MenuProduct {
  const ingredients = row.ingredients?.split(/،|,/).map((s) => s.trim()).filter(Boolean) ?? [];
  return {
    id: row.id,
    name: row.name,
    category: "قهوة" as MenuCategory,
    description: row.description ?? "",
    imageVariant: "latte" as MenuImageVariant,
    price: Number(row.price),
    calories: row.calories ?? 0,
    loyaltyPoints: row.loyalty_points ?? 0,
    ingredients: ingredients.length ? ingredients : ["—"],
    available: row.is_active !== false,
    promo: row.promo_label
      ? {
          kind: "عرض مخصص",
          customText: row.promo_label,
          startDate: "2026-01-01",
          endDate: "2026-12-31",
        }
      : null,
  };
}

export async function loadMenuForCafe(supabase: SupabaseClient, cafeId: string): Promise<DataLoad<MenuProduct[]>> {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, description, price, calories, ingredients, promo_label, loyalty_points, is_active")
      .eq("cafe_id", cafeId)
      .order("sort_order", { ascending: true })
      .limit(500);
    if (error) return { status: "error", message: error.message };
    if (!data?.length) return { status: "empty" };
    return { status: "ok", data: data.map((r) => rowToMenuProduct(r as never)) };
  } catch (e) {
    return { status: "error", message: mapSupabaseError(e) };
  }
}

export async function listMenuProducts(
  supabase: SupabaseClient,
  cafeId?: string | null,
): Promise<DataResult<MenuProduct[]>> {
  return withMockFallback("menu.list", initialMenuProducts, async () => {
    let q = supabase.from("menu_items").select("id, name, description, price, calories, ingredients, promo_label, loyalty_points, is_active").limit(200);
    if (cafeId) q = q.eq("cafe_id", cafeId);
    const { data, error } = await q;
    if (error) return { data: null, error };
    if (!data?.length) return { data: null, error: null };
    return { data: data.map((r) => rowToMenuProduct(r as never)), error: null };
  });
}
