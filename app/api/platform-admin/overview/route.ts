import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/data/session-user";
import { getPlatformAdminOverview, getSubscriptionHealthCounts } from "@/lib/data/platform-admin";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "platform_admin") {
    return NextResponse.json({ ok: false, message: "غير مصرّح." }, { status: 403 });
  }
  try {
    const admin = createAdminClient();
    const [overview, health] = await Promise.all([getPlatformAdminOverview(admin), getSubscriptionHealthCounts(admin)]);
    return NextResponse.json({
      ok: true,
      overview: overview.data,
      overviewSource: overview.source,
      subscriptionHealth: health.data,
      subscriptionHealthSource: health.source,
    });
  } catch (e) {
    console.error("[api/platform-admin/overview]", e);
    return NextResponse.json({ ok: false, message: "تعذر تحميل النظرة العامة." }, { status: 500 });
  }
}
