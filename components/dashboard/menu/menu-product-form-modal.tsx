"use client";

import { Coffee, Flame, Gift, ImagePlus, Sparkles, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/dashboard/ui/modal";
import { formatSar } from "@/lib/format";
import {
  isPromoActive,
  MENU_CATEGORIES,
  PROMO_KINDS,
  promoBadgeText,
  type MenuCategory,
  type MenuImageVariant,
  type MenuProduct,
  type ProductPromo,
  type PromoKind,
} from "@/lib/mock/menu";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  editingProduct: MenuProduct | null;
  /** كل المنتجات لاختيار المنتج المجاني في العرض */
  productList: MenuProduct[];
  onClose: () => void;
  onSave: (product: MenuProduct) => void;
};

const VARIANT_OPTIONS: { id: MenuImageVariant; label: string }[] = [
  { id: "latte", label: "قهوة دافئة" },
  { id: "cold", label: "بارد" },
  { id: "cake", label: "حلويات" },
  { id: "bakery", label: "مخبوزات" },
  { id: "tea", label: "شاي / سبيشل" },
];

function buildPromoFromForm(
  linked: boolean,
  kind: PromoKind,
  discountPercent: string,
  freeProductId: string,
  customText: string,
  startDate: string,
  endDate: string,
): ProductPromo | null {
  if (!linked || !startDate || !endDate) return null;
  const base = { kind, startDate, endDate };
  if (kind === "خصم") {
    const p = Number(discountPercent);
    return { ...base, discountPercent: Number.isFinite(p) ? p : 10 };
  }
  if (kind === "منتج مجاني مع الطلب") {
    return { ...base, freeProductId: freeProductId || undefined };
  }
  if (kind === "عرض مخصص") {
    return { ...base, customText: customText.trim() || "عرض مخصص" };
  }
  return { ...base };
}

