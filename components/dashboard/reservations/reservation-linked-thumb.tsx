"use client";

import { Coffee } from "lucide-react";
import type { LineVariant } from "@/lib/mock/reservations-center";

const grad: Record<LineVariant, string> = {
  latte: "from-[#3b2416] via-[#5c3d2e] to-[#c78a45]",
  cold: "from-[#1e3a4a] via-[#496b4a] to-[#7eb8b8]",
  cake: "from-[#4a2c3d] via-[#8b5a6b] to-[#d4a59a]",
  bakery: "from-[#5c4a3a] via-[#8b7355] to-[#e8dcc8]",
};

export function ReservationLinkedThumb({
  name,
  qty,
  variant,
}: {
  name: string;
  qty: number;
  variant: LineVariant;
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1 rounded-2xl border border-riwaq-beige bg-white/90 p-2 shadow-sm ring-1 ring-white/80">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${grad[variant]}`}
      >
        <Coffee className="h-6 w-6 text-white/90" aria-hidden />
      </div>
      <p className="max-w-[5rem] truncate text-center text-[10px] font-extrabold leading-tight text-riwaq-brown">
        {name}
      </p>
      <span className="text-[10px] font-bold tabular-nums text-riwaq-muted">×{qty}</span>
    </div>
  );
}
