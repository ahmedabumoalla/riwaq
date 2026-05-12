import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/data/session-user";
import { likeCommunityPostRpc } from "@/lib/data/community";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "يجب تسجيل الدخول." }, { status: 401 });
    }
    const supabase = await createClient();
    const r = await likeCommunityPostRpc(supabase, id);
    if (r.source === "mock" && r.error) {
      return NextResponse.json({ ok: false, message: "تعذر تسجيل الإعجاب.", source: r.source }, { status: 502 });
    }
    return NextResponse.json({ ok: true, source: r.source });
  } catch (e) {
    console.error("[api/community/posts/like]", e);
    return NextResponse.json({ ok: false, message: "خطأ غير متوقع." }, { status: 500 });
  }
}
