import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/data/session-user";
import { buildPlatformAdminDashboard } from "@/lib/server/platform-admin-dashboard";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "platform_admin") {
    return NextResponse.json({ ok: false, message: "غير مصرّح." }, { status: 403 });
  }
  try {
    const admin = createAdminClient();
    const payload = await buildPlatformAdminDashboard(admin);
    return NextResponse.json({ ok: true, ...payload });
  } catch (e) {
    console.error("[api/platform-admin/dashboard]", e);
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "فشل تجميع بيانات المنصة." },
      { status: 500 },
    );
  }
}
