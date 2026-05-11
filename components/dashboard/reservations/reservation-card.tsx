"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Crown,
  MapPin,
  MoreHorizontal,
  Phone,
  QrCode,
  RefreshCw,
  Sparkles,
  Users,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { formatSar } from "@/lib/format";
import {
  QR_BADGE_LABELS,
  RESERVATION_STATUS_LABELS,
  TABLE_CATEGORY_LABELS,
  TABLE_SERVICE_LABELS,
  expectedSessionEndISO,
  formatDurationHMS,
  isSessionOverrun,
  seatingElapsedMs,
  type LinkedDecision,
  type ReservationRecord,
  type ReservationStatus,
} from "@/lib/mock/reservations-center";
import { ReservationLinkedThumb } from "@/components/dashboard/reservations/reservation-linked-thumb";
import { ReservationQr } from "@/components/dashboard/ui/reservation-qr";

export type ReservationCardHandlers = {
  onOpenDrawer: (id: string) => void;
  onOpenQr: (id: string) => void;
  onAccept: (id: string) => void;
  onRejectOpen: (id: string) => void;
  onSuggestOpen: (id: string) => void;
  onChangeTableOpen: (id: string) => void;
  onStartSession: (id: string) => void;
  onEndSession: (id: string) => void;
  onLinkedAcceptRsvOnly: (id: string) => void;
  onLinkedAcceptOrderOnly: (id: string) => void;
  onLinkedAcceptBoth: (id: string) => void;
  onLinkedRejectOrder: (id: string) => void;
  onLinkedRejectRsv: (id: string) => void;
  onLinkedCancelBoth: (id: string) => void;
};

function statusStyle(st: ReservationStatus) {
  switch (st) {
    case "new":
      return "bg-sky-100 text-sky-900 ring-sky-200";
    case "pending_review":
      return "bg-riwaq-caramel/15 text-riwaq-caramel ring-riwaq-caramel/25";
    case "confirmed":
      return "bg-riwaq-green/15 text-riwaq-green ring-riwaq-green/25";
    case "awaiting_guest":
      return "bg-violet-100 text-violet-900 ring-violet-200";
    case "guest_arrived":
      return "bg-emerald-100 text-emerald-900 ring-emerald-200";
    case "session_active":
      return "bg-riwaq-brown/15 text-riwaq-brown ring-riwaq-brown/20";
    case "session_ended":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    case "late":
      return "bg-red-100 text-red-800 ring-red-200";
    case "cancelled":
      return "bg-zinc-100 text-zinc-700 ring-zinc-200";
    case "rejected":
      return "bg-red-50 text-red-800 ring-red-100";
    default:
      return "bg-riwaq-beige text-riwaq-brown";
  }
}

function arrivalLabel(a: ReservationRecord["arrivalStatus"]) {
  switch (a) {
    case "arrived":
      return { text: "وصل", cls: "bg-riwaq-green/15 text-riwaq-green ring-riwaq-green/25" };
    case "late":
      return { text: "متأخر", cls: "bg-red-100 text-red-800 ring-red-200" };
    default:
      return { text: "لم يصل", cls: "bg-white text-riwaq-muted ring-riwaq-beige" };
  }
}

