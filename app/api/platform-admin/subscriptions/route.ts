import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/data/session-user";
import { listCafeSubscriptions } from "@/lib/data/subscriptions";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "platform_admin") {
    return NextResponse.json({ ok: false, message: "غير مصرّح." }, { status: 403 });
  }
  try {
    const admin = createAdminClient();
    const r = await listCafeSubscriptions(admin);
    return NextResponse.json({ ok: true, data: r.data, source: r.source, error: r.error });
  } catch (e) {
    console.error("[api/platform-admin/subscriptions]", e);
    return NextResponse.json({ ok: false, message: "تعذر تحميل الاشتراكات." }, { status: 500 });
  }
}
