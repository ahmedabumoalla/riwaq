"use client";

import { useMemo, useState } from "react";
import type { CafeProfilePayload } from "@/lib/data/cafe-profile";
import type { CafePromotion } from "@/lib/data/cafe-promotions";
import { getGoogleMapsPublicKey } from "@/lib/map/google-maps-key";

type Props = {
  initialProfile: CafeProfilePayload;
  initialPromotions: CafePromotion[];
};

type PromotionForm = {
  promoType: "banner" | "latest_products" | "contest";
  title: string;
  description: string;
  imageUrl: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

const defaultPromotion: PromotionForm = {
  promoType: "banner",
  title: "",
  description: "",
  imageUrl: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
};

export function CafeProfileSettingsClient({ initialProfile, initialPromotions }: Props) {
  const [profile, setProfile] = useState<CafeProfilePayload>(initialProfile);
  const [promotions, setPromotions] = useState<CafePromotion[]>(initialPromotions);
  const [promotionForm, setPromotionForm] = useState<PromotionForm>(defaultPromotion);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");
  const googleKey = getGoogleMapsPublicKey();

  const googleMapSrc = useMemo(() => {
    if (!googleKey || profile.latitude == null || profile.longitude == null) return "";
    return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(googleKey)}&center=${profile.latitude},${profile.longitude}&zoom=14`;
  }, [googleKey, profile.latitude, profile.longitude]);

  async function saveProfile() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/dashboard/cafe-profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(profile),
    });
    const json = (await res.json()) as { ok?: boolean; message?: string };
    setSaving(false);
    setMessage(json.ok ? "تم حفظ بيانات الكوفي بنجاح." : json.message ?? "تعذر الحفظ.");
  }

  async function addPromotion() {
    const res = await fetch("/api/dashboard/cafe-promotions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(promotionForm),
    });
    const json = (await res.json()) as { ok?: boolean; message?: string };
    if (!json.ok) {
      setMessage(json.message ?? "تعذر إضافة الإعلان.");
      return;
    }
    const list = await fetch("/api/dashboard/cafe-promotions").then((r) => r.json());
    setPromotions(list.data ?? []);
    setPromotionForm(defaultPromotion);
    setMessage("تمت إضافة الإعلان.");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-riwaq-brown">إعدادات الكوفي</h2>
        <p className="mt-1 text-sm font-bold text-riwaq-muted">بيانات الهوية، التواصل، الموقع، والظهور بالخريطة.</p>
      </section>

      <section className="grid gap-4 rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm md:grid-cols-2">
        <Input label="اسم الكوفي" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
        <Input label="slug" value={profile.slug} onChange={(v) => setProfile({ ...profile, slug: v })} />
        <Input label="رقم التواصل" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
        <Input label="واتساب" value={profile.whatsappUrl} onChange={(v) => setProfile({ ...profile, whatsappUrl: v })} />
        <Input label="البريد" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
        <Input label="الموقع الإلكتروني" value={profile.websiteUrl} onChange={(v) => setProfile({ ...profile, websiteUrl: v })} />
        <Input label="Instagram" value={profile.instagramUrl} onChange={(v) => setProfile({ ...profile, instagramUrl: v })} />
        <Input label="TikTok" value={profile.tiktokUrl} onChange={(v) => setProfile({ ...profile, tiktokUrl: v })} />
        <Input label="Snapchat" value={profile.snapchatUrl} onChange={(v) => setProfile({ ...profile, snapchatUrl: v })} />
        <Input label="X" value={profile.xUrl} onChange={(v) => setProfile({ ...profile, xUrl: v })} />
        <Input label="رابط اللوجو" value={profile.logoUrl} onChange={(v) => setProfile({ ...profile, logoUrl: v })} />
        <Input label="رابط صورة الغلاف" value={profile.coverUrl} onChange={(v) => setProfile({ ...profile, coverUrl: v })} />
        <Input
          label="خصم عام (%)"
          type="number"
          value={String(profile.generalDiscountPercent)}
          onChange={(v) => setProfile({ ...profile, generalDiscountPercent: Number(v || 0) })}
        />
        <label className="flex items-center gap-2 rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 px-3 py-2">
          <input
            type="checkbox"
            checked={profile.mapVisibility}
            onChange={(e) => setProfile({ ...profile, mapVisibility: e.target.checked })}
          />
          <span className="text-sm font-extrabold text-riwaq-brown">إظهار الكوفي في الخريطة</span>
        </label>
        <label className="md:col-span-2">
          <span className="text-xs font-extrabold text-riwaq-muted">وصف الكوفي</span>
          <textarea
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            className="mt-1 min-h-24 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="md:col-span-2">
          <span className="text-xs font-extrabold text-riwaq-muted">رسالة ترحيبية</span>
          <textarea
            value={profile.welcomeMessage}
            onChange={(e) => setProfile({ ...profile, welcomeMessage: e.target.value })}
            className="mt-1 min-h-20 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm"
          />
        </label>
      </section>

      <section className="grid gap-4 rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm md:grid-cols-2">
        <Input label="المدينة" value={profile.city} onChange={(v) => setProfile({ ...profile, city: v })} />
        <Input label="الحي" value={profile.district} onChange={(v) => setProfile({ ...profile, district: v })} />
        <Input label="Latitude" value={String(profile.latitude ?? "")} onChange={(v) => setProfile({ ...profile, latitude: Number(v || 0) })} />
        <Input label="Longitude" value={String(profile.longitude ?? "")} onChange={(v) => setProfile({ ...profile, longitude: Number(v || 0) })} />
        <Input label="Google Maps URL" value={profile.googleMapsUrl} onChange={(v) => setProfile({ ...profile, googleMapsUrl: v })} />
        <label className="md:col-span-2">
          <span className="text-xs font-extrabold text-riwaq-muted">العنوان</span>
          <textarea
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="mt-1 min-h-20 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm"
          />
        </label>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <a
            href={profile.googleMapsUrl || (profile.latitude != null && profile.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${profile.latitude},${profile.longitude}` : "#")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-riwaq-beige bg-riwaq-cream/50 px-4 py-2 text-xs font-extrabold text-riwaq-brown"
          >
            فتح الموقع في Google Maps
          </a>
        </div>
        <div className="md:col-span-2 overflow-hidden rounded-2xl border border-riwaq-beige bg-riwaq-cream/40">
          {googleMapSrc ? (
            <iframe title="google-map-preview" src={googleMapSrc} className="h-64 w-full" loading="lazy" />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm font-bold text-riwaq-muted">
              أضف `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` و Latitude/Longitude لعرض الخريطة.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
        <h3 className="text-base font-extrabold text-riwaq-brown">صور الكوفي (Gallery URLs)</h3>
        <textarea
          value={profile.gallery.join("\n")}
          onChange={(e) =>
            setProfile({
              ...profile,
              gallery: e.target.value
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
          className="mt-2 min-h-28 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm"
          placeholder="ضع كل رابط صورة في سطر مستقل"
        />
      </section>

      <section className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
        <h3 className="text-base font-extrabold text-riwaq-brown">إعلانات الكوفي</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <select
            value={promotionForm.promoType}
            onChange={(e) => setPromotionForm({ ...promotionForm, promoType: e.target.value as PromotionForm["promoType"] })}
            className="rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm font-bold"
          >
            <option value="banner">بانر</option>
            <option value="latest_products">أحدث منتجات</option>
            <option value="contest">مسابقة</option>
          </select>
          <Input label="عنوان الإعلان" value={promotionForm.title} onChange={(v) => setPromotionForm({ ...promotionForm, title: v })} />
          <Input label="رابط صورة الإعلان" value={promotionForm.imageUrl} onChange={(v) => setPromotionForm({ ...promotionForm, imageUrl: v })} />
          <Input label="بداية" type="datetime-local" value={promotionForm.startsAt} onChange={(v) => setPromotionForm({ ...promotionForm, startsAt: v })} />
          <Input label="نهاية" type="datetime-local" value={promotionForm.endsAt} onChange={(v) => setPromotionForm({ ...promotionForm, endsAt: v })} />
          <label className="flex items-center gap-2 rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 px-3 py-2">
            <input type="checkbox" checked={promotionForm.isActive} onChange={(e) => setPromotionForm({ ...promotionForm, isActive: e.target.checked })} />
            <span className="text-sm font-extrabold text-riwaq-brown">مفعل</span>
          </label>
        </div>
        <label className="mt-3 block">
          <span className="text-xs font-extrabold text-riwaq-muted">وصف الإعلان</span>
          <textarea
            value={promotionForm.description}
            onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
            className="mt-1 min-h-20 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm"
          />
        </label>
        <button type="button" onClick={addPromotion} className="mt-3 rounded-2xl bg-riwaq-brown px-4 py-2 text-xs font-extrabold text-white">
          إنشاء إعلان
        </button>
        <div className="mt-4 space-y-2">
          {promotions.length ? (
            promotions.map((p) => (
              <div key={p.id} className="rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 p-3 text-sm">
                <p className="font-extrabold text-riwaq-brown">{p.title || "بدون عنوان"} — {p.promoType}</p>
                <p className="text-xs font-bold text-riwaq-muted">{p.description || "لا يوجد وصف"}</p>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-riwaq-muted">لا توجد إعلانات مفعلة حاليًا.</p>
          )}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={saveProfile}
          className="rounded-2xl bg-riwaq-brown px-5 py-2 text-sm font-extrabold text-white disabled:opacity-60"
        >
          {saving ? "جارٍ الحفظ..." : "حفظ البيانات"}
        </button>
        {message ? <p className="text-sm font-bold text-riwaq-muted">{message}</p> : null}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="text-xs font-extrabold text-riwaq-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm"
      />
    </label>
  );
}