function formatDur(ms: number) {
  if (ms <= 0) return null;
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toLocaleString("ar-SA", { minimumIntegerDigits: 2 });
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function countdownFor(r: ReservationRecord, now: number) {
  const start = new Date(r.startISO).getTime();
  const end = start + r.sessionMinutes * 60_000;

  if (
    r.status === "session_ended" ||
    r.status === "cancelled" ||
    r.status === "rejected"
  ) {
    return { line: "انتهى الحجز", sub: "—", urgent: false, alert: false };
  }

  if (r.status === "session_active") {
    const ms = end - now;
    if (ms <= 0) return { line: "انتهت الجلسة متوقعًا", sub: "٠٠:٠٠:٠٠", urgent: true, alert: true };
    return {
      line: "متبقٍ لانتهاء الجلسة",
      sub: formatDur(ms) ?? "",
      urgent: ms < 15 * 60_000,
      alert: false,
    };
  }

  const toStart = start - now;
  if (toStart > 0) {
    return {
      line: "متبقٍ لبدء الموعد",
      sub: formatDur(toStart) ?? "",
      urgent: toStart < 20 * 60_000,
      alert: false,
    };
  }

  return {
    line: r.status === "late" || r.arrivalStatus === "late" ? "تأخّر عن الموعد" : "بدء الموعد مجاز",
    sub: "٠٠:٠٠:٠٠",
    urgent: true,
    alert: r.status === "late" || r.arrivalStatus === "late",
  };
}

function linkedDecisionLabel(d?: LinkedDecision) {
  switch (d) {
    case "accepted_rsv_only":
      return "تم قبول الحجز فقط";
    case "accepted_order_only":
      return "تم قبول الطلب فقط";
    case "accepted_both":
      return "تم قبول الحجز والطلب";
    case "rejected_order":
      return "تم رفض الطلب";
    case "rejected_rsv":
      return "تم رفض الحجز";
    case "cancelled_both":
      return "تم إلغاء الاثنين";
    default:
      return null;
  }
}

export function ReservationCard({
  r,
  tick,
  handlers,
}: {
  r: ReservationRecord;
  tick: number;
  handlers: ReservationCardHandlers;
}) {
  const cd = countdownFor(r, tick);
  const arr = arrivalLabel(r.arrivalStatus);
  const linkedNote = linkedDecisionLabel(r.linkedDecision);
  const seatingMs = seatingElapsedMs(r, tick);
  const overrun = isSessionOverrun(r, tick);
  const expectedEnd = expectedSessionEndISO(r);
  const reqSvc = r.requestedServices ?? [];
  const partitionAsk = r.partitionRequested ?? false;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl border bg-white/75 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 transition hover:shadow-2xl ${
        cd.alert ? "border-red-300 ring-red-200/80" : "border-white/90 ring-riwaq-beige/70"
      }`}
    >
      <div className="flex flex-col gap-4 border-b border-riwaq-beige/80 bg-gradient-to-l from-white via-riwaq-cream/35 to-transparent px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-riwaq-brown to-[#2d1a10] text-lg font-extrabold text-white shadow-inner">
              {r.initials}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-lg text-riwaq-brown">{r.customerName}</h3>
                {r.isVip ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-riwaq-caramel/15 px-2 py-0.5 text-[11px] font-extrabold text-riwaq-caramel ring-1 ring-riwaq-caramel/25">
                    <Crown className="h-3.5 w-3.5" aria-hidden />
                    VIP
                  </span>
                ) : null}
                {r.status === "new" ? (
                  <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[11px] font-extrabold text-white">
                    جديد
                  </span>
                ) : null}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm font-bold text-riwaq-muted" dir="ltr">
                <Phone className="h-4 w-4 shrink-0 text-riwaq-caramel" aria-hidden />
                {r.phone}
              </p>
              <p className="mt-2 text-xs font-bold text-riwaq-muted">
                زيارات سابقة:{" "}
                <span className="font-extrabold text-riwaq-brown">
                  {r.priorVisits.toLocaleString("ar-SA")}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-extrabold tabular-nums text-riwaq-brown">{r.id}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${statusStyle(r.status)}`}>
              {RESERVATION_STATUS_LABELS[r.status]}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${arr.cls}`}>
              وصول: {arr.text}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/85 px-3 py-2 ring-1 ring-riwaq-beige/80">
            <p className="flex items-center gap-1 text-[10px] font-extrabold text-riwaq-muted">
              <Users className="h-3.5 w-3.5" aria-hidden />
              الأشخاص
            </p>
            <p className="mt-1 font-extrabold tabular-nums text-riwaq-brown">
              {r.guests.toLocaleString("ar-SA")}
            </p>
          </div>
          <div className="rounded-2xl bg-white/85 px-3 py-2 ring-1 ring-riwaq-beige/80">
            <p className="flex items-center gap-1 text-[10px] font-extrabold text-riwaq-muted">
              <CalendarClock className="h-3.5 w-3.5 text-riwaq-green" aria-hidden />
              وقت الحجز
            </p>
            <p className="mt-1 font-extrabold tabular-nums text-sm text-riwaq-brown">
              {new Date(r.startISO).toLocaleString("ar-SA", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="rounded-2xl bg-white/85 px-3 py-2 ring-1 ring-riwaq-beige/80">
            <p className="flex items-center gap-1 text-[10px] font-extrabold text-riwaq-muted">
              <Clock className="h-3.5 w-3.5 text-riwaq-caramel" aria-hidden />
              مدة الجلسة
            </p>
            <p className="mt-1 font-extrabold text-riwaq-brown">
              {r.sessionMinutes.toLocaleString("ar-SA")} د
            </p>
          </div>
          <div
            className={`rounded-2xl px-3 py-2 ring-1 ${
              cd.alert ? "bg-red-50 ring-red-200" : "bg-white/85 ring-riwaq-beige/80"
            }`}
          >
            <p className="flex items-center gap-1 text-[10px] font-extrabold text-riwaq-muted">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              العدّاد
            </p>
            <p className="mt-1 text-[11px] font-bold text-riwaq-muted">{cd.line}</p>
            <div className="mt-1 flex items-center gap-2">
              {cd.alert ? (
                <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden />
              ) : (
                <Clock className="h-5 w-5 text-riwaq-green" aria-hidden />
              )}
              <p
                className={`font-extrabold tabular-nums text-xl ${
                  cd.urgent ? "text-riwaq-caramel" : "text-riwaq-brown"
                }`}
              >
                {cd.sub}
              </p>
            </div>
          </div>
        </div>

        {seatingMs != null ? (
          <div
            className={`rounded-3xl border px-4 py-4 ring-1 ${
              overrun
                ? "border-red-200 bg-red-50/80 ring-red-100"
                : "border-riwaq-green/30 bg-linear-to-bl from-riwaq-green/10 via-white to-riwaq-cream/40 ring-riwaq-green/15"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-extrabold text-riwaq-brown">مدة جلوس العميل</p>
              {overrun ? (
                <span className="rounded-full bg-red-700 px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
                  تجاوز الوقت
                </span>
              ) : null}
            </div>
            <p className="mt-2 font-extrabold tabular-nums text-2xl text-riwaq-brown">
              جالس منذ: {formatDurationHMS(seatingMs)}
            </p>
            <dl className="mt-3 grid gap-2 text-[11px] font-bold text-riwaq-muted sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-white">
                <dt className="font-extrabold text-riwaq-muted">الوقت المتوقع لنهاية الجلسة</dt>
                <dd className="mt-1 font-extrabold tabular-nums text-riwaq-brown">
                  {expectedEnd
                    ? new Date(expectedEnd).toLocaleString("ar-SA", {
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </dd>
              </div>
              <div className="rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-white">
                <dt className="font-extrabold text-riwaq-muted">المدة المتوقعة للجلسة</dt>
                <dd className="mt-1 font-extrabold tabular-nums text-riwaq-brown">
                  {r.sessionMinutes.toLocaleString("ar-SA")} د
                </dd>
              </div>
              <div className="rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-white sm:col-span-2">
                <dt className="font-extrabold text-riwaq-muted">هل تجاوز العميل المدة؟</dt>
                <dd className="mt-1 font-extrabold text-riwaq-brown">{overrun ? "نعم" : "لا"}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            بارتيشن:{" "}
            <span className="text-riwaq-caramel">{partitionAsk ? "نعم" : "لا"}</span>
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            طلب منيو:{" "}
            <span className="text-riwaq-caramel">{r.linkedOrder ? "نعم" : "لا"}</span>
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            ولاء / مكافأة:{" "}
            <span className="text-riwaq-caramel">{r.loyaltyPreview?.linked ? "نعم" : "لا"}</span>
          </span>
        </div>

        {reqSvc.length > 0 ? (
          <div className="rounded-2xl bg-white/85 px-4 py-3 ring-1 ring-riwaq-beige/80">
            <p className="text-[10px] font-extrabold text-riwaq-muted">خدمات مطلوبة</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {reqSvc.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-riwaq-brown/10 px-2.5 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-brown/15"
                >
                  {TABLE_SERVICE_LABELS[s]}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            <MapPin className="h-3.5 w-3.5 text-riwaq-muted" aria-hidden />
            طاولة {r.tableLabel}
          </span>
          <span className="rounded-full bg-riwaq-beige/70 px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            {TABLE_CATEGORY_LABELS[r.tableCategory]}
          </span>
          <button
            type="button"
            onClick={() => handlers.onOpenQr(r.id)}
            className="inline-flex items-center gap-2 rounded-full border border-riwaq-beige bg-white px-3 py-1 text-xs font-extrabold text-riwaq-brown shadow-sm hover:border-riwaq-caramel/40"
          >
            <span className="relative inline-flex">
              <ReservationQr reservationId={r.id} size={40} />
            </span>
            <QrCode className="h-4 w-4 text-riwaq-muted" aria-hidden />
            QR
            <span className="rounded-full bg-riwaq-cream px-2 py-0.5 text-[10px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
              {QR_BADGE_LABELS[r.qrStatus]}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handlers.onOpenDrawer(r.id)}
            className="inline-flex items-center gap-1 rounded-full bg-riwaq-brown/10 px-3 py-1 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-brown/15"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
            التفاصيل
          </button>
        </div>

        {r.customerNotes ? (
          <p className="rounded-2xl bg-white/90 px-4 py-3 text-sm font-bold text-riwaq-brown ring-1 ring-riwaq-beige">
            ملاحظات العميل: {r.customerNotes}
          </p>
        ) : null}

        {r.linkedOrder ? (
          <div className="rounded-3xl border border-riwaq-caramel/25 bg-gradient-to-bl from-riwaq-caramel/10 via-white to-riwaq-cream/50 px-4 py-4 ring-1 ring-riwaq-caramel/15">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-riwaq-beige/80 pb-3">
              <h4 className="flex items-center gap-2 font-extrabold text-riwaq-brown">
                <UtensilsCrossed className="h-5 w-5 text-riwaq-caramel" aria-hidden />
                طلب منيو مرتبط
              </h4>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                {r.linkedOrder.paymentStatus}
              </span>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {r.linkedOrder.lines.map((line) => (
                <ReservationLinkedThumb
                  key={line.id}
                  name={line.name}
                  qty={line.qty}
                  variant={line.imageVariant}
                />
              ))}
            </div>
            <dl className="mt-3 grid gap-2 text-sm font-bold text-riwaq-muted sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-extrabold">عدد الأصناف</dt>
                <dd className="font-extrabold text-riwaq-brown">
                  {r.linkedOrder.lines.reduce((s, l) => s + l.qty, 0).toLocaleString("ar-SA")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold">العروض</dt>
                <dd className="font-extrabold text-riwaq-brown">{r.linkedOrder.promosSummary}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold">تجهيز تقريبي</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">
                  {r.linkedOrder.prepEtaMinutes.toLocaleString("ar-SA")} د
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold">حالة الطلب</dt>
                <dd className="font-extrabold text-riwaq-brown">{r.linkedOrder.orderWorkflowStatus}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-extrabold">قيمة الطلب</dt>
                <dd className="font-extrabold tabular-nums text-lg text-riwaq-brown">
                  {formatSar(r.linkedOrder.total)}
                </dd>
              </div>
            </dl>
            {linkedNote ? (
              <p className="mt-3 rounded-2xl bg-white/90 px-3 py-2 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/25">
                {linkedNote}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-riwaq-beige/70 pt-3">
              <button
                type="button"
                disabled={
                  r.status === "cancelled" ||
                  r.status === "rejected" ||
                  r.status === "session_ended"
                }
                onClick={() => handlers.onLinkedAcceptRsvOnly(r.id)}
                className="rounded-2xl bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige hover:bg-riwaq-beige/40 disabled:opacity-40"
              >
                قبول الحجز فقط
              </button>
              <button
                type="button"
                disabled={
                  r.status === "cancelled" ||
                  r.status === "rejected" ||
                  r.status === "session_ended"
                }
                onClick={() => handlers.onLinkedAcceptOrderOnly(r.id)}
                className="rounded-2xl bg-white px-3 py-2 text-xs font-extrabold text-riwaq-caramel ring-1 ring-riwaq-caramel/30 hover:bg-riwaq-caramel/10 disabled:opacity-40"
              >
                قبول الطلب فقط
              </button>
              <button
                type="button"
                disabled={
                  r.status === "cancelled" ||
                  r.status === "rejected" ||
                  r.status === "session_ended"
                }
                onClick={() => handlers.onLinkedAcceptBoth(r.id)}
                className="rounded-2xl bg-riwaq-green px-3 py-2 text-xs font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-40"
              >
                قبول الاثنين
              </button>
              <button
                type="button"
                disabled={
                  r.status === "cancelled" ||
                  r.status === "rejected" ||
                  r.status === "session_ended"
                }
                onClick={() => handlers.onLinkedRejectOrder(r.id)}
                className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-800 hover:bg-red-100 disabled:opacity-40"
              >
                رفض الطلب فقط
              </button>
              <button
                type="button"
                disabled={
                  r.status === "cancelled" ||
                  r.status === "rejected" ||
                  r.status === "session_ended"
                }
                onClick={() => handlers.onLinkedRejectRsv(r.id)}
                className="rounded-2xl border border-red-200 bg-white px-3 py-2 text-xs font-extrabold text-red-800 hover:bg-red-50 disabled:opacity-40"
              >
                رفض الحجز فقط
              </button>
              <button
                type="button"
                disabled={
                  r.status === "cancelled" ||
                  r.status === "rejected" ||
                  r.status === "session_ended"
                }
                onClick={() => handlers.onLinkedCancelBoth(r.id)}
                className="rounded-2xl bg-zinc-800 px-3 py-2 text-xs font-extrabold text-white hover:brightness-105 disabled:opacity-40"
              >
                إلغاء الاثنين
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-riwaq-beige bg-white/60 px-4 py-3 text-sm font-bold text-riwaq-muted">
            <UtensilsCrossed className="h-5 w-5 text-riwaq-muted opacity-50" aria-hidden />
            لا يوجد طلب منيو مرتبط — حجز طاولة فقط.
          </div>
        )}

        {r.rejectReason ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-800 ring-1 ring-red-100">
            سبب الرفض / الإلغاء: {r.rejectReason}
            {r.suggestedAlternative ? (
              <span className="mr-2 mt-1 block text-xs font-bold text-red-700">
                وقت بديل: {r.suggestedAlternative}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 px-5 py-4">
        <button
          type="button"
          disabled={!["new", "pending_review"].includes(r.status)}
          onClick={() => handlers.onAccept(r.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-riwaq-green px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-35"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          قبول الحجز
        </button>
        <button
          type="button"
          disabled={
            r.status === "session_ended" ||
            r.status === "cancelled" ||
            r.status === "rejected"
          }
          onClick={() => handlers.onRejectOpen(r.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-extrabold text-red-800 hover:bg-red-100 disabled:opacity-35"
        >
          <XCircle className="h-4 w-4" aria-hidden />
          رفض الحجز
        </button>
        <button
          type="button"
          disabled={
            r.status === "session_ended" ||
            r.status === "cancelled" ||
            r.status === "rejected"
          }
          onClick={() => handlers.onSuggestOpen(r.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-white px-4 py-2.5 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige hover:border-riwaq-caramel/40 disabled:opacity-35"
        >
          <RefreshCw className="h-4 w-4 text-riwaq-caramel" aria-hidden />
          وقت بديل
        </button>
        <button
          type="button"
          disabled={
            r.status === "session_ended" ||
            r.status === "cancelled" ||
            r.status === "rejected"
          }
          onClick={() => handlers.onChangeTableOpen(r.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-riwaq-brown/10 px-4 py-2.5 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-brown/15 disabled:opacity-35"
        >
          <MapPin className="h-4 w-4" aria-hidden />
          تغيير الطاولة
        </button>
        <button
          type="button"
          disabled={
            !["confirmed", "awaiting_guest", "guest_arrived", "late"].includes(r.status)
          }
          onClick={() => handlers.onStartSession(r.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-sky-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-105 disabled:opacity-35"
        >
          بدء الجلسة
        </button>
        <button
          type="button"
          disabled={r.status !== "session_active"}
          onClick={() => handlers.onEndSession(r.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl border border-riwaq-beige bg-white px-4 py-2.5 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40 disabled:opacity-35"
        >
          إنهاء الجلسة
        </button>
      </div>
    </article>
  );
}
