"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Hash,
  MessageCircle,
  Package,
  Phone,
  Sparkles,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { formatSar } from "@/lib/format";
import {
  isOrderLate,
  ORDER_STATUS_LABELS,
  TABLE_STATUS_LABELS,
  type OpsOrder,
  type OrderWorkflowStatus,
} from "@/lib/mock/orders-operations";
import { OrderLineThumb } from "@/components/dashboard/orders/order-line-thumb";

export type OrderCardHandlers = {
  onOpenDrawer: (id: string) => void;
  onAcceptOrder: (id: string) => void;
  onRejectOrder: (id: string) => void;
  onStartPreparing: (id: string) => void;
  onMarkReady: (id: string) => void;
  onMarkDelivered: (id: string) => void;
  onContactCustomer: (id: string) => void;
  onAcceptOrderOnly: (id: string) => void;
  onAcceptTableOnly: (id: string) => void;
  onAcceptBoth: (id: string) => void;
  onRejectTableOnly: (id: string) => void;
  onRejectOrderOnlyTableFlow: (id: string) => void;
  onCancelBoth: (id: string) => void;
};

function statusBadgeStyle(st: OrderWorkflowStatus) {
  switch (st) {
    case "new":
      return "bg-riwaq-caramel/15 text-riwaq-caramel ring-riwaq-caramel/25";
    case "pending_review":
      return "bg-amber-100 text-amber-900 ring-amber-200";
    case "accepted":
      return "bg-riwaq-brown/10 text-riwaq-brown ring-riwaq-brown/15";
    case "preparing":
      return "bg-sky-100 text-sky-900 ring-sky-200";
    case "ready":
      return "bg-riwaq-green/15 text-riwaq-green ring-riwaq-green/25";
    case "delivered":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    case "rejected":
      return "bg-red-100 text-red-800 ring-red-200";
    case "cancelled":
      return "bg-zinc-100 text-zinc-700 ring-zinc-200";
    default:
      return "bg-riwaq-beige text-riwaq-brown";
  }
}

function remainingToPickup(pickupISO: string, now: number) {
  const ms = new Date(pickupISO).getTime() - now;
  if (ms <= 0) return { late: true as const, text: "تأخّر عن الموعد" };
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toLocaleString("ar-SA", { minimumIntegerDigits: 2 });
  return {
    late: false as const,
    text: `${pad(h)}:${pad(m)}:${pad(s)}`,
  };
}

