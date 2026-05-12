import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/data/session-user";
import { addCommunityPostComment } from "@/lib/data/community";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "يجب تسجيل الدخول." }, { status: 401 });
    }
    const body = (await req.json()) as { text?: string };
    const text = body.text?.trim() ?? "";
    if (!text) {
      return NextResponse.json({ ok: false, message: "نص التعليق فارغ." }, { status: 400 });
    }
    const supabase = await createClient();
    const r = await addCommunityPostComment(supabase, id, user.id, text);
    if (r.source === "mock" || !r.data) {
      return NextResponse.json(
        { ok: false, message: "تعذر حفظ التعليق.", source: r.source, error: r.error },
        { status: r.source === "mock" ? 502 : 500 },
      );
    }
    return NextResponse.json({ ok: true, id: r.data.id, source: r.source });
  } catch (e) {
    console.error("[api/community/posts/comments]", e);
    return NextResponse.json({ ok: false, message: "خطأ غير متوقع." }, { status: 500 });
  }
}
