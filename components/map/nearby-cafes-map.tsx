"use client";

import { LocateFixed, MapPinned } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CafeGoogleMap } from "@/components/map/cafe-google-map";
import { CafeFilterPanel, applyMapFilters, defaultMapFilters, type MapFilterState } from "@/components/map/cafe-filter-panel";
import { CafeMapCard } from "@/components/map/cafe-map-card";
import { distanceKm } from "@/lib/geo/haversine";
import { getGoogleMapsPublicKey } from "@/lib/map/google-maps-key";
import { manualRegionCenters, mapCafes, type MapCafe } from "@/lib/mock/map-cafes";

type NearbyCafesMapProps = {
  variant?: "default" | "explore";
  /** من الخادم عبر `listMapCafes`؛ إن وُجد يُستخدم بدل العينة الوهمية */
  initialCafes?: MapCafe[] | null;
};

export function NearbyCafesMap({ variant = "default", initialCafes }: NearbyCafesMapProps) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [manualId, setManualId] = useState<string>(manualRegionCenters[0]!.id);
  const [filters, setFilters] = useState<MapFilterState>(defaultMapFilters);

  const anchor = useMemo(() => {
    if (userPos) return userPos;
    const m = manualRegionCenters.find((r) => r.id === manualId) ?? manualRegionCenters[0]!;
    return { lat: m.lat, lng: m.lng };
  }, [userPos, manualId]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      setDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setDenied(false);
        setLoading(false);
      },
      () => {
        setDenied(true);
        setLoading(false);
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 12_000 }
    );
  }, []);

  const baseCafes = initialCafes !== undefined && initialCafes !== null ? initialCafes : mapCafes;

  const withDistance = useMemo(() => {
    const filtered = applyMapFilters(baseCafes, filters);
    return filtered
      .map((c) => ({
        cafe: c,
        km: distanceKm(anchor.lat, anchor.lng, c.lat, c.lng),
      }))
      .filter((x) => x.km <= filters.maxDistanceKm)
      .sort((a, b) => a.km - b.km);
  }, [anchor, filters, baseCafes]);

  const bounds = useMemo(
    () => computeBounds([anchor, ...withDistance.map((x) => ({ lat: x.cafe.lat, lng: x.cafe.lng }))]),
    [anchor, withDistance]
  );

  const cafesForMap = useMemo(() => withDistance.map((x) => x.cafe), [withDistance]);
  const googleMapsKey = getGoogleMapsPublicKey();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-lg backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-riwaq-brown sm:text-2xl">
              {variant === "explore" ? "استكشاف على الخريطة" : "الكافيهات القريبة"}
            </h1>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">
              {googleMapsKey
                ? "خريطة تفاعلية عبر Google Maps."
                : "أضف NEXT_PUBLIC_GOOGLE_MAPS_API_KEY لتفعيل الخريطة الحية. بدونها ستظهر خريطة UI وهمية."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                  setDenied(false);
                  setLoading(false);
                },
                () => {
                  setDenied(true);
                  setLoading(false);
                },
                { timeout: 12_000 }
              );
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-2xl bg-riwaq-brown px-4 text-sm font-extrabold text-white shadow-md hover:bg-riwaq-brown/90 sm:self-auto"
          >
            <LocateFixed className="h-4 w-4" />
            تحديث الموقع
          </button>
        </div>

        {loading ? (
          <p className="mt-4 rounded-2xl bg-riwaq-cream/60 px-4 py-3 text-sm font-bold text-riwaq-muted">جارٍ تحديد موقعك…</p>
        ) : null}

        {denied && !userPos ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm font-bold text-amber-950">
            <p>لم نتمكن من الوصول لموقعك. اختر منطقتك يدويًا أو حاول من جديد.</p>
            <label className="block text-xs font-extrabold text-riwaq-muted">المنطقة</label>
            <select
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white py-2.5 pr-3 text-sm font-bold"
            >
              {manualRegionCenters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {userPos ? (
          <p className="mt-4 rounded-2xl bg-emerald-50/90 px-4 py-2 text-xs font-extrabold text-emerald-900 ring-1 ring-emerald-200">
            تم ضبط موقعك — المسافات تقريبية (كم)
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {googleMapsKey ? (
            <CafeGoogleMap anchor={anchor} cafes={cafesForMap} apiKey={googleMapsKey} />
          ) : (
            <FakeMap anchor={anchor} cafes={cafesForMap} bounds={bounds} />
          )}

          <div className="lg:hidden">
            <details className="rounded-3xl border border-riwaq-beige bg-white/90 shadow-md open:shadow-lg">
              <summary className="cursor-pointer list-none rounded-3xl px-4 py-3 text-sm font-extrabold text-riwaq-brown [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                  فلاتر الخريطة
                </span>
              </summary>
              <div className="border-t border-riwaq-beige p-3">
                <CafeFilterPanel value={filters} onChange={setFilters} />
              </div>
            </details>
          </div>

          <section>
            <h2 className="text-lg font-extrabold text-riwaq-brown">الأقرب أولًا</h2>
            <p className="text-xs font-bold text-riwaq-muted">عدد النتائج: {withDistance.length.toLocaleString("ar-SA")}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {withDistance.map(({ cafe, km }) => (
                <li key={cafe.id}>
                  <CafeMapCard cafe={cafe} distanceKm={km} />
                </li>
              ))}
            </ul>
            {withDistance.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-riwaq-beige bg-riwaq-cream/40 p-8 text-center text-sm font-bold text-riwaq-muted">
                لا توجد كافيهات ضمن الفلاتر — جرّب توسيع المسافة أو إعادة الضبط.
              </div>
            ) : null}
          </section>
        </div>

        <aside className="hidden lg:block">
          <CafeFilterPanel value={filters} onChange={setFilters} />
        </aside>
      </div>
    </div>
  );
}

function computeBounds(points: { lat: number; lng: number }[]) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

function FakeMap({ anchor, cafes, bounds }: { anchor: { lat: number; lng: number }; cafes: MapCafe[]; bounds: ReturnType<typeof computeBounds> }) {
  const pad = 0.02;
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.05) + pad * 2;
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.05) + pad * 2;

  function pinStyle(lat: number, lng: number) {
    const y = 100 - ((lat - bounds.minLat + pad) / latSpan) * 100;
    const x = 100 - ((lng - bounds.minLng + pad) / lngSpan) * 100;
    return { top: `${y}%`, left: `${x}%` };
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-riwaq-beige bg-linear-to-br from-riwaq-cream via-white to-riwaq-beige/50 shadow-inner">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,36,22,0.14) 1px, transparent 0)`,
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative aspect-[16/11] w-full sm:aspect-[21/9]">
        <div className="absolute inset-3 rounded-2xl border border-white/80 bg-white/25 backdrop-blur-[2px]" />
        <span
          className="absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-riwaq-caramel text-white shadow-lg ring-2 ring-white"
          style={pinStyle(anchor.lat, anchor.lng)}
          title="موقعك"
        >
          <LocateFixed className="h-4 w-4" aria-hidden />
        </span>
        {cafes.slice(0, 12).map((c) => (
          <span
            key={c.id}
            className="absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-riwaq-brown text-[10px] font-extrabold text-white shadow-md ring-2 ring-white/90"
            style={pinStyle(c.lat, c.lng)}
            title={c.name}
          >
            ق
          </span>
        ))}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/45 px-3 py-2 text-[10px] font-extrabold text-white backdrop-blur-sm">
          <span>خريطة تفاعلية UI</span>
          <span className="opacity-90">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span>
        </div>
      </div>
    </div>
  );
}
