"use client";

import { Armchair, Compass, MapPin, Menu, Navigation } from "lucide-react";
import Link from "next/link";
import type { MapCafe } from "@/lib/mock/map-cafes";

function crowdAr(c: MapCafe["crowd"]) {
  if (c === "low") return "هادئ";
  if (c === "medium") return "متوسط";
  return "مزدحم";
}

export function CafeMapCard({ cafe, distanceKm }: { cafe: MapCafe; distanceKm: number }) {
  return (
    <div className="flex flex-col rounded-3xl border border-white/90 bg-white/90 p-4 shadow-lg shadow-riwaq-brown/8 ring-1 ring-riwaq-beige/80 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-extrabold text-riwaq-brown">{cafe.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-riwaq-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-riwaq-caramel" aria-hidden />
            {cafe.city} · {cafe.region}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-riwaq-caramel/15 px-2.5 py-1 text-[11px] font-extrabold text-riwaq-caramel ring-1 ring-riwaq-caramel/25">
          {distanceKm.toLocaleString("ar-SA", { maximumFractionDigits: 1 })} كم
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-extrabold">
        <span className="rounded-full bg-riwaq-cream px-2 py-0.5 text-riwaq-brown ring-1 ring-riwaq-beige">⭐ {cafe.rating.toFixed(1)}</span>
        <span className="rounded-full bg-riwaq-cream px-2 py-0.5 text-riwaq-muted ring-1 ring-riwaq-beige">{crowdAr(cafe.crowd)}</span>
        {cafe.isOpenNow === false ? (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-800 ring-1 ring-rose-200">مغلق الآن</span>
        ) : (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 ring-1 ring-emerald-200">مفتوح الآن</span>
        )}
        {cafe.tablesAvailableNow ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 ring-1 ring-emerald-200">طاولات متاحة</span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-xs font-bold text-riwaq-muted">{cafe.tagline}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/customer/cafes/${cafe.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-white text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-cream"
        >
          عرض الكوفي
        </Link>
        <Link
          href="/customer/reservations"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-riwaq-brown text-xs font-extrabold text-white hover:bg-riwaq-brown/90"
        >
          <Armchair className="ms-1 h-3.5 w-3.5" />
          حجز طاولة
        </Link>
        <Link
          href="/customer/menu"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-riwaq-green/40 bg-white text-xs font-extrabold text-riwaq-green hover:bg-emerald-50"
        >
          <Menu className="ms-1 h-3.5 w-3.5" />
          المنيو
        </Link>
        <a
          href={cafe.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${cafe.lat},${cafe.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-riwaq-cream/50 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-beige/60"
        >
          <Navigation className="ms-1 h-3.5 w-3.5" />
          الاتجاهات
        </a>
      </div>
      <p className="mt-3 text-[10px] font-bold text-riwaq-muted">
        <Compass className="inline h-3 w-3 text-riwaq-caramel" aria-hidden /> الاتجاهات متاحة عبر Google Maps
      </p>
    </div>
  );
}
