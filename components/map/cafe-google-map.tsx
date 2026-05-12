"use client";

import { useEffect, useRef } from "react";
import type { MapCafe } from "@/lib/mock/map-cafes";

type CafeGoogleMapProps = {
  anchor: { lat: number; lng: number };
  cafes: MapCafe[];
  apiKey: string;
};

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  const w = window as typeof window & { google?: unknown };
  if (w.google) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("google-maps-script") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("google maps load error")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("google maps load error"));
    document.head.appendChild(script);
  });
}

export function CafeGoogleMap({ anchor, cafes, apiKey }: CafeGoogleMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cafeKey = cafes.map((c) => `${c.id}:${c.lat}:${c.lng}`).join("|");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let disposed = false;
    let markers: Array<{ setMap: (map: null) => void }> = [];

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (disposed || !containerRef.current) return;
        const w = window as typeof window & { google: any };
        const map = new w.google.maps.Map(containerRef.current, {
          center: { lat: anchor.lat, lng: anchor.lng },
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        markers.push(
          new w.google.maps.Marker({
            position: { lat: anchor.lat, lng: anchor.lng },
            map,
            title: "موقعك",
          }),
        );

        cafes.forEach((c) => {
          const marker = new w.google.maps.Marker({
            position: { lat: c.lat, lng: c.lng },
            map,
            title: c.name,
          });
          const info = new w.google.maps.InfoWindow({
            content: `<div dir="rtl" style="font-family:Tahoma,sans-serif"><strong>${c.name}</strong><br/><a href="/customer/cafes/${encodeURIComponent(c.id)}">عرض الكوفي</a></div>`,
          });
          marker.addListener("click", () => info.open({ map, anchor: marker }));
          markers.push(marker);
        });
      })
      .catch(() => {
        // fallback handled by parent
      });

    return () => {
      disposed = true;
      markers.forEach((m) => m.setMap(null));
      markers = [];
    };
  }, [anchor.lat, anchor.lng, cafeKey, apiKey]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-riwaq-beige shadow-inner ring-1 ring-riwaq-beige/60">
      <div ref={containerRef} className="h-[min(52vh,460px)] min-h-[280px] w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-2xl bg-black/50 px-3 py-2 text-[10px] font-extrabold text-white backdrop-blur-sm">
        <span>Google Maps</span>
        <span className="opacity-90">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span>
      </div>
    </div>
  );
}
