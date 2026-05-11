import type { Metadata } from "next";
import { MapPinned } from "lucide-react";
import { mapCafes } from "@/lib/mock/map-cafes";

export const metadata: Metadata = {
  title: "نظرة خريطة المنصة",
};

export default function PlatformAdminMapOverviewPage() {
  return (
    <div className="mx-auto max-w-7xl min-w-0 space-y-8">
      <div className="rounded-3xl border border-white/90 bg-white/90 p-6 shadow-lg backdrop-blur-xl">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold text-riwaq-brown">
          <MapPinned className="h-7 w-7 text-riwaq-caramel" aria-hidden />
          نظرة خريطة المنصة
        </h1>
        <p className="mt-2 text-sm font-bold text-riwaq-muted">تجمع جغرافي للكافيهات المسجلة (وهمي) — تمهيدًا لـ Mapbox.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-muted">كافيهات على الخريطة</p>
          <p className="mt-2 text-3xl font-extrabold">{mapCafes.length}</p>
        </div>
        <div className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-muted">مناطق مغطاة</p>
          <p className="mt-2 text-3xl font-extrabold">٤</p>
        </div>
        <div className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-muted">متوسط التقييم</p>
          <p className="mt-2 text-3xl font-extrabold text-riwaq-caramel">
            {(mapCafes.reduce((s, c) => s + c.rating, 0) / mapCafes.length).toFixed(2)}
          </p>
        </div>
        <div className="rounded-3xl border border-riwaq-beige bg-white/90 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-muted">عروض نشطة</p>
          <p className="mt-2 text-3xl font-extrabold text-riwaq-green">{mapCafes.filter((c) => c.activeOffers).length}</p>
        </div>
      </div>

      <div className="scrollbar-none overflow-x-auto rounded-3xl border border-riwaq-beige bg-white/90 shadow-sm">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-xs font-extrabold text-riwaq-muted">
            <tr>
              <th className="px-4 py-3">الكوفي</th>
              <th className="px-4 py-3">المدينة</th>
              <th className="px-4 py-3">lat</th>
              <th className="px-4 py-3">lng</th>
              <th className="px-4 py-3">تقييم</th>
            </tr>
          </thead>
          <tbody>
            {mapCafes.map((c) => (
              <tr key={c.id} className="border-b border-riwaq-beige/60 font-bold last:border-0">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3">{c.city}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.lat}</td>
                <td className="px-4 py-3 font-mono text-xs">{c.lng}</td>
                <td className="px-4 py-3">{c.rating.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
