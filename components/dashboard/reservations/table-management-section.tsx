"use client";

import {
  Armchair,
  Ban,
  Eye,
  ImagePlus,
  LayoutGrid,
  Pencil,
  Plus,
  Sparkles,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "@/components/dashboard/ui/modal";
import {
  ALL_TABLE_SERVICE_IDS,
  OFFER_KIND_LABELS_AR,
  TABLE_CATEGORY_LABELS,
  TABLE_OPS_LABELS,
  TABLE_SERVICE_LABELS,
  type ManagedTable,
  type TableCategory,
  type TableOffer,
  type TableOfferKind,
  type TableOperationalStatus,
  type TableServiceId,
} from "@/lib/mock/reservations-center";

const IMG_PRESETS: { id: string; label: string; cls: string }[] = [
  { id: "warm", label: "دافئ — خشب وكراميل", cls: "bg-linear-to-br from-amber-100 via-white to-riwaq-beige" },
  { id: "cool", label: "هادئ — سماوي", cls: "bg-linear-to-br from-sky-100 via-white to-slate-100" },
  { id: "vip", label: "فاخر — بني ذهبي", cls: "bg-linear-to-br from-riwaq-brown/25 via-riwaq-caramel/15 to-white" },
  { id: "garden", label: "حديقة — أخضر", cls: "bg-linear-to-br from-emerald-100/80 via-white to-riwaq-beige" },
];

const VID_PRESETS: { id: string; label: string; cls: string }[] = [
  { id: "sunset", label: "غروب", cls: "bg-linear-to-t from-orange-200/60 via-violet-200/25 to-sky-50" },
  { id: "city", label: "أفق المدينة", cls: "bg-linear-to-bl from-indigo-200/40 via-white to-slate-100" },
  { id: "cozy", label: "داخلي دافئ", cls: "bg-linear-to-tr from-amber-200/35 via-white to-zinc-50" },
];

const OFFER_KINDS: TableOfferKind[] = [
  "booking_discount",
  "bonus_points",
  "free_product",
  "photo_doc",
  "custom",
];

const OPS_ORDER: TableOperationalStatus[] = [
  "available",
  "reserved",
  "busy",
  "cleaning",
  "active_now",
  "out_of_service",
];

const CAT_ORDER: TableCategory[] = [
  "inside",
  "outside",
  "vip",
  "individuals",
  "meetings",
  "family",
  "scenic",
];

function emptyOffer(): TableOffer {
  return {
    active: false,
    kind: "custom",
    titleAr: "",
    durationAr: "",
    termsAr: "",
  };
}

function defaultNewTable(): ManagedTable {
  const img = IMG_PRESETS[0]!;
  const vid = VID_PRESETS[0]!;
  return {
    id: `t-new-${Date.now()}`,
    label: "جديدة",
    displayName: "طاولة جديدة",
    capacity: 4,
    category: "inside",
    status: "available",
    description: "أضف وصفًا يبرز مزايا هذه الطاولة للضيوف.",
    imagePlaceholderClass: img.cls,
    videoPlaceholderClass: vid.cls,
    defaultBookingMinutes: 90,
    minOrderSar: undefined,
    hasBuiltInPartition: false,
    servicesAvailable: ["charger"],
    offer: null,
    loyalty: {
      baseBooking: 30,
      documentationBonus: 50,
      publishBonus: 80,
      viewsThreshold: 1000,
      viewsBonus: 120,
    },
    bookingPaused: false,
  };
}

export function TableManagementSection({
  tables,
  onTablesChange,
  onOpenFloorPlan,
}: {
  tables: ManagedTable[];
  onTablesChange: React.Dispatch<React.SetStateAction<ManagedTable[]>>;
  onOpenFloorPlan: () => void;
}) {
  const [viewId, setViewId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedTable | null>(null);
  const [fakeImgOk, setFakeImgOk] = useState(false);
  const [fakeVidOk, setFakeVidOk] = useState(false);

  const viewTable = useMemo(
    () => tables.find((t) => t.id === viewId) ?? null,
    [tables, viewId],
  );

  function openAdd() {
    const n = defaultNewTable();
    setEditing(n);
    setFakeImgOk(false);
    setFakeVidOk(false);
    setFormOpen(true);
  }

  function openEdit(t: ManagedTable) {
    setEditing({ ...t });
    setFakeImgOk(true);
    setFakeVidOk(true);
    setFormOpen(true);
  }

  function saveForm() {
    if (!editing) return;
    onTablesChange((prev) => {
      const idx = prev.findIndex((x) => x.id === editing.id);
      if (idx === -1) return [...prev, editing];
      const next = [...prev];
      next[idx] = editing;
      return next;
    });
    setFormOpen(false);
    setEditing(null);
  }

  function toggleBookingPause(id: string) {
    onTablesChange((prev) =>
      prev.map((t) => (t.id === id ? { ...t, bookingPaused: !t.bookingPaused } : t)),
    );
  }

  return (
    <section className="space-y-5" aria-labelledby="table-mgmt-title">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/85 bg-white/70 p-5 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="table-mgmt-title" className="font-extrabold text-xl text-riwaq-brown">
            إدارة الطاولات
          </h2>
          <p className="mt-1 max-w-2xl text-sm font-bold leading-relaxed text-riwaq-muted">
            كروت تشغيلية لكل طاولة — صور وفيديوهات وهمية، عروض، ونقاط ولاء للتوثيق. البيانات محلية للعرض فقط.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenFloorPlan}
            className="inline-flex items-center gap-2 rounded-3xl border border-riwaq-beige bg-white px-5 py-3 text-sm font-extrabold text-riwaq-brown shadow-sm hover:border-riwaq-caramel/40"
          >
            <LayoutGrid className="h-5 w-5 text-riwaq-caramel" aria-hidden />
            مخطط الأرضية
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-linear-to-l from-riwaq-brown to-[#2d1a10] px-6 py-3 text-sm font-extrabold text-white shadow-lg hover:brightness-105"
          >
            <Plus className="h-5 w-5" aria-hidden />
            إضافة طاولة
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {tables.map((t) => (
          <article
            key={t.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-white/90 bg-white/75 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 ring-riwaq-beige/70"
          >
            <div className={`relative h-36 ${t.imagePlaceholderClass} ring-1 ring-white/80`}>
              <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown shadow-sm ring-1 ring-riwaq-beige">
                {TABLE_OPS_LABELS[t.status]}
              </span>
              {t.bookingPaused ? (
                <span className="absolute end-3 top-3 rounded-full bg-red-600/95 px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                  حجز متوقف
                </span>
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center">
                <Armchair className="h-14 w-14 text-riwaq-brown/25" aria-hidden />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <p className="text-xs font-extrabold text-riwaq-muted">{t.displayName}</p>
                <h3 className="mt-1 font-extrabold text-lg text-riwaq-brown">طاولة {t.label}</h3>
                <p className="mt-2 text-sm font-bold leading-relaxed text-riwaq-muted">{t.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-extrabold">
                <span className="rounded-full bg-riwaq-cream px-3 py-1 text-riwaq-brown ring-1 ring-riwaq-beige">
                  {TABLE_CATEGORY_LABELS[t.category]}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-riwaq-brown ring-1 ring-riwaq-beige">
                  سعة {t.capacity.toLocaleString("ar-SA")}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-riwaq-brown ring-1 ring-riwaq-beige">
                  مدة افتراضية {t.defaultBookingMinutes.toLocaleString("ar-SA")} د
                </span>
                {t.minOrderSar != null ? (
                  <span className="rounded-full bg-riwaq-green/10 px-3 py-1 text-riwaq-green ring-1 ring-riwaq-green/25">
                    حد أدنى {t.minOrderSar.toLocaleString("ar-SA")} ر.س
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-riwaq-muted ring-1 ring-slate-100">
                    بدون حد أدنى
                  </span>
                )}
                {t.rating != null ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-950 ring-1 ring-amber-100">
                    تقييم {t.rating.toLocaleString("ar-SA")}
                  </span>
                ) : null}
                {t.bookingCount != null ? (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-950 ring-1 ring-sky-100">
                    {t.bookingCount.toLocaleString("ar-SA")} حجز
                  </span>
                ) : null}
              </div>

              <div>
                <p className="text-[11px] font-extrabold text-riwaq-muted">خدمات الطاولة</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.servicesAvailable.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige"
                    >
                      {TABLE_SERVICE_LABELS[s]}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[11px] font-bold text-riwaq-muted">
                  بارتيشن مدمج بالطاولة:{" "}
                  <span className="font-extrabold text-riwaq-brown">{t.hasBuiltInPartition ? "نعم" : "لا"}</span>
                </p>
              </div>

              <div className="rounded-2xl bg-riwaq-cream/50 p-3 ring-1 ring-riwaq-beige/80">
                <p className="flex items-center gap-2 text-[11px] font-extrabold text-riwaq-brown">
                  <Sparkles className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                  العروض والولاء
                </p>
                {t.offer && t.offer.active ? (
                  <div className="mt-2 space-y-1 text-xs font-bold text-riwaq-muted">
                    <p className="font-extrabold text-riwaq-brown">{OFFER_KIND_LABELS_AR[t.offer.kind]}</p>
                    <p>{t.offer.titleAr}</p>
                    <p className="text-[11px]">المدة: {t.offer.durationAr}</p>
                    <p className="text-[11px] leading-relaxed">الشروط: {t.offer.termsAr}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-bold text-riwaq-muted">لا يوجد عرض نشط على هذه الطاولة.</p>
                )}
                <div className="mt-3 space-y-1 border-t border-riwaq-beige/80 pt-3 text-[11px] font-bold text-riwaq-muted">
                  <p>
                    نقاط أساسية للحجز:{" "}
                    <span className="font-extrabold text-riwaq-brown">
                      {t.loyalty.baseBooking.toLocaleString("ar-SA")}
                    </span>
                  </p>
                  <p>
                    + {t.loyalty.documentationBonus.toLocaleString("ar-SA")} عند توثيق التجربة
                  </p>
                  <p>+ {t.loyalty.publishBonus.toLocaleString("ar-SA")} عند نشر المنشور المعتمد</p>
                  <p>
                    + {t.loyalty.viewsBonus.toLocaleString("ar-SA")} إذا تجاوز المنشور{" "}
                    {t.loyalty.viewsThreshold.toLocaleString("ar-SA")} مشاهدة
                  </p>
                </div>
              </div>

              {t.nextAvailableISO ? (
                <p className="text-[11px] font-bold text-riwaq-muted">
                  أول فراغ تقريبي:{" "}
                  <span className="font-extrabold tabular-nums text-riwaq-brown">
                    {new Date(t.nextAvailableISO).toLocaleString("ar-SA", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-2 border-t border-riwaq-beige/80 pt-4">
                <button
                  type="button"
                  onClick={() => setViewId(t.id)}
                  className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige hover:bg-riwaq-beige/40"
                >
                  <Eye className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                  مشاهدة الإطلالة
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-riwaq-brown/10 px-3 py-2 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-brown/15"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                  تعديل
                </button>
                <button
                  type="button"
                  onClick={() => toggleBookingPause(t.id)}
                  className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-800 hover:bg-red-100"
                >
                  <Ban className="h-4 w-4" aria-hidden />
                  {t.bookingPaused ? "تفعيل الحجز" : "إيقاف الحجز"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={viewId !== null && viewTable !== null}
        title="معاينة إطلالة الطاولة (وهمية)"
        panelClassName="relative z-10 max-h-[92vh] w-full max-w-lg overflow-hidden rounded-3xl border border-white/90 bg-white shadow-2xl shadow-riwaq-brown/20"
        onClose={() => setViewId(null)}
      >
        {viewTable ? (
          <div className="space-y-4">
            <div className={`relative aspect-video overflow-hidden rounded-2xl ring-1 ring-riwaq-beige ${viewTable.videoPlaceholderClass}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-16 w-16 text-riwaq-brown/20" aria-hidden />
              </div>
              <p className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown shadow">
                معاينة فيديو — لا يوجد بث حقيقي
              </p>
            </div>
            <p className="text-sm font-bold text-riwaq-muted">
              طاولة{" "}
              <span className="font-extrabold text-riwaq-brown">{viewTable.label}</span> ·{" "}
              {viewTable.displayName}
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={formOpen && editing !== null}
        title={editing?.id.startsWith("t-new") ? "إضافة طاولة" : "تعديل طاولة"}
        panelClassName="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/90 bg-white shadow-2xl shadow-riwaq-brown/20"
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setFormOpen(false);
                setEditing(null);
              }}
              className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={saveForm}
              className="rounded-2xl bg-riwaq-brown px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              حفظ محليًا
            </button>
          </>
        }
      >
        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2 block">
              <span className="text-xs font-extrabold text-riwaq-muted">اسم أو رقم الطاولة (الظاهر للضيف)</span>
              <input
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="sm:col-span-2 block">
              <span className="text-xs font-extrabold text-riwaq-muted">اسم داخلي للطاولة</span>
              <input
                value={editing.displayName}
                onChange={(e) => setEditing({ ...editing, displayName: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">نوع الطاولة</span>
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as TableCategory })}
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
              >
                {CAT_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {TABLE_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">حالة الطاولة</span>
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as TableOperationalStatus })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
              >
                {OPS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {TABLE_OPS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">السعة</span>
              <input
                type="number"
                min={1}
                value={editing.capacity}
                onChange={(e) =>
                  setEditing({ ...editing, capacity: Math.max(1, Number(e.target.value) || 1) })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">مدة الحجز الافتراضية (دقيقة)</span>
              <input
                type="number"
                min={15}
                step={5}
                value={editing.defaultBookingMinutes}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    defaultBookingMinutes: Math.max(15, Number(e.target.value) || 60),
                  })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">الحد الأدنى للطلب (ر.س) — اختياري</span>
              <input
                type="number"
                min={0}
                value={editing.minOrderSar ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    minOrderSar: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                placeholder="—"
              />
            </label>

            <div className="sm:col-span-2 rounded-2xl border border-dashed border-riwaq-beige bg-riwaq-cream/40 p-4">
              <p className="text-xs font-extrabold text-riwaq-brown">رفع صورة الطاولة (واجهة وهمية)</p>
              <button
                type="button"
                onClick={() => setFakeImgOk(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige hover:bg-riwaq-beige/40"
              >
                <ImagePlus className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                اختيار ملف
              </button>
              {fakeImgOk ? (
                <p className="mt-2 text-[11px] font-bold text-riwaq-green">تم تسجيل اختيار ملف (عرضي فقط).</p>
              ) : null}
              <label className="mt-3 block text-xs font-extrabold text-riwaq-muted">
                نمط الصورة الوهمية
                <select
                  value={IMG_PRESETS.find((p) => p.cls === editing.imagePlaceholderClass)?.id ?? "warm"}
                  onChange={(e) => {
                    const p = IMG_PRESETS.find((x) => x.id === e.target.value);
                    if (p) setEditing({ ...editing, imagePlaceholderClass: p.cls });
                  }}
                  className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
                >
                  {IMG_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="sm:col-span-2 rounded-2xl border border-dashed border-riwaq-beige bg-riwaq-cream/40 p-4">
              <p className="text-xs font-extrabold text-riwaq-brown">فيديو الإطلالة (واجهة وهمية)</p>
              <button
                type="button"
                onClick={() => setFakeVidOk(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige hover:bg-riwaq-beige/40"
              >
                <Video className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                اختيار ملف فيديو
              </button>
              {fakeVidOk ? (
                <p className="mt-2 text-[11px] font-bold text-riwaq-green">تم تسجيل اختيار ملف (عرضي فقط).</p>
              ) : null}
              <label className="mt-3 block text-xs font-extrabold text-riwaq-muted">
                نمط الإطلالة الوهمية
                <select
                  value={VID_PRESETS.find((p) => p.cls === editing.videoPlaceholderClass)?.id ?? "sunset"}
                  onChange={(e) => {
                    const p = VID_PRESETS.find((x) => x.id === e.target.value);
                    if (p) setEditing({ ...editing, videoPlaceholderClass: p.cls });
                  }}
                  className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
                >
                  {VID_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="sm:col-span-2 block">
              <span className="text-xs font-extrabold text-riwaq-muted">وصف الطاولة</span>
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="mt-1 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>

            <fieldset className="sm:col-span-2 rounded-2xl border border-riwaq-beige bg-white/80 p-4">
              <legend className="px-1 text-xs font-extrabold text-riwaq-brown">الخدمات المتاحة</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_TABLE_SERVICE_IDS.map((sid) => {
                  const on = editing.servicesAvailable.includes(sid);
                  return (
                    <button
                      key={sid}
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          servicesAvailable: on
                            ? editing.servicesAvailable.filter((x) => x !== sid)
                            : [...editing.servicesAvailable, sid],
                        })
                      }
                      className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ring-1 transition ${
                        on
                          ? "bg-riwaq-brown text-white ring-riwaq-brown"
                          : "bg-white text-riwaq-muted ring-riwaq-beige hover:border-riwaq-caramel/40"
                      }`}
                    >
                      {TABLE_SERVICE_LABELS[sid]}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="flex items-center gap-3 rounded-2xl border border-riwaq-beige bg-white px-4 py-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={editing.hasBuiltInPartition}
                onChange={(e) => setEditing({ ...editing, hasBuiltInPartition: e.target.checked })}
                className="accent-riwaq-brown"
              />
              <span className="text-sm font-extrabold text-riwaq-brown">بارتيشن مدمج بالطاولة</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-riwaq-beige bg-white px-4 py-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={Boolean(editing.offer?.active)}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    offer: e.target.checked
                      ? editing.offer ?? { ...emptyOffer(), active: true }
                      : null,
                  })
                }
                className="accent-riwaq-brown"
              />
              <span className="text-sm font-extrabold text-riwaq-brown">تفعيل عرض على الطاولة</span>
            </label>

            {editing.offer?.active ? (
              <>
                <label className="block">
                  <span className="text-xs font-extrabold text-riwaq-muted">نوع العرض</span>
                  <select
                    value={editing.offer.kind}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        offer: {
                          ...editing.offer!,
                          kind: e.target.value as TableOfferKind,
                        },
                      })
                    }
                    className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
                  >
                    {OFFER_KINDS.map((k) => (
                      <option key={k} value={k}>
                        {OFFER_KIND_LABELS_AR[k]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-extrabold text-riwaq-muted">مدة العرض</span>
                  <input
                    value={editing.offer.durationAr}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        offer: { ...editing.offer!, durationAr: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                  />
                </label>
                <label className="sm:col-span-2 block">
                  <span className="text-xs font-extrabold text-riwaq-muted">تفاصيل العرض</span>
                  <input
                    value={editing.offer.titleAr}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        offer: { ...editing.offer!, titleAr: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                  />
                </label>
                <label className="sm:col-span-2 block">
                  <span className="text-xs font-extrabold text-riwaq-muted">شروط العرض</span>
                  <textarea
                    rows={2}
                    value={editing.offer.termsAr}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        offer: { ...editing.offer!, termsAr: e.target.value },
                      })
                    }
                    className="mt-1 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">نقاط الحجز الأساسية</span>
              <input
                type="number"
                min={0}
                value={editing.loyalty.baseBooking}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    loyalty: {
                      ...editing.loyalty,
                      baseBooking: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">نقاط التوثيق</span>
              <input
                type="number"
                min={0}
                value={editing.loyalty.documentationBonus}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    loyalty: {
                      ...editing.loyalty,
                      documentationBonus: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">نقاط النشر</span>
              <input
                type="number"
                min={0}
                value={editing.loyalty.publishBonus}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    loyalty: {
                      ...editing.loyalty,
                      publishBonus: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">عتبة المشاهدات</span>
              <input
                type="number"
                min={0}
                value={editing.loyalty.viewsThreshold}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    loyalty: {
                      ...editing.loyalty,
                      viewsThreshold: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold text-riwaq-muted">نقاط تجاوز العتبة</span>
              <input
                type="number"
                min={0}
                value={editing.loyalty.viewsBonus}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    loyalty: {
                      ...editing.loyalty,
                      viewsBonus: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
                className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-riwaq-beige bg-white px-4 py-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={editing.bookingPaused}
                onChange={(e) => setEditing({ ...editing, bookingPaused: e.target.checked })}
                className="accent-riwaq-brown"
              />
              <span className="text-sm font-extrabold text-riwaq-brown">إيقاف استقبال حجوزات جديدة على هذه الطاولة</span>
            </label>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
