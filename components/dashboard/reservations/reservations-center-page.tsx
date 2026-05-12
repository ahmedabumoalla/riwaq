"use client";

import {
  AlertTriangle,
  Armchair,
  BarChart3,
  CalendarClock,
  Crown,
  LayoutGrid,
  Star,
  Table2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReservationCard,
  type ReservationCardHandlers,
} from "@/components/dashboard/reservations/reservation-card";
import { ReservationDrawer } from "@/components/dashboard/reservations/reservation-drawer";
import { TableManagementSection } from "@/components/dashboard/reservations/table-management-section";
import { TableFloorModal } from "@/components/dashboard/reservations/table-floor-modal";
import { Modal } from "@/components/dashboard/ui/modal";
import { ReservationQr } from "@/components/dashboard/ui/reservation-qr";
import {
  buildInsights,
  REJECT_REASONS,
  RESERVATION_STATUS_LABELS,
  seedReservations,
  seedManagedTables,
  TABLE_CATEGORY_LABELS,
  type CafeTable,
  type LinkedDecision,
  type ManagedTable,
  type ReservationRecord,
  type ReservationStatus,
  type TableCategory,
  type TimelineStep,
} from "@/lib/mock/reservations-center";

function stampSteps(order: ReservationRecord, steps: TimelineStep[]): ReservationRecord {
  const now = new Date().toISOString();
  return {
    ...order,
    timeline: order.timeline.map((t) =>
      steps.includes(t.step) ? { ...t, atISO: t.atISO ?? now } : t,
    ),
  };
}

function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export type ReservationsTabId =
  | "all"
  | "new"
  | "confirmed"
  | "active_now"
  | "linked_orders"
  | "late"
  | "vip"
  | "ended"
  | "cancelled";

