import "server-only";

import { createClient } from "@/lib/supabase/server";

export type OwnerCafeContext = { cafeId: string; branchIds: string[] };

/** أول كوفي يملكها المستخدم الحالي + فروعه (لوحة الكوفي). */
export async function getOwnerCafeContext(): Promise<OwnerCafeContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: cafe, error: cafeErr } = await supabase.from("cafes").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
  if (cafeErr || !cafe?.id) return null;

  const { data: branches } = await supabase.from("branches").select("id").eq("cafe_id", cafe.id);
  return { cafeId: cafe.id, branchIds: (branches ?? []).map((b: { id: string }) => b.id) };
}
