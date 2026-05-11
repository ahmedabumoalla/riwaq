"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ReservationQrProps = {
  reservationId: string;
  size?: number;
  className?: string;
};

/** QR وهمي يعرض معرف الحجز كنص مشفّر بصريًا — جاهز للاستبدال برابط حقيقي لاحقًا */
export function ReservationQr({ reservationId, size = 112, className }: ReservationQrProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const payload = `RIWAQ-RSV:${reservationId}`;

    import("qrcode")
      .then((mod) =>
        mod.default.toDataURL(payload, {
          width: size,
          margin: 1,
          color: { dark: "#3B2416", light: "#FFFFFF" },
        }),
      )
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [reservationId, size]);

  if (!dataUrl) {
    return (
      <div
        className={`animate-pulse rounded-2xl bg-riwaq-beige ${className ?? ""}`}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={dataUrl}
      alt={`رمز الحجز ${reservationId}`}
      width={size}
      height={size}
      unoptimized
      className={`rounded-2xl border border-riwaq-beige bg-white ${className ?? ""}`}
    />
  );
}
