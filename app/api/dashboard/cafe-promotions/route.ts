import { NextResponse } from "next/server";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { listCafePromotions } from "@/lib/data/cafe-promotions";
import { getSessionUser } from "@/lib/data/session-user";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, message: "غير مصرّح" }, { status: 401 });
  const ctx = await getOwnerCafeContext();
  if (!ctx) return NextResponse.json({ ok: true, data: [] });

  const supabase = await createClient();
  const data = await listCafePromotions(supabase, ctx.cafeId, false);
  return NextResponse.json({ ok: true, data });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, message: "غير مصرّح" }, { status: 401 });
  const ctx = await getOwnerCafeContext();
  if (!ctx) return NextResponse.json({ ok: false, message: "لا يوجد كوفي مرتبط" }, { status: 400 });

  const body = (await request.json()) as Record<string, unknown>;
  const supabase = await createClient();
  const { error } = await supabase.from("cafe_promotions").insert({
    cafe_id: ctx.cafeId,
    promo_type: String(body.promoType ?? "banner"),
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    image_url: String(body.imageUrl ?? ""),
    starts_at: body.startsAt ? String(body.startsAt) : null,
    ends_at: body.endsAt ? String(body.endsAt) : null,
    is_active: body.isActive !== false,
  });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, message: "غير مصرّح" }, { status: 401 });
  const ctx = await getOwnerCafeContext();
  if (!ctx) return NextResponse.json({ ok: false, message: "لا يوجد كوفي مرتبط" }, { status: 400 });

  const body = (await request.json()) as Record<string, unknown>;
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ ok: false, message: "id مطلوب" }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase
    .from("cafe_promotions")
    .update({
      promo_type: String(body.promoType ?? "banner"),
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      image_url: String(body.imageUrl ?? ""),
      starts_at: body.startsAt ? String(body.startsAt) : null,
      ends_at: body.endsAt ? String(body.endsAt) : null,
      is_active: body.isActive !== false,
    })
    .eq("id", id)
    .eq("cafe_id", ctx.cafeId);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
