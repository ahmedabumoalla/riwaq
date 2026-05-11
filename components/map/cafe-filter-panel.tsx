"use client";

import type { CoffeeStyle, CrowdLevel, MapCafe, PriceTier, ProductTag, ViewType } from "@/lib/mock/map-cafes";

export type MapFilterState = {
  region: string;
  maxDistanceKm: number;
  coffeeStyle: CoffeeStyle | "all";
  productTags: ProductTag[];
  viewTypes: ViewType[];
  priceTier: PriceTier | "all";
  minRating: number;
  crowd: CrowdLevel | "all";
  tablesAvailableNow: "any" | "yes" | "no";
  hasPartition: "any" | "yes" | "no";
  hasHeater: "any" | "yes" | "no";
  hasScreen: "any" | "yes" | "no";
  activeOffers: "any" | "yes" | "no";
  loyaltyHigh: "any" | "yes" | "no";
  workStudy: "any" | "yes" | "no";
  family: "any" | "yes" | "no";
  search: string;
};

export const defaultMapFilters: MapFilterState = {
  region: "all",
  maxDistanceKm: 50,
  coffeeStyle: "all",
  productTags: [],
  viewTypes: [],
  priceTier: "all",
  minRating: 0,
  crowd: "all",
  tablesAvailableNow: "any",
  hasPartition: "any",
  hasHeater: "any",
  hasScreen: "any",
  activeOffers: "any",
  loyaltyHigh: "any",
  workStudy: "any",
  family: "any",
  search: "",
};

const regions = ["all", "الرياض", "جدة", "الدمام", "مكة"] as const;

const productOptions: { id: ProductTag; label: string }[] = [
  { id: "specialty_coffee", label: "قهوة مختصة" },
  { id: "desserts", label: "حلويات" },
  { id: "cold_drinks", label: "مشروبات باردة" },
  { id: "breakfast", label: "إفطار" },
  { id: "sandwich", label: "ساندويتش" },
];

const viewOptions: { id: ViewType; label: string }[] = [
  { id: "interior", label: "داخلية" },
  { id: "outdoor", label: "خارجية" },
  { id: "roof", label: "رووف" },
  { id: "mountain", label: "جبلية" },
  { id: "sea", label: "بحرية" },
  { id: "garden", label: "حديقة" },
];

function TriToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "any" | "yes" | "no";
  onChange: (v: "any" | "yes" | "no") => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-extrabold text-riwaq-muted">{label}</span>
      <div className="flex flex-wrap gap-1">
        {(
          [
            ["any", "الكل"],
            ["yes", "نعم"],
            ["no", "لا"],
          ] as const
        ).map(([k, t]) => (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={`rounded-xl px-2.5 py-1.5 text-[10px] font-extrabold transition ${
              value === k ? "bg-riwaq-brown text-white" : "bg-riwaq-cream text-riwaq-muted ring-1 ring-riwaq-beige hover:bg-riwaq-beige/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CafeFilterPanel({
  value,
  onChange,
}: {
  value: MapFilterState;
  onChange: (next: MapFilterState) => void;
}) {
  function patch(p: Partial<MapFilterState>) {
    onChange({ ...value, ...p });
  }

  function toggleTag(tag: ProductTag) {
    const set = new Set(value.productTags);
    if (set.has(tag)) set.delete(tag);
    else set.add(tag);
    patch({ productTags: [...set] });
  }

  function toggleView(v: ViewType) {
    const set = new Set(value.viewTypes);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    patch({ viewTypes: [...set] });
  }

  return (
    <div className="scrollbar-none max-h-[70vh] space-y-4 overflow-y-auto rounded-3xl border border-white/90 bg-white/85 p-4 shadow-md backdrop-blur-xl sm:max-h-none sm:overflow-visible">
      <div>
        <label className="text-xs font-extrabold text-riwaq-muted">بحث</label>
        <input
          value={value.search}
          onChange={(e) => patch({ search: e.target.value })}
          placeholder="اسم كوفي، منتج، منطقة، نوع جلسة…"
          className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-sm font-bold text-riwaq-brown placeholder:text-riwaq-muted/70"
        />
      </div>

      <div>
        <label className="text-xs font-extrabold text-riwaq-muted">المنطقة</label>
        <select
          value={value.region}
          onChange={(e) => patch({ region: e.target.value })}
          className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white py-2.5 pr-3 text-sm font-bold"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === "all" ? "كل المناطق" : r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-extrabold text-riwaq-muted">أقصى مسافة: {value.maxDistanceKm} كم</label>
        <input
          type="range"
          min={1}
          max={80}
          value={value.maxDistanceKm}
          onChange={(e) => patch({ maxDistanceKm: Number(e.target.value) })}
          className="mt-2 w-full accent-riwaq-caramel"
        />
      </div>

      <div>
        <span className="text-xs font-extrabold text-riwaq-muted">نوع الكوفي</span>
        <div className="mt-2 flex flex-wrap gap-1">
          {(
            [
              ["all", "الكل"],
              ["specialty", "مختصة"],
              ["commercial", "تجارية"],
              ["mixed", "مختلط"],
            ] as const
          ).map(([k, t]) => (
            <button
              key={k}
              type="button"
              onClick={() => patch({ coffeeStyle: k as MapFilterState["coffeeStyle"] })}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-extrabold ${
                value.coffeeStyle === k ? "bg-riwaq-brown text-white" : "bg-riwaq-cream ring-1 ring-riwaq-beige"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-extrabold text-riwaq-muted">المنتجات</span>
        <div className="mt-2 flex flex-wrap gap-1">
          {productOptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleTag(p.id)}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-extrabold ${
                value.productTags.includes(p.id) ? "bg-riwaq-caramel text-white" : "bg-riwaq-cream ring-1 ring-riwaq-beige"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-extrabold text-riwaq-muted">الإطلالة</span>
        <div className="mt-2 flex flex-wrap gap-1">
          {viewOptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleView(p.id)}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-extrabold ${
                value.viewTypes.includes(p.id) ? "bg-riwaq-green text-white" : "bg-riwaq-cream ring-1 ring-riwaq-beige"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-extrabold text-riwaq-muted">السعر</span>
        <div className="mt-2 flex flex-wrap gap-1">
          {(
            [
              ["all", "الكل"],
              ["budget", "اقتصادي"],
              ["mid", "متوسط"],
              ["premium", "فاخر"],
            ] as const
          ).map(([k, t]) => (
            <button
              key={k}
              type="button"
              onClick={() => patch({ priceTier: k })}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-extrabold ${
                value.priceTier === k ? "bg-riwaq-brown text-white" : "bg-riwaq-cream ring-1 ring-riwaq-beige"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-extrabold text-riwaq-muted">الحد الأدنى للتقييم: {value.minRating.toFixed(1)}</label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={value.minRating}
          onChange={(e) => patch({ minRating: Number(e.target.value) })}
          className="mt-2 w-full accent-riwaq-caramel"
        />
      </div>

      <div>
        <span className="text-xs font-extrabold text-riwaq-muted">الازدحام</span>
        <div className="mt-2 flex flex-wrap gap-1">
          {(
            [
              ["all", "الكل"],
              ["low", "هادئ"],
              ["medium", "متوسط"],
              ["high", "مزدحم"],
            ] as const
          ).map(([k, t]) => (
            <button
              key={k}
              type="button"
              onClick={() => patch({ crowd: k })}
              className={`rounded-xl px-3 py-1.5 text-[11px] font-extrabold ${
                value.crowd === k ? "bg-riwaq-brown text-white" : "bg-riwaq-cream ring-1 ring-riwaq-beige"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <TriToggle label="طاولات متاحة الآن" value={value.tablesAvailableNow} onChange={(v) => patch({ tablesAvailableNow: v })} />
        <TriToggle label="بارتيشن" value={value.hasPartition} onChange={(v) => patch({ hasPartition: v })} />
        <TriToggle label="دفاية" value={value.hasHeater} onChange={(v) => patch({ hasHeater: v })} />
        <TriToggle label="شاشة" value={value.hasScreen} onChange={(v) => patch({ hasScreen: v })} />
        <TriToggle label="عروض نشطة" value={value.activeOffers} onChange={(v) => patch({ activeOffers: v })} />
        <TriToggle label="ولاء مرتفع" value={value.loyaltyHigh} onChange={(v) => patch({ loyaltyHigh: v })} />
        <TriToggle label="مناسب للعمل/الدراسة" value={value.workStudy} onChange={(v) => patch({ workStudy: v })} />
        <TriToggle label="مناسب للعوائل" value={value.family} onChange={(v) => patch({ family: v })} />
      </div>

      <button
        type="button"
        onClick={() => onChange({ ...defaultMapFilters })}
        className="w-full rounded-2xl border border-riwaq-beige bg-riwaq-cream/60 py-2.5 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-beige/60"
      >
        إعادة ضبط الفلاتر
      </button>
    </div>
  );
}

export function applyMapFilters(cafes: MapCafe[], f: MapFilterState): MapCafe[] {
  const q = f.search.trim().toLowerCase();
  return cafes.filter((c) => {
    if (f.region !== "all" && c.region !== f.region) return false;
    if (f.coffeeStyle !== "all" && c.coffeeStyle !== f.coffeeStyle) return false;
    if (f.priceTier !== "all" && c.priceTier !== f.priceTier) return false;
    if (c.rating < f.minRating) return false;
    if (f.crowd !== "all" && c.crowd !== f.crowd) return false;
    if (f.productTags.length && !f.productTags.every((t) => c.productTags.includes(t))) return false;
    if (f.viewTypes.length && !f.viewTypes.some((v) => c.viewTypes.includes(v))) return false;
    if (f.tablesAvailableNow === "yes" && !c.tablesAvailableNow) return false;
    if (f.tablesAvailableNow === "no" && c.tablesAvailableNow) return false;
    if (f.hasPartition === "yes" && !c.hasPartition) return false;
    if (f.hasPartition === "no" && c.hasPartition) return false;
    if (f.hasHeater === "yes" && !c.hasHeater) return false;
    if (f.hasHeater === "no" && c.hasHeater) return false;
    if (f.hasScreen === "yes" && !c.hasScreen) return false;
    if (f.hasScreen === "no" && c.hasScreen) return false;
    if (f.activeOffers === "yes" && !c.activeOffers) return false;
    if (f.activeOffers === "no" && c.activeOffers) return false;
    if (f.loyaltyHigh === "yes" && !c.loyaltyPointsHigh) return false;
    if (f.loyaltyHigh === "no" && c.loyaltyPointsHigh) return false;
    if (f.workStudy === "yes" && !c.workStudyFriendly) return false;
    if (f.workStudy === "no" && c.workStudyFriendly) return false;
    if (f.family === "yes" && !c.familyFriendly) return false;
    if (f.family === "no" && c.familyFriendly) return false;
    if (q) {
      const blob = `${c.name} ${c.city} ${c.region} ${c.menuHighlights.join(" ")} ${c.tagline}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}