export function ReservationsPageClient({
  initialReservations,
  initialManagedTables,
}: {
  initialReservations?: ReservationRecord[];
  initialManagedTables?: ManagedTable[];
} = {}) {
  const [tick, setTick] = useState(() => Date.now());
  const [reservations, setReservations] = useState<ReservationRecord[]>(() =>
    initialReservations !== undefined ? initialReservations : seedReservations(new Date()),
  );
  const [tables, setTables] = useState<ManagedTable[]>(() =>
    initialManagedTables !== undefined ? initialManagedTables : seedManagedTables(new Date()),
  );

  const [tab, setTab] = useState<ReservationsTabId>("all");
  const [search, setSearch] = useState("");
  const [stFilter, setStFilter] = useState<ReservationStatus | "all">("all");
  const [catFilter, setCatFilter] = useState<TableCategory | "all">("all");
  const [vipFilter, setVipFilter] = useState<"all" | "yes" | "no">("all");
  const [linkedFilter, setLinkedFilter] = useState<"all" | "yes" | "no">("all");
  const [lateFilter, setLateFilter] = useState<"all" | "yes" | "no">("all");
  const [tableFilterLabel, setTableFilterLabel] = useState<string>("all");

  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [qrId, setQrId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectPreset, setRejectPreset] = useState<string>(REJECT_REASONS[0]);
  const [rejectCustom, setRejectCustom] = useState("");
  const [rejectAlt, setRejectAlt] = useState("");
  const [suggestId, setSuggestId] = useState<string | null>(null);
  const [suggestAltInput, setSuggestAltInput] = useState("");
  const [floorBrowseOpen, setFloorBrowseOpen] = useState(false);
  const [changeTableForId, setChangeTableForId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const patchRsv = useCallback((id: string, fn: (r: ReservationRecord) => ReservationRecord) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? fn(r) : r)));
  }, []);

  const nowDate = useMemo(() => new Date(tick), [tick]);

  const insights = useMemo(() => buildInsights(reservations), [reservations]);

  const stats = useMemo(() => {
    const today = reservations.filter((r) =>
      sameCalendarDay(new Date(r.startISO), nowDate),
    ).length;

    const activeNow = reservations.filter((r) =>
      ["session_active", "guest_arrived"].includes(r.status),
    ).length;

    const usableTables = tables.filter((t) => t.status !== "out_of_service");
    const occupied = usableTables.filter((t) =>
      ["reserved", "active_now", "cleaning", "busy"].includes(t.status),
    ).length;
    const occupancyPct =
      usableTables.length === 0
        ? 0
        : Math.round((occupied / usableTables.length) * 100);

    const availableTables = tables.filter((t) => t.status === "available").length;
    const reservedTables = tables.filter((t) => t.status === "reserved").length;

    const avgSession =
      reservations.filter((r) => r.status === "session_ended").length === 0
        ? 0
        : Math.round(
            reservations
              .filter((r) => r.status === "session_ended")
              .reduce((s, r) => s + r.sessionMinutes, 0) /
              reservations.filter((r) => r.status === "session_ended").length,
          );

    const hourAhead = tick + 60 * 60_000;
    const upcomingHour = reservations.filter((r) => {
      const t0 = new Date(r.startISO).getTime();
      return t0 >= tick && t0 <= hourAhead && !["cancelled", "rejected", "session_ended"].includes(r.status);
    }).length;

    const repeatGuests = new Set(
      reservations.filter((r) => r.priorVisits >= 8).map((r) => r.customerName),
    ).size;

    return {
      today,
      activeNow,
      occupancyPct,
      availableTables,
      reservedTables,
      avgSession,
      upcomingHour,
      repeatGuests,
    };
  }, [reservations, tables, tick, nowDate]);

  const lateGuestsAlerts = useMemo(() => {
    return reservations.filter(
      (r) =>
        (r.status === "late" || r.arrivalStatus === "late") &&
        !["session_ended", "cancelled", "rejected"].includes(r.status),
    );
  }, [reservations]);

  const upcomingStrip = useMemo(() => {
    return [...reservations]
      .filter(
        (r) =>
          new Date(r.startISO).getTime() >= tick &&
          !["cancelled", "rejected", "session_ended"].includes(r.status),
      )
      .sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime())
      .slice(0, 8);
  }, [reservations, tick]);

  const filtered = useMemo(() => {
    const q = search.trim();

    return reservations.filter((r) => {
      if (tab === "new" && r.status !== "new") return false;
      if (tab === "confirmed" && !["confirmed", "awaiting_guest"].includes(r.status))
        return false;
      if (
        tab === "active_now" &&
        !["session_active", "guest_arrived"].includes(r.status)
      )
        return false;
      if (tab === "linked_orders" && !r.linkedOrder) return false;
      if (
        tab === "late" &&
        !(r.status === "late" || r.arrivalStatus === "late")
      )
        return false;
      if (tab === "vip" && !r.isVip) return false;
      if (tab === "ended" && r.status !== "session_ended") return false;
      if (
        tab === "cancelled" &&
        !(r.status === "cancelled" || r.status === "rejected")
      )
        return false;

      if (stFilter !== "all" && r.status !== stFilter) return false;
      if (catFilter !== "all" && r.tableCategory !== catFilter) return false;
      if (vipFilter === "yes" && !r.isVip) return false;
      if (vipFilter === "no" && r.isVip) return false;
      if (linkedFilter === "yes" && !r.linkedOrder) return false;
      if (linkedFilter === "no" && r.linkedOrder) return false;

      const lateNow =
        r.arrivalStatus === "late" ||
        r.status === "late" ||
        (new Date(r.startISO).getTime() < tick &&
          !["session_ended", "cancelled", "rejected", "session_active"].includes(r.status));
      if (lateFilter === "yes" && !lateNow) return false;
      if (lateFilter === "no" && lateNow) return false;

      if (tableFilterLabel !== "all" && r.tableLabel !== tableFilterLabel) return false;

      if (q && !r.id.includes(q) && !r.customerName.includes(q)) return false;

      return true;
    });
  }, [
    reservations,
    tab,
    search,
    stFilter,
    catFilter,
    vipFilter,
    linkedFilter,
    lateFilter,
    tableFilterLabel,
    tick,
  ]);

  const drawerReservation =
    reservations.find((r) => r.id === drawerId) ?? null;
  const qrReservation = reservations.find((r) => r.id === qrId) ?? null;

  const handlers: ReservationCardHandlers = useMemo(
    () => ({
      onOpenDrawer: setDrawerId,
      onOpenQr: setQrId,
      onAccept: (id) =>
        patchRsv(id, (r) =>
          stampSteps({ ...r, status: "confirmed", arrivalStatus: "not_arrived" }, [
            "reviewed",
            "confirmed",
          ]),
        ),
      onRejectOpen: (id) => {
        setRejectPreset(REJECT_REASONS[0]);
        setRejectCustom("");
        setRejectAlt("");
        setRejectId(id);
      },
      onSuggestOpen: (id) => {
        setSuggestAltInput("");
        setSuggestId(id);
      },
      onChangeTableOpen: (id) => setChangeTableForId(id),
      onStartSession: (id) =>
        patchRsv(id, (r) =>
          stampSteps(
            {
              ...r,
              status: "session_active",
              arrivalStatus: "arrived",
            },
            ["arrived", "session_started"],
          ),
        ),
      onEndSession: (id) =>
        patchRsv(id, (r) =>
          stampSteps({ ...r, status: "session_ended" }, ["session_ended"]),
        ),
      onLinkedAcceptRsvOnly: (id) =>
        patchRsv(id, (r) => ({
          ...r,
          linkedDecision: "accepted_rsv_only" as LinkedDecision,
        })),
      onLinkedAcceptOrderOnly: (id) =>
        patchRsv(id, (r) => ({
          ...r,
          linkedDecision: "accepted_order_only" as LinkedDecision,
        })),
      onLinkedAcceptBoth: (id) =>
        patchRsv(id, (r) => ({
          ...r,
          linkedDecision: "accepted_both" as LinkedDecision,
        })),
      onLinkedRejectOrder: (id) =>
        patchRsv(id, (r) => ({
          ...r,
          linkedDecision: "rejected_order" as LinkedDecision,
        })),
      onLinkedRejectRsv: (id) =>
        patchRsv(id, (r) => ({
          ...r,
          status: "rejected",
          linkedDecision: "rejected_rsv" as LinkedDecision,
        })),
      onLinkedCancelBoth: (id) =>
        patchRsv(id, (r) => ({
          ...r,
          status: "cancelled",
          linkedDecision: "cancelled_both" as LinkedDecision,
          rejectReason: "إلغاء موحّد من الواجهة الوهمية",
        })),
    }),
    [patchRsv],
  );

  function confirmRejectReservation() {
    if (!rejectId) return;
    const reason =
      rejectPreset === "سبب آخر"
        ? rejectCustom.trim() || "بدون تفاصيل"
        : rejectPreset;
    patchRsv(rejectId, (r) => ({
      ...r,
      status: "rejected",
      rejectReason: reason,
      suggestedAlternative: rejectAlt.trim() || undefined,
    }));
    setRejectId(null);
  }

  function confirmSuggestAlt() {
    if (!suggestId) return;
    patchRsv(suggestId, (r) => ({
      ...r,
      status: "pending_review",
      suggestedAlternative: suggestAltInput.trim() || undefined,
    }));
    setSuggestId(null);
  }

  function applyTableChange(table: CafeTable) {
    if (!changeTableForId) return;
    patchRsv(changeTableForId, (r) => ({
      ...r,
      tableId: table.id,
      tableLabel: table.label,
      tableCategory: table.category,
    }));
    setChangeTableForId(null);
    setFloorBrowseOpen(false);
  }

  const selectableTablesForChange = useMemo(() => {
    return tables
      .filter(
        (t) =>
          !t.bookingPaused && (t.status === "available" || t.status === "cleaning"),
      )
      .map((t) => t.id);
  }, [tables]);

  const tabs: { id: ReservationsTabId; label: string }[] = [
    { id: "all", label: "كل الحجوزات" },
    { id: "new", label: "جديدة" },
    { id: "confirmed", label: "مؤكدة" },
    { id: "active_now", label: "نشطة الآن" },
    { id: "linked_orders", label: "مرتبطة بطلبات" },
    { id: "late", label: "متأخرة" },
    { id: "vip", label: "VIP" },
    { id: "ended", label: "منتهية" },
    { id: "cancelled", label: "ملغية / مرفوضة" },
  ];

  const uniqueTableLabels = useMemo(() => {
    const s = new Set(reservations.map((r) => r.tableLabel));
    return ["all", ...Array.from(s)];
  }, [reservations]);

  return (
    <div className="space-y-8 px-4 py-6 lg:px-8 lg:py-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        <StatMini label="حجوزات اليوم" value={stats.today.toLocaleString("ar-SA")} icon={CalendarClock} tone="brown" />
        <StatMini label="نشطة الآن" value={stats.activeNow.toLocaleString("ar-SA")} icon={Users} tone="green" />
        <StatMini label="طاولات متاحة" value={stats.availableTables.toLocaleString("ar-SA")} icon={LayoutGrid} tone="emerald" />
        <StatMini label="طاولات محجوزة" value={stats.reservedTables.toLocaleString("ar-SA")} icon={Table2} tone="caramel" />
        <StatMini label="نسبة الإشغال" value={`${stats.occupancyPct}%`} icon={BarChart3} tone="brown" />
        <StatMini
          label="متوسط مدة الجلسة"
          value={stats.avgSession === 0 ? "—" : `${stats.avgSession} د`}
          icon={TrendingUp}
          tone="green"
        />
        <StatMini label="خلال ساعة" value={stats.upcomingHour.toLocaleString("ar-SA")} icon={CalendarClock} tone="sky" />
        <StatMini label="عملاء متكررون" value={stats.repeatGuests.toLocaleString("ar-SA")} icon={Star} tone="caramel" />
      </section>

      <div className="rounded-3xl border border-white/85 bg-white/65 p-4 shadow-lg backdrop-blur-md lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold text-riwaq-muted">مؤشر الإشغال — تجربة SaaS</p>
            <p className="mt-1 font-extrabold text-xl text-riwaq-brown">قطعة واحدة للنظر السريع</p>
          </div>
          <div className="flex flex-1 max-w-xl flex-col gap-2">
            <div className="h-4 overflow-hidden rounded-full bg-riwaq-beige ring-1 ring-white">
              <div
                className="h-full rounded-full bg-gradient-to-l from-riwaq-brown to-riwaq-caramel transition-[width] duration-500"
                style={{ width: `${stats.occupancyPct}%` }}
              />
            </div>
            <p className="text-xs font-bold text-riwaq-muted">
              تشمل المحجوزة والنشطة والتنظيف ضمن الطاولات العاملة.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFloorBrowseOpen(true)}
            className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-l from-riwaq-brown to-[#2d1a10] px-6 py-3 text-sm font-extrabold text-white shadow-lg hover:brightness-105"
          >
            <Armchair className="h-5 w-5" aria-hidden />
            مخطط الأرضية
          </button>
        </div>
      </div>

      {(lateGuestsAlerts.length > 0 || stats.upcomingHour > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {lateGuestsAlerts.length > 0 ? (
            <div className="rounded-3xl border border-red-200 bg-red-50/70 px-5 py-4 shadow-inner ring-1 ring-red-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-7 w-7 shrink-0 text-red-600" aria-hidden />
                <div>
                  <p className="font-extrabold text-red-900">تأخر عن الموعد</p>
                  <ul className="mt-2 space-y-2 text-sm font-bold text-red-900">
                    {lateGuestsAlerts.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => setDrawerId(r.id)}
                          className="text-right underline-offset-4 hover:underline"
                        >
                          {r.customerName} — {r.id} · طاولة {r.tableLabel}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
          <div className="rounded-3xl border border-riwaq-green/25 bg-riwaq-green/8 px-5 py-4 ring-1 ring-riwaq-green/15">
            <p className="font-extrabold text-riwaq-brown">حجوزات قادمة</p>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">
              {stats.upcomingHour.toLocaleString("ar-SA")} حجز ضمن الساعة القادمة (تقديري).
            </p>
          </div>
        </div>
      )}

      <section aria-label="جدول زمني للحجوزات القادمة">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-extrabold text-lg text-riwaq-brown">Upcoming timeline</h2>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-muted ring-1 ring-riwaq-beige">
            أقرب المواعيد
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {upcomingStrip.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setDrawerId(r.id)}
              className="min-w-[200px] shrink-0 rounded-3xl border border-white/85 bg-white/75 px-4 py-3 text-right shadow-md ring-1 ring-riwaq-beige transition hover:border-riwaq-caramel/35 hover:shadow-lg"
            >
              <p className="font-extrabold tabular-nums text-riwaq-brown">{r.id}</p>
              <p className="mt-1 truncate text-sm font-bold text-riwaq-muted">{r.customerName}</p>
              <p className="mt-2 text-xs font-extrabold tabular-nums text-riwaq-caramel">
                {new Date(r.startISO).toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.isVip ? (
                  <span className="rounded-full bg-riwaq-caramel/15 px-2 py-0.5 text-[10px] font-extrabold text-riwaq-caramel">
                    VIP
                  </span>
                ) : null}
                {r.linkedOrder ? (
                  <span className="rounded-full bg-riwaq-green/15 px-2 py-0.5 text-[10px] font-extrabold text-riwaq-green">
                    طلب
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="rounded-3xl border border-white/85 bg-white/60 p-4 shadow-lg backdrop-blur-md lg:p-5">
        <div className="flex flex-wrap gap-3 border-b border-riwaq-beige pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-3xl px-4 py-2 text-xs font-extrabold transition ${
                tab === t.id
                  ? "bg-riwaq-brown text-white shadow-md shadow-riwaq-brown/25"
                  : "border border-riwaq-beige bg-white text-riwaq-brown hover:border-riwaq-caramel/35"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-6">
          <FilterBlk label="بحث">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              placeholder="اسم أو رقم..."
            />
          </FilterBlk>
          <FilterBlk label="حالة الحجز">
            <select
              value={stFilter}
              onChange={(e) => setStFilter(e.target.value as typeof stFilter)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              {(Object.keys(RESERVATION_STATUS_LABELS) as ReservationStatus[]).map((k) => (
                <option key={k} value={k}>
                  {RESERVATION_STATUS_LABELS[k]}
                </option>
              ))}
            </select>
          </FilterBlk>
          <FilterBlk label="نوع الطاولة">
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as typeof catFilter)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              {(Object.keys(TABLE_CATEGORY_LABELS) as TableCategory[]).map((k) => (
                <option key={k} value={k}>
                  {TABLE_CATEGORY_LABELS[k]}
                </option>
              ))}
            </select>
          </FilterBlk>
          <FilterBlk label="VIP">
            <select
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value as typeof vipFilter)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              <option value="yes">VIP فقط</option>
              <option value="no">بدون VIP</option>
            </select>
          </FilterBlk>
          <FilterBlk label="طلب مرتبط">
            <select
              value={linkedFilter}
              onChange={(e) => setLinkedFilter(e.target.value as typeof linkedFilter)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </FilterBlk>
          <FilterBlk label="متأخرة">
            <select
              value={lateFilter}
              onChange={(e) => setLateFilter(e.target.value as typeof lateFilter)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              <option value="yes">متأخرة فقط</option>
              <option value="no">في الموعد</option>
            </select>
          </FilterBlk>
          <FilterBlk label="طاولة">
            <select
              value={tableFilterLabel}
              onChange={(e) => setTableFilterLabel(e.target.value)}
              className="w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              {uniqueTableLabels.map((lbl) => (
                <option key={lbl} value={lbl}>
                  {lbl === "all" ? "كل الطاولات" : `طاولة ${lbl}`}
                </option>
              ))}
            </select>
          </FilterBlk>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <InsightCard
          title="أكثر الطاولات حجزًا"
          rows={insights.topTables.map((x) => ({
            k: `طاولة ${x.label}`,
            v: `${x.count} حجز`,
          }))}
        />
        <InsightCard
          title="العملاء الأكثر زيارة"
          rows={insights.repeatGuests.map((x) => ({
            k: x.name,
            v: `${x.visits} زيارة`,
          }))}
        />
        <div className="rounded-3xl border border-white/85 bg-white/70 p-5 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/70">
          <p className="font-extrabold text-riwaq-brown">أوقات الذروة</p>
          <p className="mt-3 text-sm font-bold leading-relaxed text-riwaq-muted">{insights.peakHours}</p>
          <p className="mt-4 text-xs font-bold text-riwaq-muted">
            متوسط مدة الجلسات المعروضة حاليًا:{" "}
            <span className="font-extrabold text-riwaq-brown">
              {stats.avgSession === 0 ? "—" : `${stats.avgSession} دقيقة`}
            </span>
          </p>
        </div>
      </section>

      <TableManagementSection
        tables={tables}
        onTablesChange={setTables}
        onOpenFloorPlan={() => setFloorBrowseOpen(true)}
      />

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-riwaq-beige bg-white/50 px-8 py-16 text-center">
          <Crown className="mx-auto h-10 w-10 text-riwaq-muted opacity-40" aria-hidden />
          <p className="mt-4 font-extrabold text-lg text-riwaq-brown">لا توجد حجوزات ضمن العرض</p>
          <p className="mt-2 text-sm font-bold text-riwaq-muted">عدّل الفلاتر أو التبويب.</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {filtered.map((r) => (
            <ReservationCard key={r.id} r={r} tick={tick} handlers={handlers} />
          ))}
        </div>
      )}

      <ReservationDrawer
        open={drawerId !== null}
        reservation={drawerReservation}
        table={
          drawerReservation
            ? tables.find((t) => t.id === drawerReservation.tableId) ?? null
            : null
        }
        tick={tick}
        onClose={() => setDrawerId(null)}
      />

      <Modal
        open={qrId !== null && qrReservation !== null}
        title="رمز الدخول للحجز"
        panelClassName="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/90 bg-white shadow-2xl shadow-riwaq-brown/20"
        onClose={() => setQrId(null)}
      >
        {qrReservation ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <ReservationQr reservationId={qrReservation.id} size={220} />
            <div>
              <p className="font-extrabold text-lg text-riwaq-brown">{qrReservation.customerName}</p>
              <p className="mt-1 text-sm font-bold text-riwaq-muted">{qrReservation.id}</p>
              <p className="mt-2 text-xs font-bold text-riwaq-muted">
                طاولة {qrReservation.tableLabel} ·{" "}
                {new Date(qrReservation.startISO).toLocaleString("ar-SA", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-2 rounded-full bg-riwaq-cream px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                {RESERVATION_STATUS_LABELS[qrReservation.status]}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={rejectId !== null}
        title="رفض الحجز"
        onClose={() => setRejectId(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setRejectId(null)}
              className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmRejectReservation}
              className="rounded-2xl bg-red-700 px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              تأكيد الرفض
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {REJECT_REASONS.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-extrabold ${
                rejectPreset === r
                  ? "border-riwaq-green bg-riwaq-green/10 text-riwaq-brown"
                  : "border-riwaq-beige bg-white text-riwaq-muted"
              }`}
            >
              <input
                type="radio"
                name="rej"
                checked={rejectPreset === r}
                onChange={() => setRejectPreset(r)}
                className="accent-riwaq-brown"
              />
              {r}
            </label>
          ))}
          <textarea
            value={rejectCustom}
            onChange={(e) => setRejectCustom(e.target.value)}
            rows={3}
            placeholder="سبب مخصص..."
            className="w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
          />
          <input
            value={rejectAlt}
            onChange={(e) => setRejectAlt(e.target.value)}
            placeholder="اقتراح وقت بديل (اختياري)"
            className="w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
          />
        </div>
      </Modal>

      <Modal
        open={suggestId !== null}
        title="اقتراح وقت بديل"
        onClose={() => setSuggestId(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setSuggestId(null)}
              className="rounded-2xl border border-riwaq-beige px-5 py-2.5 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={confirmSuggestAlt}
              className="rounded-2xl bg-riwaq-brown px-5 py-2.5 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              إرسال الاقتراح
            </button>
          </>
        }
      >
        <textarea
          value={suggestAltInput}
          onChange={(e) => setSuggestAltInput(e.target.value)}
          rows={4}
          placeholder="مثال: نقل الحجز إلى ٨:٣٠ مساءً يوم الجمعة"
          className="w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
        />
      </Modal>

      <TableFloorModal
        open={floorBrowseOpen && changeTableForId === null}
        tables={tables}
        title="مخطط الأرضية — الفرع الرئيسي"
        onClose={() => setFloorBrowseOpen(false)}
      />

      <TableFloorModal
        open={changeTableForId !== null}
        tables={tables}
        title="اختر طاولة بديلة"
        selectableIds={selectableTablesForChange}
        onClose={() => setChangeTableForId(null)}
        onSelectTable={(t) => applyTableChange(t)}
      />
    </div>
  );
}

function StatMini({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof CalendarClock;
  tone: "brown" | "green" | "emerald" | "caramel" | "sky";
}) {
  const ring =
    tone === "brown"
      ? "ring-riwaq-brown/15"
      : tone === "green"
        ? "ring-riwaq-green/25"
        : tone === "emerald"
          ? "ring-emerald-200"
          : tone === "sky"
            ? "ring-sky-200"
            : "ring-riwaq-caramel/25";
  const bg =
    tone === "brown"
      ? "bg-riwaq-brown/10 text-riwaq-brown"
      : tone === "green"
        ? "bg-riwaq-green/15 text-riwaq-green"
        : tone === "emerald"
          ? "bg-emerald-50 text-emerald-900"
          : tone === "sky"
            ? "bg-sky-50 text-sky-900"
            : "bg-riwaq-caramel/15 text-riwaq-caramel";

  return (
    <article
      className={`rounded-3xl border border-white/85 bg-white/75 p-4 shadow-lg shadow-riwaq-brown/6 backdrop-blur-md ring-1 ${ring}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold leading-snug text-riwaq-muted">{label}</p>
          <p className="mt-2 truncate font-extrabold text-xl tabular-nums text-riwaq-brown">{value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </article>
  );
}

function FilterBlk({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block lg:col-span-1">
      <span className="text-[11px] font-extrabold text-riwaq-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function InsightCard({
  title,
  rows,
}: {
  title: string;
  rows: { k: string; v: string }[];
}) {
  return (
    <div className="rounded-3xl border border-white/85 bg-white/70 p-5 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/70">
      <p className="font-extrabold text-riwaq-brown">{title}</p>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.k} className="flex items-center justify-between gap-2 text-sm font-bold text-riwaq-muted">
            <span className="truncate text-riwaq-brown">{row.k}</span>
            <span className="shrink-0 tabular-nums font-extrabold text-riwaq-caramel">{row.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
