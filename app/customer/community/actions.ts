"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PostKind } from "@/lib/mock/community";

export type CreatePostResult = { ok: true } | { ok: false; message: string };

export async function createCustomerCommunityPostAction(input: {
  cafeId: string;
  postKind: PostKind;
  body: string;
  hashtags: string[];
  mediaType: "none" | "image" | "video";
  productName?: string;
  tableLabel?: string;
  rewardEligible: boolean;
}): Promise<CreatePostResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "يجب تسجيل الدخول." };

  const { error } = await supabase.from("community_posts").insert({
    author_id: user.id,
    cafe_id: input.cafeId,
    post_kind: input.postKind,
    body: input.body.trim(),
    hashtags: input.hashtags,
    media_type: input.mediaType,
    media_placeholder: input.mediaType === "none" ? "" : "معاينة",
    review_status: "pending",
    reward_eligible: input.rewardEligible,
    reward_points_preview: input.rewardEligible ? 120 : 0,
    product_name: input.productName?.trim() || null,
    table_label: input.tableLabel?.trim() || null,
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/customer/community");
  return { ok: true };
}
