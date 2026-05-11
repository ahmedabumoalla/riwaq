import Link from "next/link";
import { Clock, MapPin, Star, Users } from "lucide-react";
import { mockExploreCafe } from "@/lib/mock/customer-app";

export function CustomerExploreView() {
  const c = mockExploreCafe;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] shadow-xl ring-1 ring-riwaq-beige/90">
        <div className="relative h-44 bg-linear-to-br from-riwaq-caramel/30 via-riwaq-beige to-sky-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-white/85 px-4 py-2 text-xs font-extrabold text-riwaq-brown shadow-md ring-1 ring-riwaq-beige">
              صور الفرع — معاينة
            </span>
          </div>
        </div>
        <div className="space-y-4 bg-white/90 px-5 py-5 backdrop-blur-md">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-extrabold text-2xl text-riwaq-brown">{c.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-riwaq-muted">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-950 ring-1 ring-amber-100">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                  {c.rating.toLocaleString("ar-SA")} ({c.reviews.toLocaleString("ar-SA")})
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4 text-riwaq-green" aria-hidden />
                  {c.hours}
                </span>
              </div>
            </div>
          </div>
          <p className="flex items-start gap-2 text-sm font-bold text-riwaq-muted">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-riwaq-caramel" aria-hidden />
            {c.location}
          </p>
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-900 ring-1 ring-red-100">
            <span className="inline-flex items-center gap-2">
              <Users className="h-5 w-5" aria-hidden />
              {c.crowd}
            </span>
          </div>

          <div>
            <h2 className="font-extrabold text-riwaq-brown">الأكثر شهرة</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.popular.map((p) => (
                <span key={p} className="rounded-full bg-riwaq-cream px-3 py-1.5 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-extrabold text-riwaq-brown">طاولات مميزة</h2>
            <ul className="mt-3 space-y-2">
              {c.featuredTables.map((t) => (
                <li key={t} className="rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-extrabold text-riwaq-brown">عروض حالية</h2>
            <ul className="mt-3 space-y-2">
              {c.promos.map((x) => (
                <li key={x} className="rounded-2xl bg-riwaq-green/10 px-4 py-3 text-sm font-extrabold text-riwaq-green ring-1 ring-riwaq-green/20">
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/customer/menu"
              className="inline-flex flex-1 min-w-[8rem] items-center justify-center rounded-2xl bg-riwaq-brown px-5 py-3 text-sm font-extrabold text-white shadow-lg hover:brightness-105"
            >
              عرض المنيو
            </Link>
            <Link
              href="/customer/reservations"
              className="inline-flex flex-1 min-w-[8rem] items-center justify-center rounded-2xl border border-riwaq-beige bg-white px-5 py-3 text-sm font-extrabold text-riwaq-brown shadow-sm hover:bg-riwaq-cream/70"
            >
              حجز طاولة
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
