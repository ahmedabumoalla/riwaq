import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/data/session-user";
import { fetchCommunityPostsForAdmin } from "@/lib/data/community";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "platform_admin") {
    return NextResponse.json({ ok: false, message: "غير مصرّح." }, { status: 403 });
  }
  try {
    const admin = createAdminClient();
    const posts = await fetchCommunityPostsForAdmin(admin);
    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    console.error("[api/platform-admin/community-posts]", e);
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "تعذر تحميل المنشورات." },
      { status: 500 },
    );
  }
}
