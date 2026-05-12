import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listMapCafes } from "@/lib/data/cafes";

/** GET — قائمة كافيهات للخريطة (جلسة + RLS؛ عند الفشل يعيد mock من طبقة البيانات). */
export async function GET() {
  try {
    const supabase = await createClient();
    const r = await listMapCafes(supabase);
    return NextResponse.json({ ok: true, data: r.data, source: r.source, error: r.error });
  } catch (e) {
    console.error("[api/customer/nearby-cafes]", e);
    return NextResponse.json({ ok: false, message: "تعذر تحميل الكافيهات." }, { status: 500 });
  }
}
