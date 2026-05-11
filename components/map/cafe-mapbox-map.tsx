"use client";

import { useEffect, useRef } from "react";
import type { MapCafe } from "@/lib/mock/map-cafes";
import { getMapboxPublicToken } from "@/lib/map/mapbox-token";

type CafeMapboxMapProps = {
  anchor: { lat: number; lng: number };
  cafes: MapCafe[];
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function CafeMapboxMap({ anchor, cafes }: CafeMapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const cafeKey = cafes.map((c) => `${c.id}:${c.lat}:${c.lng}`).join("|");

  useEffect(() => {
    const token = getMapboxPublicToken();
    const el = containerRef.current;
    if (!token || !el) return;

    let cancelled = false;
    let map: import("mapbox-gl").Map | null = null;
    const markers: import("mapbox-gl").Marker[] = [];
    let ro: ResizeObserver | null = null;

    void import("mapbox-gl")
      .then((mod) => {
      if (cancelled || !containerRef.current) return;

      const mapboxgl = mod.default;
      mapboxgl.accessToken = token;

      const nextMap = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [anchor.lng, anchor.lat],
        zoom: 10,
        cooperativeGestures: true,
        attributionControl: true,
        language: "ar",
      });

      if (cancelled) {
        nextMap.remove();
        return;
      }

      map = nextMap;

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

      const userDot = document.createElement("div");
      userDot.style.cssText =
        "width:28px;height:28px;border-radius:9999px;background:#c78a45;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.28)";
      userDot.title = "موقعك";
      markers.push(new mapboxgl.Marker({ element: userDot }).setLngLat([anchor.lng, anchor.lat]).addTo(map));

      for (const c of cafes) {
        const pin = document.createElement("div");
        pin.style.cssText =
          "width:26px;height:26px;border-radius:9999px;background:#3b2416;border:2px solid #fff;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.22);cursor:pointer";
        pin.textContent = "ق";
        pin.title = c.name;
        const popupHtml = `<div dir="rtl" style="padding:6px 8px;max-width:240px;font-family:var(--font-tajawal),Tahoma,sans-serif;font-size:13px"><strong style="color:#3b2416">${escapeHtml(c.name)}</strong><br/><span style="color:#6f6258;font-size:12px">${escapeHtml(c.city)}</span><br/><a href="/customer/cafes/${encodeURIComponent(c.id)}" style="color:#c78a45;font-weight:700;font-size:12px;margin-top:6px;display:inline-block">عرض الكوفي</a></div>`;
        const popup = new mapboxgl.Popup({ offset: 18, maxWidth: "260px" }).setHTML(popupHtml);
        markers.push(new mapboxgl.Marker({ element: pin }).setLngLat([c.lng, c.lat]).setPopup(popup).addTo(map));
      }

      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([anchor.lng, anchor.lat]);
      for (const c of cafes) {
        bounds.extend([c.lng, c.lat]);
      }

      map.on("load", () => {
        if (!map || cancelled) return;
        map.resize();
        try {
          if (cafes.length === 0) {
            map.setCenter([anchor.lng, anchor.lat]);
            map.setZoom(11);
          } else {
            map.fitBounds(bounds, {
              padding: { top: 70, bottom: 70, left: 70, right: 70 },
              maxZoom: 14,
              duration: 500,
            });
          }
        } catch {
          map.setCenter([anchor.lng, anchor.lat]);
          map.setZoom(11);
        }
      });

      ro = new ResizeObserver(() => map?.resize());
      ro.observe(el);
      })
      .catch(() => {
        /* فشل تحميل الخريطة — يُرجى التحقق من الشبكة أو الإصدار */
      });

    return () => {
      cancelled = true;
      ro?.disconnect();
      markers.forEach((m) => m.remove());
      markers.length = 0;
      map?.remove();
      map = null;
    };
  }, [anchor.lat, anchor.lng, cafeKey]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-riwaq-beige shadow-inner ring-1 ring-riwaq-beige/60">
      <div ref={containerRef} className="h-[min(52vh,460px)] min-h-[280px] w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/50 px-3 py-2 text-[10px] font-extrabold text-white backdrop-blur-sm">
        <span>Mapbox</span>
        <span className="opacity-90">تفاعل: سحب، تكبير، دوّار</span>
      </div>
    </div>
  );
}
