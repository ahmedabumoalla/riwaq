import type { SupabaseClient } from "@supabase/supabase-js";
import { withMockFallback, type DataResult } from "@/lib/data/supabase-helpers";
import type { DataLoad } from "@/lib/types/data-load";
import { mapSupabaseError } from "@/lib/types/data-load";
import {
  communityPosts as mockPosts,
  type CommunityPost,
  type CommunityComment,
  type AuthorKind,
  type PostKind,
  type ReviewStatus,
} from "@/lib/mock/community";

type PostRow = {
  id: string;
  author_id: string;
  cafe_id: string | null;
  post_kind: string;
  media_type: string;
  media_placeholder: string | null;
  body: string;
  hashtags: string[] | null;
  likes_count: number;
  shares_count: number;
  saves_count: number;
  views_count: number;
  review_status: string;
  reports_count: number;
  reward_eligible: boolean;
  reward_points_preview: number;
  product_name: string | null;
  table_label: string | null;
  created_at: string;
  profiles?: { full_name: string | null; role: string | null } | { full_name: string | null; role: string | null }[] | null;
  cafes?: { name: string | null } | { name: string | null }[] | null;
};

function firstRel<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null;
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

function initials(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "؟";
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

function mapPostRow(row: PostRow, comments: CommunityComment[]): CommunityPost {
  const prof = firstRel(row.profiles);
  const cafe = firstRel(row.cafes);
  const authorName = prof?.full_name ?? "مستخدم";
  const authorKind: AuthorKind =
    prof?.role === "cafe_owner" || prof?.role === "branch_manager" ? "cafe" : "customer";
  return {
    id: row.id,
    authorName,
    authorKind,
    authorAvatarInitials: initials(authorName),
    cafeId: row.cafe_id ?? "—",
    cafeName: cafe?.name ?? "كوفي",
    productName: row.product_name ?? undefined,
    tableLabel: row.table_label ?? undefined,
    postKind: (row.post_kind ?? "experience") as PostKind,
    mediaType: (row.media_type === "video" ? "video" : row.media_type === "image" ? "image" : "none") as CommunityPost["mediaType"],
    mediaPlaceholderLabel: row.media_placeholder ?? "",
    body: row.body ?? "",
    hashtags: row.hashtags ?? [],
    likes: row.likes_count ?? 0,
    comments,
    shares: row.shares_count ?? 0,
    saves: row.saves_count ?? 0,
    views: row.views_count ?? 0,
    reviewStatus: (row.review_status ?? "pending") as ReviewStatus,
    reportsCount: row.reports_count ?? 0,
    rewardEligible: row.reward_eligible ?? false,
    rewardPointsPreview: row.reward_points_preview ?? 0,
  };
}

export async function listCommunityPosts(supabase: SupabaseClient): Promise<DataResult<CommunityPost[]>> {
  return withMockFallback("community.posts", mockPosts, async () => {
    const { data: posts, error } = await supabase
      .from("community_posts")
      .select(
        "id, author_id, cafe_id, post_kind, media_type, media_placeholder, body, hashtags, likes_count, shares_count, saves_count, views_count, review_status, reports_count, reward_eligible, reward_points_preview, product_name, table_label, created_at, profiles(full_name, role), cafes(name)",
      )
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) return { data: null, error };
    if (!posts?.length) return { data: [], error: null };

    const ids = posts.map((p: { id: string }) => p.id);
    const { data: rawComments } = await supabase
      .from("community_post_comments")
      .select("id, post_id, body, created_at, profiles(full_name, role)")
      .in("post_id", ids);

    const byPost = new Map<string, CommunityComment[]>();
    for (const c of rawComments ?? []) {
      const row = c as Record<string, unknown>;
      const pid = String(row.post_id);
      const prof = firstRel(row.profiles as { full_name?: string; role?: string } | { full_name?: string; role?: string }[] | null);
      const author = prof?.full_name ?? "مستخدم";
      const authorKind: AuthorKind =
        prof?.role === "cafe_owner" || prof?.role === "branch_manager" ? "cafe" : "customer";
      const list = byPost.get(pid) ?? [];
      list.push({
        id: String(row.id),
        author,
        authorKind,
        text: String(row.body ?? ""),
        createdAt: row.created_at ? new Date(String(row.created_at)).toISOString() : "",
      });
      byPost.set(pid, list);
    }

    const mapped = (posts as unknown as PostRow[]).map((p) => mapPostRow(p, byPost.get(p.id) ?? []));
    return { data: mapped, error: null };
  });
}

