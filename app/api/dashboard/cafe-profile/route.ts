import { NextResponse } from "next/server";
import { getOwnerCafeContext } from "@/lib/data/cafe-context";
import { emptyCafeProfile, loadOwnerCafeProfile } from "@/lib/data/cafe-profile";
import { getSessionUser } from "@/lib/data/session-user";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, message: "غير مصرّح" }, { status: 401 });
  const ctx = await getOwnerCafeContext();
  if (!ctx) return NextResponse.json({ ok: true, data: emptyCafeProfile });

  const supabase = await createClient();
  const data = await loadOwnerCafeProfile(supabase, ctx);
  return NextResponse.json({ ok: true, data: data ?? { ...emptyCafeProfile, id: ctx.cafeId } });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, message: "غير مصرّح" }, { status: 401 });
  const ctx = await getOwnerCafeContext();
  if (!ctx) return NextResponse.json({ ok: false, message: "لا يوجد كوفي مرتبط" }, { status: 400 });

  const body = (await request.json()) as Record<string, unknown>;
  const supabase = await createClient();

  const cafePatch = {
    name: String(body.name ?? ""),
    slug: String(body.slug ?? ""),
    description: String(body.description ?? ""),
    logo_url: String(body.logoUrl ?? ""),
    cover_url: String(body.coverUrl ?? ""),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? ""),
    website_url: String(body.websiteUrl ?? ""),
    instagram_url: String(body.instagramUrl ?? ""),
    tiktok_url: String(body.tiktokUrl ?? ""),
    snapchat_url: String(body.snapchatUrl ?? ""),
    x_url: String(body.xUrl ?? ""),
    whatsapp_url: String(body.whatsappUrl ?? ""),
    welcome_message: String(body.welcomeMessage ?? ""),
    general_discount_percent: Number(body.generalDiscountPercent ?? 0),
    opening_hours: (body.openingHours ?? {}) as object,
    map_visibility: body.mapVisibility !== false,
  };

  const cafeRes = await supabase.from("cafes").update(cafePatch).eq("id", ctx.cafeId).select("id").maybeSingle();
  if (cafeRes.error) return NextResponse.json({ ok: false, message: cafeRes.error.message }, { status: 500 });

  const locationPatch = {
    cafe_id: ctx.cafeId,
    latitude: body.latitude == null ? null : Number(body.latitude),
    longitude: body.longitude == null ? null : Number(body.longitude),
    city: String(body.city ?? ""),
    district: String(body.district ?? ""),
    address: String(body.address ?? ""),
    google_maps_url: String(body.googleMapsUrl ?? ""),
    is_visible: body.mapVisibility !== false,
  };

  const locCheck = await supabase.from("cafe_locations").select("cafe_id").eq("cafe_id", ctx.cafeId).limit(1).maybeSingle();
  if (locCheck.error) return NextResponse.json({ ok: false, message: locCheck.error.message }, { status: 500 });

  const locRes = locCheck.data
    ? await supabase.from("cafe_locations").update(locationPatch).eq("cafe_id", ctx.cafeId)
    : await supabase.from("cafe_locations").insert(locationPatch);
  if (locRes.error) return NextResponse.json({ ok: false, message: locRes.error.message }, { status: 500 });

  if (Array.isArray(body.gallery)) {
    try {
      await supabase.from("cafe_gallery_images").delete().eq("cafe_id", ctx.cafeId);
      const rows = body.gallery
        .map((v) => String(v ?? "").trim())
        .filter(Boolean)
        .slice(0, 20)
        .map((image_url) => ({ cafe_id: ctx.cafeId, image_url }));
      if (rows.length) await supabase.from("cafe_gallery_images").insert(rows);
    } catch {
      // table optional in some environments
    }
  }

  return NextResponse.json({ ok: true });
}
