import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadApprovedCommunityPosts } from "@/lib/data/community";

export async function GET() {
  try {
    const supabase = await createClient();
    const load = await loadApprovedCommunityPosts(supabase);
    if (load.status === "error") {
      return NextResponse.json({ ok: false, message: load.message }, { status: 500 });
    }
    return NextResponse.json({
      ok: true,
      data: load.status === "ok" ? load.data : [],
      empty: load.status === "empty",
    });
  } catch (e) {
    console.error("[api/community/posts]", e);
    return NextResponse.json({ ok: false, message: "تعذر تحميل المنشورات." }, { status: 500 });
  }
}