const POST_SELECT =
  "id, author_id, cafe_id, post_kind, media_type, media_placeholder, body, hashtags, likes_count, shares_count, saves_count, views_count, review_status, reports_count, reward_eligible, reward_points_preview, product_name, table_label, created_at, profiles(full_name, role), cafes(name)";

async function hydrateCommunityPosts(supabase: SupabaseClient, posts: unknown[]): Promise<CommunityPost[]> {
  if (!posts.length) return [];
  const ids = (posts as { id: string }[]).map((p) => p.id);
  const { data: rawComments } = await supabase
    .from("community_post_comments")
    .select("id, post_id, body, created_at, profiles(full_name, role)")
    .in("post_id", ids);

  const byPost = new Map<string, CommunityComment[]>();
  for (const c of rawComments ?? []) {
    const row = c as Record<string, unknown>;
    const pid = String(row.post_id);
    const prof = firstRel(row.profiles as { full_name?: string; role?: string } | { full_name?: string; role?: string }[] | null);
    const author = prof?.full_name ?? "مستخدم";
    const authorKind: AuthorKind =
      prof?.role === "cafe_owner" || prof?.role === "branch_manager" ? "cafe" : "customer";
    const list = byPost.get(pid) ?? [];
    list.push({
      id: String(row.id),
      author,
      authorKind,
      text: String(row.body ?? ""),
      createdAt: row.created_at ? new Date(String(row.created_at)).toISOString() : "",
    });
    byPost.set(pid, list);
  }

  return (posts as unknown as PostRow[]).map((p) => mapPostRow(p, byPost.get(p.id) ?? []));
}

export async function loadApprovedCommunityPosts(supabase: SupabaseClient): Promise<DataLoad<CommunityPost[]>> {
  try {
    const { data: posts, error } = await supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("review_status", "approved")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) return { status: "error", message: error.message };
    if (!posts?.length) return { status: "empty" };
    return { status: "ok", data: await hydrateCommunityPosts(supabase, posts) };
  } catch (e) {
    return { status: "error", message: mapSupabaseError(e) };
  }
}

export async function loadCommunityPostsForCafe(supabase: SupabaseClient, cafeId: string): Promise<DataLoad<CommunityPost[]>> {
  try {
    const { data: posts, error } = await supabase
      .from("community_posts")
      .select(POST_SELECT)
      .eq("cafe_id", cafeId)
      .order("created_at", { ascending: false })
      .limit(80);
    if (error) return { status: "error", message: error.message };
    if (!posts?.length) return { status: "empty" };
    return { status: "ok", data: await hydrateCommunityPosts(supabase, posts) };
  } catch (e) {
    return { status: "error", message: mapSupabaseError(e) };
  }
}

/** لمسار إدارة المنصة (service role) — يرمي عند الخطأ */
export async function fetchCommunityPostsForAdmin(admin: SupabaseClient): Promise<CommunityPost[]> {
  const { data: posts, error } = await admin
    .from("community_posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  if (!posts?.length) return [];
  return hydrateCommunityPosts(admin, posts);
}

export async function addCommunityPostComment(
  supabase: SupabaseClient,
  postId: string,
  authorId: string,
  body: string,
): Promise<DataResult<{ id: string } | null>> {
  return withMockFallback("community.comment", null, async () => {
    const { data, error } = await supabase
      .from("community_post_comments")
      .insert({ post_id: postId, author_id: authorId, body })
      .select("id")
      .single();
    if (error) return { data: null, error };
    return { data: data as { id: string }, error: null };
  });
}

export async function likeCommunityPostRpc(supabase: SupabaseClient, postId: string): Promise<DataResult<boolean>> {
  return withMockFallback("community.like", false, async () => {
    const { error } = await supabase.rpc("increment_community_post_like", { p_post_id: postId });
    if (error) return { data: null, error };
    return { data: true, error: null };
  });
}
