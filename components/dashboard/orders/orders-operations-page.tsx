"use client";

import {
  AlertTriangle,
  Bell,
  CreditCard,
  LayoutGrid,
  LayoutList,
  Percent,
  Search,
  Table2,
  Timer,
  TrendingUp,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  OrderOperationsCard,
  type OrderCardHandlers,
} from "@/components/dashboard/orders/order-operations-card";
import { OrderDetailDrawer } from "@/components/dashboard/orders/order-detail-drawer";
import { Modal } from "@/components/dashboard/ui/modal";
import { formatSar } from "@/lib/format";
import {
  createOrdersOperationsSeed,
  isOrderLate,
  ORDER_REJECT_PRESETS,
  ORDER_STATUS_LABELS,
  orderHasActivePromo,
  TABLE_REJECT_PRESETS,
  type OpsOrder,
  type OrderWorkflowStatus,
  type PaymentMethod,
  type TimelineStepId,
} from "@/lib/mock/orders-operations";
import { playMockOrderChime } from "@/lib/play-order-chime";

export type OrdersTabId =
  | "all"
  | "new"
  | "pending_review"
  | "preparing"
  | "ready"
  | "tables"
  | "late"
  | "rejected";

function stampTimeline(order: OpsOrder, steps: TimelineStepId[]): OpsOrder {
  const now = new Date().toISOString();
  return {
    ...order,
    timeline: order.timeline.map((t) =>
      steps.includes(t.step) ? { ...t, atISO: t.atISO ?? now } : t,
    ),
  };
}

function buildQuickSimulatedOrder(id: string, now: Date): OpsOrder {
  const pickup = new Date(now.getTime() + 35 * 60_000).toISOString();
  return {
    id,
    customerName: "لمى الزهراني",
    customerPhone: "+966558887766",
    initials: "لز",
    createdAtISO: now.toISOString(),
    pickupRequestedISO: pickup,
    estimatedPrepMinutes: 14,
    orderStatus: "new",
    paymentMethod: "Apple Pay",
    paymentStatus: "مدفوع",
    subtotalBeforeDiscount: 42,
    discountTotal: 0,
    taxAmount: 6,
    total: 48,
    staffNotes: "",
    timeline: [
      { step: "created", labelAr: "تم إنشاء الطلب", atISO: now.toISOString() },
      { step: "reviewed", labelAr: "تمت المراجعة" },
      { step: "accepted", labelAr: "تم قبول الطلب" },
      { step: "preparing", labelAr: "بدأ التجهيز" },
      { step: "ready", labelAr: "جاهز للاستلام" },
      { step: "delivered", labelAr: "تم التسليم" },
    ],
    lines: [
      {
        id: `nl-${id}`,
        name: "كورتادو دبل",
        qty: 1,
        unitPrice: 18,
        calories: 120,
        ingredients: ["إسبريسو", "حليب قليل"],
        customerNotes: "حرارة متوسطة",
        imageVariant: "latte",
      },
      {
        id: `nl2-${id}`,
        name: "بسبوسة بالفستق",
        qty: 2,
        unitPrice: 12,
        calories: 260,
        ingredients: ["سميد", "فستق"],
        imageVariant: "cake",
      },
    ],
  };
}

