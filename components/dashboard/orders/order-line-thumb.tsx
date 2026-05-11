"use client";

import { Coffee } from "lucide-react";
import type { LineImageVariant, OrderLineItem } from "@/lib/mock/orders-operations";

const grad: Record<LineImageVariant, string> = {
  latte: "from-[#3b2416] via-[#5c3d2e] to-[#c78a45]",
  cold: "from-[#1e3a4a] via-[#496b4a] to-[#7eb8b8]",
  cake: "from-[#4a2c3d] via-[#8b5a6b] to-[#d4a59a]",
  bakery: "from-[#5c4a3a] via-[#8b7355] to-[#e8dcc8]",
};

export function OrderLineThumb({ line }: { line: OrderLineItem }) {
  return (
    <div className="flex shrink-0 gap-3 rounded-2xl border border-riwaq-beige/90 bg-white/90 p-3 shadow-sm ring-1 ring-white/80">
      <div
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${grad[line.imageVariant]}`}
      >
        <Coffee className="h-7 w-7 text-white/90" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <p className="font-extrabold text-sm leading-snug text-riwaq-brown">{line.name}</p>
        <p className="mt-1 text-[11px] font-bold text-riwaq-muted">
          ×{line.qty.toLocaleString("ar-SA")} · {formatSarInline(line.unitPrice)} ·{" "}
          {line.calories.toLocaleString("ar-SA")} سعرة
        </p>
        <p className="mt-1 line-clamp-1 text-[11px] font-bold text-riwaq-muted">
          {line.ingredients.join(" · ")}
        </p>
        {line.customerNotes ? (
          <p className="mt-2 rounded-xl bg-riwaq-caramel/10 px-2 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-caramel/20">
            ملاحظة: {line.customerNotes}
          </p>
        ) : null}
        {line.promo ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-riwaq-green/15 px-2 py-0.5 text-[10px] font-extrabold text-riwaq-green ring-1 ring-riwaq-green/25">
              عرض: {line.promo.kind}
            </span>
            {line.promo.discountSar != null ? (
              <span className="text-[11px] font-extrabold tabular-nums text-riwaq-caramel">
                وفّر {line.promo.discountSar.toLocaleString("ar-SA")} ر.س
              </span>
            ) : null}
            {line.promo.discountPercent != null ? (
              <span className="text-[11px] font-extrabold tabular-nums text-riwaq-caramel">
                {line.promo.discountPercent}% خصم
              </span>
            ) : null}
            {line.promo.label ? (
              <span className="text-[11px] font-bold text-riwaq-muted">{line.promo.label}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatSarInline(n: number) {
  return `${n.toLocaleString("ar-SA")} ر.س`;
}
