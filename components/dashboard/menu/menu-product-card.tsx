"use client";

import { Coffee, Flame, Gift, MoreHorizontal, Pencil, Trash2, Power } from "lucide-react";
import Image from "next/image";
import { formatSar } from "@/lib/format";
import {
  isPromoActive,
  promoBadgeText,
  type MenuImageVariant,
  type MenuProduct,
} from "@/lib/mock/menu";

const variantGradient: Record<MenuImageVariant, string> = {
  latte: "from-[#3b2416] via-[#5c3d2e] to-[#c78a45]",
  cold: "from-[#1e3a4a] via-[#496b4a] to-[#7eb8b8]",
  cake: "from-[#4a2c3d] via-[#8b5a6b] to-[#d4a59a]",
  bakery: "from-[#5c4a3a] via-[#8b7355] to-[#e8dcc8]",
  tea: "from-[#3d4f3f] via-[#496b4a] to-[#a8c4a9]",
};

type MenuProductCardProps = {
  product: MenuProduct;
  freeProductLabel?: string;
  onEdit: () => void;
  onToggleAvailability: () => void;
  onDelete: () => void;
};

export function MenuProductCard({
  product,
  freeProductLabel,
  onEdit,
  onToggleAvailability,
  onDelete,
}: MenuProductCardProps) {
  const promoOn = product.promo != null && isPromoActive(product.promo);
  const showBadge = product.promo != null && promoOn;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/85 bg-white/70 shadow-lg shadow-riwaq-brown/8 backdrop-blur-md ring-1 ring-riwaq-beige/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-riwaq-brown/12">
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.imageDataUrl ? (
          <Image
            src={product.imageDataUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${variantGradient[product.imageVariant]}`}
          >
            <Coffee className="h-14 w-14 text-white/85 drop-shadow-md" aria-hidden />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-riwaq-brown/55 via-transparent to-transparent" />

        {showBadge ? (
          <span className="absolute right-3 top-3 flex max-w-[85%] items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-riwaq-brown shadow-md ring-1 ring-riwaq-beige">
            <Gift className="h-3.5 w-3.5 shrink-0 text-riwaq-caramel" aria-hidden />
            <span className="truncate">{promoBadgeText(product.promo!)}</span>
          </span>
        ) : product.promo ? (
          <span className="absolute right-3 top-3 rounded-full bg-riwaq-brown/70 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
            عرض غير نشط
          </span>
        ) : null}

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-extrabold shadow-md ${
            product.available
              ? "bg-riwaq-green/95 text-white ring-1 ring-white/40"
              : "bg-white/95 text-riwaq-brown ring-1 ring-riwaq-beige"
          }`}
        >
          {product.available ? "متاح" : "غير متاح"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-riwaq-caramel">
              {product.category}
            </p>
            <h3 className="mt-1 line-clamp-2 font-extrabold text-lg leading-snug text-riwaq-brown">
              {product.name}
            </h3>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-riwaq-cream ring-1 ring-riwaq-beige">
            <MoreHorizontal className="h-5 w-5 text-riwaq-muted" aria-hidden />
          </span>
        </div>

        <p className="line-clamp-2 text-sm font-bold leading-relaxed text-riwaq-muted">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.ingredients.slice(0, 4).map((ing) => (
            <span
              key={ing}
              className="rounded-full bg-riwaq-beige/70 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige/90"
            >
              {ing}
            </span>
          ))}
          {product.ingredients.length > 4 ? (
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-muted ring-1 ring-riwaq-beige">
              +{product.ingredients.length - 4}
            </span>
          ) : null}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-3 border-t border-riwaq-beige/80 pt-4 text-center">
          <div>
            <p className="text-[10px] font-extrabold text-riwaq-muted">السعر</p>
            <p className="mt-0.5 font-extrabold tabular-nums text-riwaq-brown">{formatSar(product.price)}</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-0.5 text-[10px] font-extrabold text-riwaq-muted">
              <Flame className="h-3 w-3 text-riwaq-caramel" aria-hidden />
              سعرات
            </p>
            <p className="mt-0.5 font-extrabold tabular-nums text-riwaq-brown">
              {product.calories.toLocaleString("ar-SA")}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-riwaq-muted">ولاء</p>
            <p className="mt-0.5 font-extrabold tabular-nums text-riwaq-caramel">
              +{product.loyaltyPoints.toLocaleString("ar-SA")}
            </p>
          </div>
        </div>

        {product.promo?.kind === "منتج مجاني مع الطلب" && freeProductLabel ? (
          <p className="rounded-2xl bg-riwaq-green/10 px-3 py-2 text-xs font-bold text-riwaq-green ring-1 ring-riwaq-green/20">
            يشمل: <span className="font-extrabold">{freeProductLabel}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-riwaq-beige/70 pt-4">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex flex-1 min-w-[6rem] items-center justify-center gap-1.5 rounded-2xl border border-riwaq-beige bg-white py-2.5 text-xs font-extrabold text-riwaq-brown shadow-sm transition hover:border-riwaq-caramel/45"
          >
            <Pencil className="h-4 w-4" aria-hidden />
            تعديل
          </button>
          <button
            type="button"
            onClick={onToggleAvailability}
            className="inline-flex flex-1 min-w-[6rem] items-center justify-center gap-1.5 rounded-2xl bg-riwaq-brown/10 py-2.5 text-xs font-extrabold text-riwaq-brown transition hover:bg-riwaq-brown/15"
          >
            <Power className="h-4 w-4" aria-hidden />
            {product.available ? "إيقاف" : "تفعيل"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            حذف
          </button>
        </div>
      </div>
    </article>
  );
}