export function MenuProductFormModal({
  open,
  mode,
  editingProduct,
  productList,
  onClose,
  onSave,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<MenuCategory>("قهوة");
  const [description, setDescription] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageVariant, setImageVariant] = useState<MenuImageVariant>("latte");
  const [price, setPrice] = useState("22");
  const [calories, setCalories] = useState("220");
  const [loyaltyPoints, setLoyaltyPoints] = useState("20");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientDraft, setIngredientDraft] = useState("");
  const [available, setAvailable] = useState(true);
  const [promoLinked, setPromoLinked] = useState(false);
  const [promoKind, setPromoKind] = useState<PromoKind>("خصم");
  const [promoDiscount, setPromoDiscount] = useState("10");
  const [promoFreeId, setPromoFreeId] = useState("");
  const [promoCustom, setPromoCustom] = useState("");
  const [promoStart, setPromoStart] = useState("2026-05-10");
  const [promoEnd, setPromoEnd] = useState("2026-05-31");

  const resetFromProduct = useCallback((p: MenuProduct | null, isEdit: boolean) => {
    if (isEdit && p) {
      setName(p.name);
      setCategory(p.category);
      setDescription(p.description);
      setImageDataUrl(p.imageDataUrl ?? null);
      setImageVariant(p.imageVariant);
      setPrice(String(p.price));
      setCalories(String(p.calories));
      setLoyaltyPoints(String(p.loyaltyPoints));
      setIngredients([...p.ingredients]);
      setAvailable(p.available);
      const pr = p.promo;
      setPromoLinked(!!pr);
      if (pr) {
        setPromoKind(pr.kind);
        setPromoDiscount(pr.discountPercent != null ? String(pr.discountPercent) : "10");
        setPromoFreeId(pr.freeProductId ?? "");
        setPromoCustom(pr.customText ?? "");
        setPromoStart(pr.startDate);
        setPromoEnd(pr.endDate);
      } else {
        setPromoKind("خصم");
        setPromoDiscount("10");
        setPromoFreeId("");
        setPromoCustom("");
        setPromoStart("2026-05-10");
        setPromoEnd("2026-05-31");
      }
    } else {
      setName("");
      setCategory("قهوة");
      setDescription("");
      setImageDataUrl(null);
      setImageVariant("latte");
      setPrice("22");
      setCalories("220");
      setLoyaltyPoints("20");
      setIngredients([]);
      setIngredientDraft("");
      setAvailable(true);
      setPromoLinked(false);
      setPromoKind("خصم");
      setPromoDiscount("10");
      setPromoFreeId("");
      setPromoCustom("");
      setPromoStart("2026-05-10");
      setPromoEnd("2026-05-31");
    }
    setIngredientDraft("");
  }, []);

  useEffect(() => {
    if (!open) return;
    resetFromProduct(editingProduct, mode === "edit");
  }, [open, mode, editingProduct, resetFromProduct]);

  function addIngredient() {
    const t = ingredientDraft.trim();
    if (!t) return;
    setIngredients((prev) => [...prev, t]);
    setIngredientDraft("");
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result;
      if (typeof res === "string") setImageDataUrl(res);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const previewProduct: MenuProduct = useMemo(() => {
    const promo = buildPromoFromForm(
      promoLinked,
      promoKind,
      promoDiscount,
      promoFreeId,
      promoCustom,
      promoStart,
      promoEnd,
    );
    return {
      id: "preview",
      name: name.trim() || "اسم المنتج",
      category,
      description: description.trim() || "وصف مختصر يظهر للضيف في المنيو الرقمي.",
      imageDataUrl,
      imageVariant,
      price: Number(price) || 0,
      calories: Number(calories) || 0,
      loyaltyPoints: Number(loyaltyPoints) || 0,
      ingredients: ingredients.length ? ingredients : ["مكون"],
      available,
      promo,
    };
  }, [
    name,
    category,
    description,
    imageDataUrl,
    imageVariant,
    price,
    calories,
    loyaltyPoints,
    ingredients,
    available,
    promoLinked,
    promoKind,
    promoDiscount,
    promoFreeId,
    promoCustom,
    promoStart,
    promoEnd,
  ]);

  const freeProductOptions = productList.filter((p) => p.id !== editingProduct?.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceN = Number(price);
    const calN = Number(calories);
    const ptsN = Number(loyaltyPoints);
    if (!name.trim() || Number.isNaN(priceN) || Number.isNaN(calN) || Number.isNaN(ptsN)) return;

    if (promoLinked && promoKind === "منتج مجاني مع الطلب" && !promoFreeId) return;

    const promo = buildPromoFromForm(
      promoLinked,
      promoKind,
      promoDiscount,
      promoFreeId,
      promoCustom,
      promoStart,
      promoEnd,
    );

    const payload: MenuProduct = {
      id: editingProduct?.id ?? "",
      name: name.trim(),
      category,
      description: description.trim(),
      imageDataUrl,
      imageVariant,
      price: priceN,
      calories: calN,
      loyaltyPoints: ptsN,
      ingredients,
      available,
      promo,
    };

    onSave(payload);
    onClose();
  }

  const variantGradient: Record<MenuImageVariant, string> = {
    latte: "from-[#3b2416] via-[#5c3d2e] to-[#c78a45]",
    cold: "from-[#1e3a4a] via-[#496b4a] to-[#7eb8b8]",
    cake: "from-[#4a2c3d] via-[#8b5a6b] to-[#d4a59a]",
    bakery: "from-[#5c4a3a] via-[#8b7355] to-[#e8dcc8]",
    tea: "from-[#3d4f3f] via-[#496b4a] to-[#a8c4a9]",
  };

  const promoPreviewActive = previewProduct.promo && isPromoActive(previewProduct.promo);

  return (
    <Modal
      open={open}
      title={mode === "add" ? "إضافة منتج جديد" : "تعديل المنتج"}
      onClose={onClose}
      panelClassName="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/90 bg-white shadow-2xl shadow-riwaq-brown/25"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="menu-product-form"
            className="rounded-2xl bg-gradient-to-l from-riwaq-brown to-[#2d1a10] px-6 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-riwaq-brown/25 hover:brightness-105"
          >
            {mode === "add" ? "حفظ المنتج" : "تحديث المنتج"}
          </button>
        </>
      }
    >
      <form id="menu-product-form" onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
        <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1 lg:max-h-[75vh]">
          <div className="rounded-2xl bg-riwaq-cream/60 px-4 py-3 ring-1 ring-riwaq-beige/80">
            <p className="text-xs font-extrabold text-riwaq-brown">
              نموذج جاهز للربط لاحقًا بـ API — الحقول تعكس شكل الـ DTO المتوقع.
            </p>
          </div>

          <label className="block">
            <span className="text-xs font-extrabold text-riwaq-muted">اسم المنتج</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            />
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-riwaq-muted">التصنيف</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MenuCategory)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            >
              {MENU_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-extrabold text-riwaq-muted">وصف المنتج</span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            />
          </label>

          <div className="rounded-3xl border border-riwaq-beige/90 bg-white/80 p-4 ring-1 ring-white/80">
            <p className="text-xs font-extrabold text-riwaq-muted">صورة المنتج</p>
            <p className="mt-1 text-[11px] font-bold text-riwaq-muted">
              واجهة رفع وهمية محليًا فقط — لا يُرفع إلى خادم بعد.
            </p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-riwaq-caramel/50 bg-riwaq-cream/50 px-4 py-3 text-sm font-extrabold text-riwaq-brown transition hover:bg-riwaq-beige/60"
              >
                <ImagePlus className="h-5 w-5 text-riwaq-caramel" aria-hidden />
                اختيار صورة
              </button>
              {imageDataUrl ? (
                <button
                  type="button"
                  onClick={() => setImageDataUrl(null)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 ring-1 ring-red-100 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  إزالة الصورة
                </button>
              ) : null}
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-extrabold text-riwaq-muted">خلفية احتياطية عند عدم رفع صورة</span>
              <select
                value={imageVariant}
                onChange={(e) => setImageVariant(e.target.value as MenuImageVariant)}
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              >
                {VARIANT_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">السعر (ر.س)</span>
              <input
                required
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">السعرات الحرارية</span>
              <input
                required
                inputMode="numeric"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">نقاط الولاء</span>
              <input
                required
                inputMode="numeric"
                value={loyaltyPoints}
                onChange={(e) => setLoyaltyPoints(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
          </div>

          <div>
            <span className="text-xs font-extrabold text-riwaq-muted">مكونات المنتج</span>
            <div className="mt-2 flex gap-2">
              <input
                value={ingredientDraft}
                onChange={(e) => setIngredientDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
                placeholder="مثال: حليب، قهوة..."
                className="min-w-0 flex-1 rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 placeholder:text-riwaq-muted/50 focus:ring-2"
              />
              <button
                type="button"
                onClick={addIngredient}
                className="shrink-0 rounded-2xl bg-riwaq-brown px-4 py-3 text-sm font-extrabold text-white hover:brightness-105"
              >
                إضافة
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-1 rounded-full bg-riwaq-beige/80 px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige"
                >
                  {ing}
                  <button
                    type="button"
                    aria-label={`حذف ${ing}`}
                    onClick={() => setIngredients((prev) => prev.filter((x) => x !== ing))}
                    className="rounded-full p-0.5 hover:bg-white/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <fieldset className="rounded-3xl border border-riwaq-beige bg-white/70 p-4">
            <legend className="px-2 text-xs font-extrabold text-riwaq-brown">حالة المنتج</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-riwaq-brown">
                <input type="radio" name="avail" checked={available} onChange={() => setAvailable(true)} />
                متاح
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-riwaq-brown">
                <input type="radio" name="avail" checked={!available} onChange={() => setAvailable(false)} />
                غير متاح
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-riwaq-beige bg-white/70 p-4">
            <legend className="px-2 text-xs font-extrabold text-riwaq-brown">هل يوجد عرض مرتبط؟</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-riwaq-brown">
                <input type="radio" name="promo" checked={!promoLinked} onChange={() => setPromoLinked(false)} />
                لا
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-extrabold text-riwaq-brown">
                <input type="radio" name="promo" checked={promoLinked} onChange={() => setPromoLinked(true)} />
                نعم
              </label>
            </div>

            {promoLinked ? (
              <div className="mt-5 space-y-4 border-t border-riwaq-beige/80 pt-4">
                <label className="block">
                  <span className="text-xs font-extrabold text-riwaq-muted">نوع العرض</span>
                  <select
                    value={promoKind}
                    onChange={(e) => setPromoKind(e.target.value as PromoKind)}
                    className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                  >
                    {PROMO_KINDS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </label>

                {promoKind === "خصم" ? (
                  <label className="block">
                    <span className="text-xs font-extrabold text-riwaq-muted">قيمة الخصم %</span>
                    <input
                      inputMode="numeric"
                      value={promoDiscount}
                      onChange={(e) => setPromoDiscount(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                    />
                  </label>
                ) : null}

                {promoKind === "منتج مجاني مع الطلب" ? (
                  <label className="block">
                    <span className="text-xs font-extrabold text-riwaq-muted">المنتج المجاني من القائمة الحالية</span>
                    <select
                      value={promoFreeId}
                      onChange={(e) => setPromoFreeId(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                    >
                      <option value="">اختر منتجًا...</option>
                      {freeProductOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                {promoKind === "عرض مخصص" ? (
                  <label className="block">
                    <span className="text-xs font-extrabold text-riwaq-muted">نص العرض المخصص</span>
                    <textarea
                      rows={2}
                      value={promoCustom}
                      onChange={(e) => setPromoCustom(e.target.value)}
                      className="mt-1 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                    />
                  </label>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-extrabold text-riwaq-muted">بداية العرض</span>
                    <input
                      type="date"
                      required={promoLinked}
                      value={promoStart}
                      onChange={(e) => setPromoStart(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-extrabold text-riwaq-muted">نهاية العرض</span>
                    <input
                      type="date"
                      required={promoLinked}
                      value={promoEnd}
                      onChange={(e) => setPromoEnd(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </fieldset>
        </div>

        {/* معاينة */}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-riwaq-caramel" aria-hidden />
            <p className="font-extrabold text-riwaq-brown">معاينة مباشرة</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-riwaq-beige bg-white/90 shadow-xl shadow-riwaq-brown/10 ring-1 ring-white">
            <div className="relative aspect-[4/3] overflow-hidden">
              {previewProduct.imageDataUrl ? (
                <Image
                  src={previewProduct.imageDataUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="400px"
                  className="object-cover"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${variantGradient[previewProduct.imageVariant]}`}
                >
                  <Coffee className="h-12 w-12 text-white/85" aria-hidden />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-riwaq-brown/45 via-transparent to-transparent" />
              {previewProduct.promo ? (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown shadow-md ring-1 ring-riwaq-beige">
                  <Gift className="h-3.5 w-3.5 text-riwaq-caramel" aria-hidden />
                  {promoPreviewActive ? promoBadgeText(previewProduct.promo) : "عرض (تحقق من التواريخ)"}
                </span>
              ) : null}
              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-md ${
                  previewProduct.available
                    ? "bg-riwaq-green/95 text-white"
                    : "bg-white/95 text-riwaq-brown ring-1 ring-riwaq-beige"
                }`}
              >
                {previewProduct.available ? "متاح" : "غير متاح"}
              </span>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-[11px] font-extrabold text-riwaq-caramel">{previewProduct.category}</p>
              <h3 className="font-extrabold text-xl leading-snug text-riwaq-brown">{previewProduct.name}</h3>
              <p className="text-sm font-bold leading-relaxed text-riwaq-muted line-clamp-3">
                {previewProduct.description}
              </p>
              <div className="flex flex-wrap gap-4 border-t border-riwaq-beige pt-4 text-sm">
                <div>
                  <p className="text-[10px] font-extrabold text-riwaq-muted">السعر</p>
                  <p className="font-extrabold tabular-nums text-riwaq-brown">{formatSar(previewProduct.price)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-0.5 text-[10px] font-extrabold text-riwaq-muted">
                    <Flame className="h-3 w-3 text-riwaq-caramel" aria-hidden />
                    سعرات
                  </p>
                  <p className="font-extrabold tabular-nums text-riwaq-brown">
                    {previewProduct.calories.toLocaleString("ar-SA")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-riwaq-muted">ولاء</p>
                  <p className="font-extrabold tabular-nums text-riwaq-caramel">
                    +{previewProduct.loyaltyPoints.toLocaleString("ar-SA")}
                  </p>
                </div>
              </div>
              {previewProduct.promo ? (
                <p className="rounded-2xl bg-riwaq-cream px-3 py-2 text-xs font-bold text-riwaq-brown ring-1 ring-riwaq-beige">
                  العرض:{" "}
                  <span className="font-extrabold">{promoBadgeText(previewProduct.promo)}</span>
                  {promoPreviewActive ? (
                    <span className="mr-2 text-riwaq-green"> · نشط الآن</span>
                  ) : (
                    <span className="mr-2 text-riwaq-muted"> · تحقق من فترة النشاط</span>
                  )}
                </p>
              ) : (
                <p className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-riwaq-muted ring-1 ring-riwaq-beige">
                  بدون عرض مرتبط
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
