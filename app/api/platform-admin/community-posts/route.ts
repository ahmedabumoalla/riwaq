import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/data/session-user";
import { fetchCommunityPostsForAdmin } from "@/lib/data/community";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "platform_admin") {
    return NextResponse.json({ ok: false, message: "غير مصرّح." }, { status: 403 });
  }
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? "15") || 15;
    const offset = Number(url.searchParams.get("offset") ?? "0") || 0;
    const admin = createAdminClient();
    const { posts, hasMore } = await fetchCommunityPostsForAdmin(admin, { limit, offset });
    return NextResponse.json({ ok: true, posts, hasMore });
  } catch (e) {
    console.error("[api/platform-admin/community-posts]", e);
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "تعذر تحميل المنشورات." },
      { status: 500 },
    );
  }
}