export function OrderOperationsCard({
  order,
  tick,
  handlers,
}: {
  order: OpsOrder;
  tick: number;
  handlers: OrderCardHandlers;
}) {
  const late = isOrderLate(order, new Date(tick));
  const countdown = remainingToPickup(order.pickupRequestedISO, tick);

  const paymentStyle =
    order.paymentStatus === "مدفوع"
      ? "bg-riwaq-green/15 text-riwaq-green"
      : order.paymentStatus === "بانتظار الدفع"
        ? "bg-riwaq-caramel/15 text-riwaq-caramel"
        : "bg-red-100 text-red-800";

  const tb = order.tableBooking;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl border bg-white/75 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 transition hover:shadow-2xl hover:shadow-riwaq-brown/12 ${
        late
          ? "border-red-300 ring-red-200/90"
          : "border-white/90 ring-riwaq-beige/70"
      }`}
    >
      <button
        type="button"
        onClick={() => handlers.onOpenDrawer(order.id)}
        className="flex w-full flex-col gap-4 border-b border-riwaq-beige/80 bg-gradient-to-l from-white/90 via-riwaq-cream/40 to-transparent px-5 py-4 text-right transition hover:from-riwaq-beige/30"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-riwaq-brown to-[#2d1a10] text-lg font-extrabold text-white shadow-inner">
              {order.initials}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-lg text-riwaq-brown">{order.customerName}</span>
                {order.orderStatus === "new" ? (
                  <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-sm">
                    طلب جديد
                  </span>
                ) : null}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-riwaq-muted">
                <span className="inline-flex items-center gap-1 tabular-nums" dir="ltr">
                  <Phone className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                  {order.customerPhone}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ring-1 tabular-nums text-riwaq-brown ring-riwaq-beige bg-white/90">
              <Hash className="h-3.5 w-3.5" aria-hidden />
              {order.id}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${statusBadgeStyle(order.orderStatus)}`}
            >
              {ORDER_STATUS_LABELS[order.orderStatus]}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/85 px-3 py-2.5 ring-1 ring-riwaq-beige/80">
            <p className="flex items-center gap-1 text-[10px] font-extrabold text-riwaq-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              وقت الإنشاء
            </p>
            <p className="mt-1 font-extrabold tabular-nums text-riwaq-brown">
              {new Date(order.createdAtISO).toLocaleTimeString("ar-SA", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="rounded-2xl bg-white/85 px-3 py-2.5 ring-1 ring-riwaq-beige/80">
            <p className="flex items-center gap-1 text-[10px] font-extrabold text-riwaq-muted">
              <CalendarClock className="h-3.5 w-3.5 text-riwaq-green" aria-hidden />
              الاستلام المطلوب
            </p>
            <p className="mt-1 font-extrabold tabular-nums text-riwaq-brown">
              {new Date(order.pickupRequestedISO).toLocaleTimeString("ar-SA", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div
            className={`rounded-2xl px-3 py-2.5 ring-1 ${
              late
                ? "bg-red-50 ring-red-200"
                : "bg-white/85 ring-riwaq-beige/80"
            }`}
          >
            <p className="flex items-center gap-1 text-[10px] font-extrabold text-riwaq-muted">
              <Sparkles className="h-3.5 w-3.5 text-riwaq-caramel" aria-hidden />
              التجهيز المتوقع / العدّاد
            </p>
            <p className="mt-1 text-xs font-bold text-riwaq-muted">
              تجهيز تقريبي:{" "}
              <span className="font-extrabold text-riwaq-brown">
                {order.estimatedPrepMinutes.toLocaleString("ar-SA")} د
              </span>
            </p>
            <div className="mt-2 flex items-center gap-2">
              {late ? (
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
              ) : (
                <Clock className="h-5 w-5 shrink-0 text-riwaq-green" aria-hidden />
              )}
              <p
                className={`font-extrabold tabular-nums text-lg ${
                  late ? "text-red-700" : "text-riwaq-brown"
                }`}
              >
                {countdown.late ? countdown.text : `متبقٍ ${countdown.text}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-2 rounded-2xl bg-riwaq-brown/[0.04] px-3 py-3 ring-1 ring-riwaq-brown/10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[10px] font-extrabold text-riwaq-muted">قبل الخصم</p>
            <p className="font-extrabold tabular-nums text-riwaq-brown">
              {formatSar(order.subtotalBeforeDiscount)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-riwaq-muted">الخصم</p>
            <p className="font-extrabold tabular-nums text-riwaq-caramel">
              −{formatSar(order.discountTotal)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-riwaq-muted">الضريبة</p>
            <p className="font-extrabold tabular-nums text-riwaq-brown">
              {order.taxAmount > 0 ? formatSar(order.taxAmount) : "٠ ر.س"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-riwaq-muted">الإجمالي</p>
            <p className="font-extrabold tabular-nums text-lg text-riwaq-brown">
              {formatSar(order.total)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            <CreditCard className="h-3.5 w-3.5 text-riwaq-muted" aria-hidden />
            {order.paymentMethod}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ring-black/5 ${paymentStyle}`}>
            <Wallet className="h-3.5 w-3.5 opacity-80" aria-hidden />
            {order.paymentStatus}
          </span>
          {tb ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-riwaq-green/12 px-3 py-1 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/25">
              <User className="h-3.5 w-3.5" aria-hidden />
              مرتبط بطاولة
            </span>
          ) : null}
        </div>
      </button>

      <div className="space-y-3 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-extrabold text-riwaq-muted">المنتجات</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-riwaq-cream px-2 py-0.5 text-[10px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
            <Flame className="h-3 w-3 text-riwaq-caramel" aria-hidden />
            وضوح للبار والكاشير
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {order.lines.map((line) => (
            <OrderLineThumb key={line.id} line={line} />
          ))}
        </div>
      </div>

      {tb ? (
        <div className="mx-5 mb-4 space-y-4 rounded-3xl border border-riwaq-green/25 bg-gradient-to-bl from-riwaq-green/8 via-white/80 to-riwaq-cream/60 px-4 py-4 shadow-inner ring-1 ring-riwaq-green/15">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-riwaq-green/15 pb-3">
            <h4 className="flex items-center gap-2 font-extrabold text-riwaq-brown">
              <CalendarClock className="h-5 w-5 text-riwaq-green" aria-hidden />
              مرتبط بحجز طاولة
            </h4>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/25">
              {TABLE_STATUS_LABELS[tb.status]}
            </span>
          </div>
          <dl className="grid gap-2 text-sm font-bold text-riwaq-muted sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-extrabold">رقم الطاولة</dt>
              <dd className="font-extrabold text-riwaq-brown">{tb.tableNumber}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-extrabold">عدد الأشخاص</dt>
              <dd className="font-extrabold text-riwaq-brown">{tb.guests.toLocaleString("ar-SA")}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-extrabold">وقت الحجز</dt>
              <dd className="font-extrabold tabular-nums text-riwaq-brown">
                {new Date(tb.reservationStartISO).toLocaleString("ar-SA", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-extrabold">مدة الجلسة</dt>
              <dd className="font-extrabold text-riwaq-brown">
                {tb.sessionMinutes.toLocaleString("ar-SA")} دقيقة
              </dd>
            </div>
          </dl>
          {tb.customerNotes ? (
            <p className="rounded-2xl bg-white/90 px-3 py-2 text-xs font-bold text-riwaq-brown ring-1 ring-riwaq-beige">
              ملاحظات على الطاولة: {tb.customerNotes}
            </p>
          ) : null}
          {tb.rejectReason ? (
            <p className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-extrabold text-red-800 ring-1 ring-red-100">
              سبب رفض الطاولة: {tb.rejectReason}
              {tb.suggestedAlternativeTime ? (
                <span className="mr-2 block font-bold text-red-700">
                  وقت بديل مقترح: {tb.suggestedAlternativeTime}
                </span>
              ) : null}
            </p>
          ) : null}
          {order.rejectReasonOrder ? (
            <p className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-extrabold text-red-800 ring-1 ring-red-100">
              سبب رفض الطلب: {order.rejectReasonOrder}
            </p>
          ) : null}
          {order.cancelBothReason ? (
            <p className="rounded-2xl bg-zinc-100 px-3 py-2 text-xs font-extrabold text-zinc-800 ring-1 ring-zinc-200">
              سبب إلغاء الطلب والطاولة: {order.cancelBothReason}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 border-t border-riwaq-green/15 pt-3">
            <button
              type="button"
              disabled={
                order.orderStatus === "rejected" ||
                order.orderStatus === "cancelled" ||
                order.orderStatus === "delivered"
              }
              onClick={() => handlers.onAcceptOrderOnly(order.id)}
              className="rounded-2xl bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige shadow-sm hover:bg-riwaq-beige/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              قبول الطلب فقط
            </button>
            <button
              type="button"
              disabled={
                tb.status !== "pending_staff" ||
                order.orderStatus === "cancelled" ||
                order.orderStatus === "rejected"
              }
              onClick={() => handlers.onAcceptTableOnly(order.id)}
              className="rounded-2xl bg-white px-3 py-2 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/30 shadow-sm hover:bg-riwaq-green/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              قبول الطاولة فقط
            </button>
            <button
              type="button"
              disabled={
                order.orderStatus === "delivered" ||
                order.orderStatus === "rejected" ||
                order.orderStatus === "cancelled"
              }
              onClick={() => handlers.onAcceptBoth(order.id)}
              className="rounded-2xl bg-riwaq-green px-3 py-2 text-xs font-extrabold text-white shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              قبول الطلب والطاولة
            </button>
            <button
              type="button"
              disabled={tb.status !== "pending_staff"}
              onClick={() => handlers.onRejectTableOnly(order.id)}
              className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              رفض الطاولة فقط
            </button>
            <button
              type="button"
              disabled={
                order.orderStatus === "rejected" ||
                order.orderStatus === "cancelled" ||
                order.orderStatus === "delivered"
              }
              onClick={() => handlers.onRejectOrderOnlyTableFlow(order.id)}
              className="rounded-2xl border border-red-200 bg-white px-3 py-2 text-xs font-extrabold text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              رفض الطلب فقط
            </button>
            <button
              type="button"
              disabled={
                order.orderStatus === "delivered" ||
                order.orderStatus === "cancelled" ||
                order.orderStatus === "rejected"
              }
              onClick={() => handlers.onCancelBoth(order.id)}
              className="rounded-2xl bg-riwaq-brown px-3 py-2 text-xs font-extrabold text-white hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              إلغاء الطلب والطاولة
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-riwaq-beige/80 bg-white/50 px-5 py-4">
        <button
          type="button"
          disabled={
            order.orderStatus !== "new" &&
            order.orderStatus !== "pending_review"
          }
          onClick={() => handlers.onAcceptOrder(order.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-riwaq-green px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          قبول الطلب
        </button>
        <button
          type="button"
          disabled={
            order.orderStatus === "delivered" ||
            order.orderStatus === "rejected" ||
            order.orderStatus === "cancelled"
          }
          onClick={() => handlers.onRejectOrder(order.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-extrabold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <XCircle className="h-4 w-4" aria-hidden />
          رفض الطلب
        </button>
        <button
          type="button"
          disabled={order.orderStatus !== "accepted"}
          onClick={() => handlers.onStartPreparing(order.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-sky-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Package className="h-4 w-4" aria-hidden />
          بدء التجهيز
        </button>
        <button
          type="button"
          disabled={order.orderStatus !== "preparing"}
          onClick={() => handlers.onMarkReady(order.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-riwaq-brown px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          جاهز للاستلام
        </button>
        <button
          type="button"
          disabled={order.orderStatus !== "ready"}
          onClick={() => handlers.onMarkDelivered(order.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl border border-riwaq-beige bg-white px-4 py-2.5 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40 disabled:cursor-not-allowed disabled:opacity-35"
        >
          تم التسليم
        </button>
        <button
          type="button"
          onClick={() => handlers.onContactCustomer(order.id)}
          className="inline-flex flex-1 min-w-[8rem] items-center justify-center gap-1 rounded-2xl bg-riwaq-caramel/15 px-4 py-2.5 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-caramel/30 hover:bg-riwaq-caramel/25"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          تواصل مع العميل
        </button>
      </div>
    </article>
  );
}
