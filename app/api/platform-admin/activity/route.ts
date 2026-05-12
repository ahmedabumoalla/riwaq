import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/data/session-user";
import { listPlatformActivityLogs } from "@/lib/data/platform-admin";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "platform_admin") {
    return NextResponse.json({ ok: false, message: "غير مصرّح." }, { status: 403 });
  }
  try {
    const admin = createAdminClient();
    const r = await listPlatformActivityLogs(admin);
    return NextResponse.json({ ok: true, data: r.data, source: r.source, error: r.error });
  } catch (e) {
    console.error("[api/platform-admin/activity]", e);
    return NextResponse.json({ ok: false, message: "تعذر تحميل السجل." }, { status: 500 });
  }
}
