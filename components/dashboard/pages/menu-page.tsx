"use client";

import {
  BarChart3,
  Candy,
  CheckCircle2,
  Coffee,
  Layers,
  Percent,
  Plus,
  Search,
  Snowflake,
  Sparkles,
  Tag,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { MenuProductCard } from "@/components/dashboard/menu/menu-product-card";
import { MenuProductFormModal } from "@/components/dashboard/menu/menu-product-form-modal";
import { Modal } from "@/components/dashboard/ui/modal";
import { formatSar } from "@/lib/format";
import {
  initialMenuProducts,
  isPromoActive,
  MENU_TABS,
  type MenuCategory,
  type MenuProduct,
  type MenuTabId,
} from "@/lib/mock/menu";

let productIdSeq = initialMenuProducts.length + 1;

type StatusFilter = "all" | "available" | "unavailable";
type PromoFilter = "all" | "yes" | "no";

export function MenuPageClient({ initialProducts }: { initialProducts?: MenuProduct[] } = {}) {
  const [products, setProducts] = useState<MenuProduct[]>(() =>
    initialProducts !== undefined ? initialProducts : initialMenuProducts,
  );

  const [tab, setTab] = useState<MenuTabId>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [promoFilter, setPromoFilter] = useState<PromoFilter>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<MenuProduct | null>(null);

  const stats = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.available).length;
    const unavailable = total - available;
    const activeOffers = products.filter((p) => p.promo && isPromoActive(p.promo)).length;
    const avgPrice =
      total === 0 ? 0 : products.reduce((s, p) => s + p.price, 0) / total;
    const topLoyalty = products.reduce<MenuProduct | null>((best, p) => {
      if (!best || p.loyaltyPoints > best.loyaltyPoints) return p;
      return best;
    }, null);

    return {
      total,
      available,
      unavailable,
      activeOffers,
      avgPrice,
      topLoyalty,
    };
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim();

    return products.filter((p) => {
      if (tab === "coffee" && p.category !== "قهوة") return false;
      if (tab === "desserts" && p.category !== "حلويات") return false;
      if (tab === "cold" && p.category !== "مشروبات باردة") return false;
      if (tab === "offers" && !p.promo) return false;

      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;

      if (statusFilter === "available" && !p.available) return false;
      if (statusFilter === "unavailable" && p.available) return false;

      if (promoFilter === "yes" && !p.promo) return false;
      if (promoFilter === "no" && p.promo) return false;

      if (q && !p.name.includes(q)) return false;

      return true;
    });
  }, [products, tab, categoryFilter, statusFilter, promoFilter, search]);

  function openAdd() {
    setFormMode("add");
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(p: MenuProduct) {
    setFormMode("edit");
    setEditingProduct(p);
    setFormOpen(true);
  }

  function handleSave(payload: MenuProduct) {
    if (!payload.id) {
      const id = `p${productIdSeq++}`;
      setProducts((prev) => [...prev, { ...payload, id }]);
      return;
    }
    setProducts((prev) => prev.map((x) => (x.id === payload.id ? payload : x)));
  }

  function toggleAvailability(id: string) {
    setProducts((prev) =>
      prev.map((x) => (x.id === id ? { ...x, available: !x.available } : x)),
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const statCards = [
    {
      label: "إجمالي المنتجات",
      value: stats.total.toLocaleString("ar-SA"),
      hint: "ضمن فرع الواجهة البحرية",
      icon: Layers,
      ring: "ring-riwaq-brown/15",
      iconBg: "bg-riwaq-brown/10 text-riwaq-brown",
    },
    {
      label: "المتاحة",
      value: stats.available.toLocaleString("ar-SA"),
      hint: "ظاهرة في المنيو الرقمي",
      icon: CheckCircle2,
      ring: "ring-riwaq-green/25",
      iconBg: "bg-riwaq-green/15 text-riwaq-green",
    },
    {
      label: "غير المتاحة",
      value: stats.unavailable.toLocaleString("ar-SA"),
      hint: "مخفية أو موقوفة",
      icon: XCircle,
      ring: "ring-riwaq-brown/15",
      iconBg: "bg-riwaq-brown/10 text-riwaq-brown",
    },
    {
      label: "العروض النشطة",
      value: stats.activeOffers.toLocaleString("ar-SA"),
      hint: "ضمن فترة العرض الحالية",
      icon: Percent,
      ring: "ring-riwaq-caramel/25",
      iconBg: "bg-riwaq-caramel/15 text-riwaq-caramel",
    },
    {
      label: "متوسط السعر",
      value: stats.total === 0 ? formatSar(0) : formatSar(Math.round(stats.avgPrice)),
      hint: "قيمة تقريبية للفئة المعروضة",
      icon: BarChart3,
      ring: "ring-riwaq-green/20",
      iconBg: "bg-riwaq-green/15 text-riwaq-green",
    },
    {
      label: "أعلى نقاط ولاء",
      value: stats.topLoyalty ? stats.topLoyalty.loyaltyPoints.toLocaleString("ar-SA") : "٠",
      hint: stats.topLoyalty?.name ?? "—",
      icon: Sparkles,
      ring: "ring-riwaq-caramel/20",
      iconBg: "bg-riwaq-caramel/15 text-riwaq-caramel",
    },
  ];

  return (
    <div className="space-y-8 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-riwaq-muted">إدارة المنيو الرقمي</p>
          <h2 className="mt-1 font-extrabold text-2xl text-riwaq-brown">منتجات الفرع</h2>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-l from-riwaq-brown to-[#2d1a10] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-riwaq-brown/25 transition hover:brightness-105"
        >
          <Plus className="h-5 w-5" aria-hidden />
          إضافة منتج
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="إحصائيات المنيو">
        {statCards.map(({ label, value, hint, icon: Icon, ring, iconBg }) => (
          <article
            key={label}
            className={`rounded-3xl border border-white/85 bg-white/70 p-5 shadow-lg shadow-riwaq-brown/6 backdrop-blur-md ring-1 ${ring}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-riwaq-muted">{label}</p>
                <p className="mt-2 font-extrabold text-3xl tabular-nums text-riwaq-brown">{value}</p>
                <p className="mt-2 line-clamp-2 text-xs font-bold text-riwaq-muted">{hint}</p>
              </div>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
            </div>
          </article>
        ))}
      </section>

      <div className="rounded-3xl border border-white/85 bg-white/65 p-4 shadow-lg shadow-riwaq-brown/6 backdrop-blur-md ring-1 ring-riwaq-beige/80 lg:p-5">
        <p className="mb-3 text-xs font-extrabold text-riwaq-muted">تصفية العرض</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <label className="block min-w-[200px] flex-1">
            <span className="text-[11px] font-extrabold text-riwaq-muted">بحث باسم المنتج</span>
            <span className="relative mt-1 flex items-center">
              <Search className="pointer-events-none absolute right-3 h-4 w-4 text-riwaq-muted" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="لاتيه، كيك..."
                className="w-full rounded-2xl border border-riwaq-beige bg-white py-3 pr-10 pl-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 placeholder:text-riwaq-muted/50 focus:ring-2"
              />
            </span>
          </label>

          <label className="block min-w-[160px]">
            <span className="text-[11px] font-extrabold text-riwaq-muted">التصنيف</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as MenuCategory | "all")}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            >
              <option value="all">الكل</option>
              <option value="قهوة">قهوة</option>
              <option value="حلويات">حلويات</option>
              <option value="مشروبات باردة">مشروبات باردة</option>
              <option value="مخبوزات">مخبوزات</option>
            </select>
          </label>

          <label className="block min-w-[160px]">
            <span className="text-[11px] font-extrabold text-riwaq-muted">الحالة</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            >
              <option value="all">الكل</option>
              <option value="available">متاح</option>
              <option value="unavailable">غير متاح</option>
            </select>
          </label>

          <label className="block min-w-[180px]">
            <span className="text-[11px] font-extrabold text-riwaq-muted">وجود عرض</span>
            <select
              value={promoFilter}
              onChange={(e) => setPromoFilter(e.target.value as PromoFilter)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            >
              <option value="all">الكل</option>
              <option value="yes">يوجد عرض</option>
              <option value="no">بدون عرض</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MENU_TABS.map((t) => {
          const active = tab === t.id;
          const Icon =
            t.id === "all"
              ? Layers
              : t.id === "coffee"
                ? Coffee
                : t.id === "desserts"
                  ? Candy
                  : t.id === "cold"
                    ? Snowflake
                    : Tag;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                "flex shrink-0 items-center gap-2 rounded-3xl px-5 py-2.5 text-sm font-extrabold transition",
                active
                  ? "bg-riwaq-brown text-white shadow-md shadow-riwaq-brown/25"
                  : "border border-riwaq-beige bg-white/80 text-riwaq-brown hover:border-riwaq-caramel/35",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 opacity-90" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-riwaq-beige bg-white/50 px-8 py-16 text-center shadow-inner">
          <p className="font-extrabold text-lg text-riwaq-brown">لا توجد منتجات ضمن هذا العرض</p>
          <p className="mt-2 text-sm font-bold text-riwaq-muted">جرّب تغيير التبويب أو الفلاتر أو البحث.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <MenuProductCard
              key={p.id}
              product={p}
              freeProductLabel={
                p.promo?.freeProductId
                  ? products.find((x) => x.id === p.promo?.freeProductId)?.name
                  : undefined
              }
              onEdit={() => openEdit(p)}
              onToggleAvailability={() => toggleAvailability(p.id)}
              onDelete={() => setDeleteTarget(p)}
            />
          ))}
        </div>
      )}

      <MenuProductFormModal
        open={formOpen}
        mode={formMode}
        editingProduct={formMode === "edit" ? editingProduct : null}
        productList={products}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <Modal
        open={deleteTarget !== null}
        title="تأكيد حذف المنتج"
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-2xl bg-red-700 px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              حذف نهائي
            </button>
          </>
        }
      >
        <p className="text-sm font-bold text-riwaq-muted">
          سيتم إزالة المنتج من القائمة المحلية فقط في هذه النسخة التجريبية.
        </p>
        {deleteTarget ? (
          <p className="mt-3 rounded-2xl bg-riwaq-cream px-4 py-3 font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            {deleteTarget.name}
          </p>
        ) : null}
      </Modal>
    </div>
  );
}