export function OrdersPageClient() {
  const simSeq = useRef(9109);
  const [orders, setOrders] = useState<OpsOrder[]>(() =>
    createOrdersOperationsSeed(new Date()),
  );
  const [tick, setTick] = useState(() => Date.now());
  const [toast, setToast] = useState<string | null>(null);

  const [tab, setTab] = useState<OrdersTabId>("all");
  const [viewMode, setViewMode] = useState<"cards" | "kanban">("cards");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderWorkflowStatus | "all">("all");
  const [filterPayment, setFilterPayment] = useState<PaymentMethod | "all">("all");
  const [filterTable, setFilterTable] = useState<"all" | "yes" | "no">("all");
  const [filterLate, setFilterLate] = useState<"all" | "yes" | "no">("all");
  const [filterPromo, setFilterPromo] = useState<"all" | "yes" | "no">("all");

  const [drawerOrderId, setDrawerOrderId] = useState<string | null>(null);

  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectOrderPreset, setRejectOrderPreset] = useState<string>(ORDER_REJECT_PRESETS[0]);
  const [rejectOrderCustom, setRejectOrderCustom] = useState("");

  const [rejectTableId, setRejectTableId] = useState<string | null>(null);
  const [rejectTablePreset, setRejectTablePreset] = useState<string>(TABLE_REJECT_PRESETS[0]);
  const [rejectTableCustom, setRejectTableCustom] = useState("");
  const [rejectTableAltTime, setRejectTableAltTime] = useState("");

  const [cancelBothId, setCancelBothId] = useState<string | null>(null);
  const [cancelBothReason, setCancelBothReason] = useState("");

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 5000);
  }, []);

  const patchOrder = useCallback((id: string, fn: (o: OpsOrder) => OpsOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? fn(o) : o)));
  }, []);

  const drawerOrder = useMemo(
    () => orders.find((o) => o.id === drawerOrderId) ?? null,
    [orders, drawerOrderId],
  );

  const stats = useMemo(() => {
    const nNew = orders.filter((o) => o.orderStatus === "new").length;
    const nAccepted = orders.filter((o) => o.orderStatus === "accepted").length;
    const nPrep = orders.filter((o) => o.orderStatus === "preparing").length;
    const nReady = orders.filter((o) => o.orderStatus === "ready").length;
    const nTables = orders.filter((o) => o.tableBooking != null).length;

    const revenue = orders
      .filter(
        (o) =>
          !["rejected", "cancelled"].includes(o.orderStatus) &&
          o.paymentStatus === "مدفوع",
      )
      .reduce((s, o) => s + o.total, 0);

    const prepVals = orders
      .filter((o) => ["preparing", "ready", "delivered", "accepted"].includes(o.orderStatus))
      .map((o) => o.estimatedPrepMinutes);
    const avgPrep =
      prepVals.length === 0
        ? 0
        : Math.round(prepVals.reduce((a, b) => a + b, 0) / prepVals.length);

    return { nNew, nAccepted, nPrep, nReady, nTables, revenue, avgPrep };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim();
    const now = new Date(tick);

    return orders.filter((o) => {
      if (tab === "new" && o.orderStatus !== "new") return false;
      if (tab === "pending_review" && o.orderStatus !== "pending_review") return false;
      if (tab === "preparing" && o.orderStatus !== "preparing") return false;
      if (tab === "ready" && o.orderStatus !== "ready") return false;
      if (tab === "tables" && !o.tableBooking) return false;
      if (tab === "late" && !isOrderLate(o, now)) return false;
      if (
        tab === "rejected" &&
        o.orderStatus !== "rejected" &&
        o.orderStatus !== "cancelled"
      )
        return false;

      if (filterStatus !== "all" && o.orderStatus !== filterStatus) return false;
      if (filterPayment !== "all" && o.paymentMethod !== filterPayment) return false;

      if (filterTable === "yes" && !o.tableBooking) return false;
      if (filterTable === "no" && o.tableBooking) return false;

      if (filterLate === "yes" && !isOrderLate(o, now)) return false;
      if (filterLate === "no" && isOrderLate(o, now)) return false;

      if (filterPromo === "yes" && !orderHasActivePromo(o)) return false;
      if (filterPromo === "no" && orderHasActivePromo(o)) return false;

      if (q && !o.id.includes(q) && !o.customerName.includes(q)) return false;

      return true;
    });
  }, [
    orders,
    tab,
    search,
    filterStatus,
    filterPayment,
    filterTable,
    filterLate,
    filterPromo,
    tick,
  ]);

  const kanbanBuckets = useMemo(() => {
    const cur = filtered;
    return {
      new: cur.filter((o) => o.orderStatus === "new"),
      review: cur.filter((o) => o.orderStatus === "pending_review"),
      prep: cur.filter((o) => o.orderStatus === "preparing"),
      ready: cur.filter((o) => o.orderStatus === "ready"),
    };
  }, [filtered]);

  function simulateIncomingOrder() {
    const id = `ORD-${simSeq.current++}`;
    const now = new Date();
    const neo = buildQuickSimulatedOrder(id, now);
    setOrders((prev) => [neo, ...prev]);
    playMockOrderChime();
    showToast(`طلب جديد في المركز: ${id}`);
  }

  const handlers: OrderCardHandlers = useMemo(
    () => ({
      onOpenDrawer: setDrawerOrderId,
      onAcceptOrder: (id) =>
        patchOrder(id, (o) =>
          stampTimeline(
            { ...o, orderStatus: "accepted" },
            ["reviewed", "accepted"],
          ),
        ),
      onRejectOrder: (id) => {
        setRejectOrderPreset(ORDER_REJECT_PRESETS[0]);
        setRejectOrderCustom("");
        setRejectOrderId(id);
      },
      onStartPreparing: (id) =>
        patchOrder(id, (o) =>
          stampTimeline({ ...o, orderStatus: "preparing" }, ["preparing"]),
        ),
      onMarkReady: (id) =>
        patchOrder(id, (o) => stampTimeline({ ...o, orderStatus: "ready" }, ["ready"])),
      onMarkDelivered: (id) =>
        patchOrder(id, (o) =>
          stampTimeline({ ...o, orderStatus: "delivered" }, ["delivered"]),
        ),
      onContactCustomer: (id) => {
        showToast(`قناة تواصل وهمية مع الطلب ${id} — جاهزة للربط بـ SMS/WhatsApp`);
      },
      onAcceptOrderOnly: (id) =>
        patchOrder(id, (o) =>
          stampTimeline({ ...o, orderStatus: "accepted" }, ["reviewed", "accepted"]),
        ),
      onAcceptTableOnly: (id) =>
        patchOrder(id, (o) => {
          if (!o.tableBooking) return o;
          return {
            ...o,
            orderStatus: o.orderStatus === "new" ? "pending_review" : o.orderStatus,
            tableBooking: { ...o.tableBooking, status: "accepted" },
          };
        }),
      onAcceptBoth: (id) =>
        patchOrder(id, (o) => {
          const tb = o.tableBooking
            ? { ...o.tableBooking, status: "accepted" as const }
            : o.tableBooking;
          return stampTimeline(
            { ...o, orderStatus: "accepted", tableBooking: tb },
            ["reviewed", "accepted"],
          );
        }),
      onRejectTableOnly: (id) => {
        setRejectTablePreset(TABLE_REJECT_PRESETS[0]);
        setRejectTableCustom("");
        setRejectTableAltTime("");
        setRejectTableId(id);
      },
      onRejectOrderOnlyTableFlow: (id) => {
        setRejectOrderPreset(ORDER_REJECT_PRESETS[0]);
        setRejectOrderCustom("");
        setRejectOrderId(id);
      },
      onCancelBoth: (id) => {
        setCancelBothReason("");
        setCancelBothId(id);
      },
    }),
    [patchOrder, showToast],
  );

  function confirmRejectOrder() {
    if (!rejectOrderId) return;
    const reason =
      rejectOrderPreset === "سبب آخر"
        ? rejectOrderCustom.trim() || "سبب غير محدد"
        : rejectOrderPreset;
    patchOrder(rejectOrderId, (o) => ({
      ...o,
      orderStatus: "rejected",
      rejectReasonOrder: reason,
    }));
    setRejectOrderId(null);
    showToast("تم رفض الطلب وتسجيل السبب محليًا.");
  }

  function confirmRejectTable() {
    if (!rejectTableId) return;
    const reason =
      rejectTablePreset === "سبب آخر"
        ? rejectTableCustom.trim() || "سبب غير محدد"
        : rejectTablePreset;
    patchOrder(rejectTableId, (o) => {
      if (!o.tableBooking) return o;
      return {
        ...o,
        tableBooking: {
          ...o.tableBooking,
          status: "rejected",
          rejectReason: reason,
          suggestedAlternativeTime:
            rejectTableAltTime.trim() || undefined,
        },
      };
    });
    setRejectTableId(null);
    showToast("تم رفض الطاولة وتسجيل السبب.");
  }

  function confirmCancelBoth() {
    if (!cancelBothId) return;
    const reason = cancelBothReason.trim() || "إلغاء إداري";
    patchOrder(cancelBothId, (o) => ({
      ...o,
      orderStatus: "cancelled",
      cancelBothReason: reason,
      tableBooking: o.tableBooking
        ? {
            ...o.tableBooking,
            status: "rejected",
            rejectReason: reason,
          }
        : o.tableBooking,
    }));
    setCancelBothId(null);
    showToast("تم إلغاء الطلب والطاولة ضمن الواجهة الوهمية.");
  }

  function updateStaffNotes(orderId: string, notes: string) {
    patchOrder(orderId, (o) => ({ ...o, staffNotes: notes }));
  }

  const tabs: { id: OrdersTabId; label: string }[] = [
    { id: "all", label: "كل الطلبات" },
    { id: "new", label: "طلبات جديدة" },
    { id: "pending_review", label: "قيد المراجعة" },
    { id: "preparing", label: "قيد التجهيز" },
    { id: "ready", label: "جاهزة للاستلام" },
    { id: "tables", label: "مرتبطة بطاولات" },
    { id: "late", label: "متأخرة" },
    { id: "rejected", label: "مرفوضة / ملغاة" },
  ];

  const statTiles = [
    {
      label: "طلبات جديدة",
      value: stats.nNew.toLocaleString("ar-SA"),
      icon: Bell,
      ring: "ring-riwaq-caramel/25",
      bg: "bg-riwaq-caramel/12 text-riwaq-caramel",
    },
    {
      label: "طلبات مقبولة",
      value: stats.nAccepted.toLocaleString("ar-SA"),
      icon: TrendingUp,
      ring: "ring-riwaq-brown/15",
      bg: "bg-riwaq-brown/10 text-riwaq-brown",
    },
    {
      label: "قيد التجهيز",
      value: stats.nPrep.toLocaleString("ar-SA"),
      icon: Timer,
      ring: "ring-sky-200",
      bg: "bg-sky-100 text-sky-900",
    },
    {
      label: "جاهزة للاستلام",
      value: stats.nReady.toLocaleString("ar-SA"),
      icon: LayoutGrid,
      ring: "ring-riwaq-green/25",
      bg: "bg-riwaq-green/12 text-riwaq-green",
    },
    {
      label: "مرتبطة بطاولات",
      value: stats.nTables.toLocaleString("ar-SA"),
      icon: Table2,
      ring: "ring-riwaq-green/20",
      bg: "bg-emerald-50 text-emerald-900",
    },
    {
      label: "مبيعات اليوم (مدفوع)",
      value: formatSar(stats.revenue),
      icon: CreditCard,
      ring: "ring-riwaq-caramel/20",
      bg: "bg-riwaq-caramel/12 text-riwaq-brown",
    },
    {
      label: "متوسط وقت التجهيز",
      value:
        stats.avgPrep === 0 ? "—" : `${stats.avgPrep.toLocaleString("ar-SA")} د`,
      icon: Timer,
      ring: "ring-riwaq-muted/20",
      bg: "bg-riwaq-beige text-riwaq-brown",
    },
  ];

  return (
    <div className="relative space-y-8 px-4 py-6 lg:px-8 lg:py-8">
      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[55] flex justify-center px-4">
          <div className="pointer-events-auto flex max-w-lg items-center gap-3 rounded-3xl border border-riwaq-beige bg-white px-5 py-3 shadow-xl shadow-riwaq-brown/20">
            <Bell className="h-5 w-5 shrink-0 text-riwaq-caramel" aria-hidden />
            <span className="text-sm font-extrabold text-riwaq-brown">{toast}</span>
          </div>
        </div>
      ) : null}

      {stats.nNew > 0 ? (
        <div className="flex flex-col gap-4 rounded-3xl border border-red-200 bg-gradient-to-l from-red-50 via-white to-riwaq-cream/60 px-5 py-4 shadow-lg shadow-red-900/5 ring-1 ring-red-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-8 w-8 shrink-0 text-red-600" aria-hidden />
            <div>
              <p className="font-extrabold text-lg text-riwaq-brown">تنبيه مركز العمليات</p>
              <p className="mt-1 text-sm font-bold text-riwaq-muted">
                يوجد {stats.nNew.toLocaleString("ar-SA")} طلب جديد يحتاج الخطوة التالية فورًا.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => playMockOrderChime()}
              className="inline-flex items-center gap-2 rounded-3xl border border-riwaq-beige bg-white px-5 py-2.5 text-sm font-extrabold text-riwaq-brown shadow-sm hover:border-riwaq-caramel/40"
            >
              <Volume2 className="h-5 w-5 text-riwaq-caramel" aria-hidden />
              تجربة صوت التنبيه
            </button>
            <button
              type="button"
              onClick={simulateIncomingOrder}
              className="inline-flex items-center gap-2 rounded-3xl bg-riwaq-brown px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              محاكاة طلب جديد
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-riwaq-beige bg-white/70 px-5 py-4 shadow-md backdrop-blur-sm">
          <p className="text-sm font-bold text-riwaq-muted">لا توجد طلبات جديدة حاليًا في هذه اللحظة.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => playMockOrderChime()}
              className="inline-flex items-center gap-2 rounded-3xl border border-riwaq-beige bg-white px-4 py-2 text-xs font-extrabold text-riwaq-brown hover:border-riwaq-caramel/40"
            >
              <Volume2 className="h-4 w-4 text-riwaq-caramel" aria-hidden />
              تجربة الصوت
            </button>
            <button
              type="button"
              onClick={simulateIncomingOrder}
              className="inline-flex items-center gap-2 rounded-3xl bg-riwaq-brown px-4 py-2 text-xs font-extrabold text-white hover:brightness-105"
            >
              محاكاة طلب
            </button>
          </div>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7" aria-label="لوحة سريعة">
        {statTiles.map(({ label, value, icon: Icon, ring, bg }) => (
          <article
            key={label}
            className={`rounded-3xl border border-white/85 bg-white/75 p-4 shadow-lg shadow-riwaq-brown/6 backdrop-blur-md ring-1 ${ring}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold leading-snug text-riwaq-muted">{label}</p>
                <p className="mt-2 text-xl font-extrabold tabular-nums text-riwaq-brown">{value}</p>
              </div>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
            </div>
          </article>
        ))}
      </section>

      <div className="rounded-3xl border border-white/85 bg-white/65 p-4 shadow-lg backdrop-blur-md lg:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-end xl:justify-between">
          <label className="block min-w-[220px] flex-1">
            <span className="text-[11px] font-extrabold text-riwaq-muted">بحث برقم الطلب أو اسم العميل</span>
            <span className="relative mt-1 flex">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-riwaq-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-riwaq-beige bg-white py-3 pr-10 pl-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="حالة الطلب"
              value={filterStatus}
              onChange={(v) => setFilterStatus(v as typeof filterStatus)}
              options={[
                { value: "all", label: "كل الحالات" },
                ...(
                  Object.keys(ORDER_STATUS_LABELS) as OrderWorkflowStatus[]
                ).map((k) => ({
                  value: k,
                  label: ORDER_STATUS_LABELS[k],
                })),
              ]}
            />
            <FilterSelect
              label="طريقة الدفع"
              value={filterPayment}
              onChange={(v) => setFilterPayment(v as typeof filterPayment)}
              options={[
                { value: "all", label: "الكل" },
                { value: "نقدي", label: "نقدي" },
                { value: "بطاقة", label: "بطاقة" },
                { value: "Apple Pay", label: "Apple Pay" },
                { value: "مدى", label: "مدى" },
              ]}
            />
            <FilterSelect
              label="طاولة"
              value={filterTable}
              onChange={(v) => setFilterTable(v as typeof filterTable)}
              options={[
                { value: "all", label: "الكل" },
                { value: "yes", label: "مرتبط بطاولة" },
                { value: "no", label: "بدون طاولة" },
              ]}
            />
            <FilterSelect
              label="التأخير"
              value={filterLate}
              onChange={(v) => setFilterLate(v as typeof filterLate)}
              options={[
                { value: "all", label: "الكل" },
                { value: "yes", label: "متأخرة" },
                { value: "no", label: "في الموعد" },
              ]}
            />
            <FilterSelect
              label="عروض وخصومات"
              value={filterPromo}
              onChange={(v) => setFilterPromo(v as typeof filterPromo)}
              options={[
                { value: "all", label: "الكل" },
                { value: "yes", label: "فيها عرض أو خصم" },
                { value: "no", label: "بدون عروض" },
              ]}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-riwaq-beige/80 pt-5">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-3xl px-4 py-2 text-xs font-extrabold transition ${
                  tab === t.id
                    ? "bg-riwaq-brown text-white shadow-md shadow-riwaq-brown/25"
                    : "border border-riwaq-beige bg-white text-riwaq-brown hover:border-riwaq-caramel/35"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 p-1">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-extrabold ${
                viewMode === "cards"
                  ? "bg-white text-riwaq-brown shadow-sm"
                  : "text-riwaq-muted"
              }`}
            >
              <LayoutList className="h-4 w-4" aria-hidden />
              بطاقات
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-extrabold ${
                viewMode === "kanban"
                  ? "bg-white text-riwaq-brown shadow-sm"
                  : "text-riwaq-muted"
              }`}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
              كانبان خفيف
            </button>
          </div>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="كانبان الطلبات">
          <KanbanColumn title="جديد" orders={kanbanBuckets.new} onPick={setDrawerOrderId} />
          <KanbanColumn title="قيد المراجعة" orders={kanbanBuckets.review} onPick={setDrawerOrderId} />
          <KanbanColumn title="قيد التجهيز" orders={kanbanBuckets.prep} onPick={setDrawerOrderId} />
          <KanbanColumn title="جاهز" orders={kanbanBuckets.ready} onPick={setDrawerOrderId} />
        </section>
      ) : null}

      {viewMode === "cards" ? (
        filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-riwaq-beige bg-white/50 px-8 py-16 text-center">
            <Percent className="mx-auto h-10 w-10 text-riwaq-muted opacity-50" aria-hidden />
            <p className="mt-4 font-extrabold text-lg text-riwaq-brown">لا توجد طلبات مطابقة</p>
            <p className="mt-2 text-sm font-bold text-riwaq-muted">عدّل التبويب أو الفلاتر أو البحث.</p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-2">
            {filtered.map((o) => (
              <OrderOperationsCard key={o.id} order={o} tick={tick} handlers={handlers} />
            ))}
          </div>
        )
      ) : null}

      <OrderDetailDrawer
        order={drawerOrder}
        open={drawerOrderId !== null}
        onClose={() => setDrawerOrderId(null)}
        onStaffNotesChange={updateStaffNotes}
      />

      <Modal
        open={rejectOrderId !== null}
        title="سبب رفض الطلب"
        onClose={() => setRejectOrderId(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setRejectOrderId(null)}
              className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmRejectOrder}
              className="rounded-2xl bg-red-700 px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              تأكيد الرفض
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {ORDER_REJECT_PRESETS.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-extrabold ${
                rejectOrderPreset === r
                  ? "border-riwaq-caramel bg-riwaq-caramel/10 text-riwaq-brown"
                  : "border-riwaq-beige bg-white text-riwaq-muted"
              }`}
            >
              <input
                type="radio"
                name="ro"
                checked={rejectOrderPreset === r}
                onChange={() => setRejectOrderPreset(r)}
                className="accent-riwaq-brown"
              />
              {r}
            </label>
          ))}
          <label className="block">
            <span className="text-xs font-extrabold text-riwaq-muted">سبب مخصص (اختياري إذا «سبب آخر»)</span>
            <textarea
              value={rejectOrderCustom}
              onChange={(e) => setRejectOrderCustom(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={rejectTableId !== null}
        title="رفض الطاولة — سبب واضح للضيف"
        onClose={() => setRejectTableId(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setRejectTableId(null)}
              className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmRejectTable}
              className="rounded-2xl bg-red-700 px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              تأكيد رفض الطاولة
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {TABLE_REJECT_PRESETS.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-extrabold ${
                rejectTablePreset === r
                  ? "border-riwaq-green bg-riwaq-green/10 text-riwaq-brown"
                  : "border-riwaq-beige bg-white text-riwaq-muted"
              }`}
            >
              <input
                type="radio"
                name="rt"
                checked={rejectTablePreset === r}
                onChange={() => setRejectTablePreset(r)}
                className="accent-riwaq-brown"
              />
              {r}
            </label>
          ))}
          <label className="block">
            <span className="text-xs font-extrabold text-riwaq-muted">سبب مخصص</span>
            <textarea
              value={rejectTableCustom}
              onChange={(e) => setRejectTableCustom(e.target.value)}
              rows={2}
              className="mt-1 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-extrabold text-riwaq-muted">اقتراح وقت بديل للضيف (اختياري)</span>
            <input
              value={rejectTableAltTime}
              onChange={(e) => setRejectTableAltTime(e.target.value)}
              placeholder="مثال: ٨:٣٠ م — الجمعة"
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={cancelBothId !== null}
        title="إلغاء الطلب والطاولة معًا"
        onClose={() => setCancelBothId(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setCancelBothId(null)}
              className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmCancelBoth}
              className="rounded-2xl bg-zinc-800 px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              تأكيد الإلغاء
            </button>
          </>
        }
      >
        <label className="block">
          <span className="text-xs font-extrabold text-riwaq-muted">سبب الإلغاء الموحّد</span>
          <textarea
            value={cancelBothReason}
            onChange={(e) => setCancelBothReason(e.target.value)}
            rows={4}
            className="mt-1 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
          />
        </label>
      </Modal>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block min-w-[150px]">
      <span className="text-[11px] font-extrabold text-riwaq-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-xs font-extrabold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function KanbanColumn({
  title,
  orders,
  onPick,
}: {
  title: string;
  orders: OpsOrder[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex max-h-[420px] flex-col rounded-3xl border border-white/85 bg-white/65 shadow-lg backdrop-blur-md">
      <div className="border-b border-riwaq-beige px-4 py-3">
        <p className="font-extrabold text-riwaq-brown">{title}</p>
        <p className="text-[11px] font-bold text-riwaq-muted">{orders.length.toLocaleString("ar-SA")} طلب</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {orders.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o.id)}
            className="rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-right text-xs font-extrabold text-riwaq-brown shadow-sm transition hover:border-riwaq-caramel/40 hover:shadow-md"
          >
            <span className="tabular-nums text-riwaq-muted">{o.id}</span>
            <span className="mr-2 block truncate">{o.customerName}</span>
          </button>
        ))}
        {orders.length === 0 ? (
          <p className="py-6 text-center text-[11px] font-bold text-riwaq-muted">فارغ</p>
        ) : null}
      </div>
    </div>
  );
}
