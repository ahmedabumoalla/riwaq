import type { Metadata } from "next";
import Link from "next/link";
import { MapPinned, TrendingUp } from "lucide-react";
import { mapCafes } from "@/lib/mock/map-cafes";

export const metadata: Metadata = {
  title: "رؤية الخريطة",
};

export default function DashboardMapInsightsPage() {
  const high = mapCafes.filter((c) => c.rating >= 4.8);
  return (
    <div className="mx-auto max-w-6xl min-w-0 space-y-8 px-1 sm:px-0">
      <div className="rounded-3xl border border-white/90 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <h1 className="text-2xl font-extrabold text-riwaq-brown">رؤية الخريطة — الفرع</h1>
        <p className="mt-2 max-w-2xl text-sm font-bold text-riwaq-muted">
          مقارنة مع كافيهات المنطقة (وهمي) — جاهز لاحقًا لدمج Mapbox وتحليلات الزحام.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/customer/map"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-riwaq-brown px-4 text-sm font-extrabold text-white hover:bg-riwaq-brown/90"
          >
            <MapPinned className="h-4 w-4" />
            معاينة خريطة العميل
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-riwaq-beige bg-riwaq-cream/50 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-muted">كافيهات ضمن ٥ كم (تجريبي)</p>
          <p className="mt-2 text-3xl font-extrabold text-riwaq-brown">{mapCafes.length.toLocaleString("ar-SA")}</p>
        </div>
        <div className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-muted">متوسط تقييم المنطقة</p>
          <p className="mt-2 text-3xl font-extrabold text-riwaq-caramel">
            {(mapCafes.reduce((s, c) => s + c.rating, 0) / mapCafes.length).toFixed(2)}
          </p>
        </div>
        <div className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-muted">عروض نشطة بالجوار</p>
          <p className="mt-2 text-3xl font-extrabold text-riwaq-green">
            {mapCafes.filter((c) => c.activeOffers).length.toLocaleString("ar-SA")}
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-riwaq-brown">
          <TrendingUp className="h-5 w-5 text-riwaq-caramel" aria-hidden />
          أعلى تقييمًا بالقرب منك (وهمي)
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {high.map((c) => (
            <li key={c.id} className="rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 px-4 py-3 text-sm font-bold text-riwaq-brown">
              {c.name} — ⭐ {c.rating.toFixed(1)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
