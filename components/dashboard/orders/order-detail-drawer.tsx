"use client";

import { CheckCircle2, Circle, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatSar } from "@/lib/format";
import {
  ORDER_STATUS_LABELS,
  TABLE_STATUS_LABELS,
  type OpsOrder,
  type TimelineStepId,
} from "@/lib/mock/orders-operations";
import { OrderLineThumb } from "@/components/dashboard/orders/order-line-thumb";

function stepReached(order: OpsOrder, step: TimelineStepId): boolean {
  const idx = order.timeline.findIndex((t) => t.step === step);
  if (idx === -1) return false;
  return Boolean(order.timeline[idx]?.atISO);
}

const stepOrder: TimelineStepId[] = [
  "created",
  "reviewed",
  "accepted",
  "preparing",
  "ready",
  "delivered",
];

export function OrderDetailDrawer({
  order,
  open,
  onClose,
  onStaffNotesChange,
}: {
  order: OpsOrder | null;
  open: boolean;
  onClose: () => void;
  onStaffNotesChange: (orderId: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (order) setNotes(order.staffNotes ?? "");
  }, [order]);

  if (!open || !order) return null;

  return (
    <>
      <button
        type="button"
        aria-label="إغلاق"
        className="fixed inset-0 z-[70] bg-riwaq-brown/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 start-0 z-[80] flex w-[min(100vw-1rem,26rem)] flex-col border-e border-riwaq-beige bg-white shadow-2xl shadow-riwaq-brown/25 sm:w-[min(100vw-2rem,28rem)]">
        <div className="flex items-start justify-between gap-3 border-b border-riwaq-beige px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-riwaq-muted">تفاصيل الطلب</p>
            <p className="mt-1 truncate font-extrabold text-xl text-riwaq-brown">{order.id}</p>
            <p className="mt-1 truncate text-sm font-bold text-riwaq-muted">{order.customerName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-riwaq-muted hover:bg-riwaq-beige/70"
            aria-label="إغلاق اللوحة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <section className="rounded-3xl border border-riwaq-beige bg-riwaq-cream/40 p-4 ring-1 ring-white">
            <h3 className="font-extrabold text-riwaq-brown">بيانات العميل</h3>
            <dl className="mt-3 space-y-2 text-sm font-bold text-riwaq-muted">
              <div className="flex justify-between gap-2">
                <dt>الاسم</dt>
                <dd className="font-extrabold text-riwaq-brown">{order.customerName}</dd>
              </div>
              <div className="flex justify-between gap-2" dir="ltr">
                <dt className="text-right">الجوال</dt>
                <dd className="font-extrabold text-riwaq-brown">{order.customerPhone}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>حالة الطلب</dt>
                <dd className="font-extrabold text-riwaq-brown">
                  {ORDER_STATUS_LABELS[order.orderStatus]}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>الإجمالي</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">
                  {formatSar(order.total)}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="font-extrabold text-riwaq-brown">المنتجات</h3>
            <div className="mt-3 flex flex-col gap-2">
              {order.lines.map((line) => (
                <OrderLineThumb key={line.id} line={line} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-riwaq-beige bg-white p-4 shadow-inner">
            <h3 className="font-extrabold text-riwaq-brown">الخصومات والعروض</h3>
            <div className="mt-3 space-y-2 text-sm font-bold">
              <div className="flex justify-between text-riwaq-muted">
                <span>إجمالي قبل الخصم</span>
                <span className="tabular-nums font-extrabold text-riwaq-brown">
                  {formatSar(order.subtotalBeforeDiscount)}
                </span>
              </div>
              <div className="flex justify-between text-riwaq-muted">
                <span>خصومات</span>
                <span className="tabular-nums font-extrabold text-riwaq-caramel">
                  −{formatSar(order.discountTotal)}
                </span>
              </div>
              <div className="flex justify-between text-riwaq-muted">
                <span>ضريبة القيمة المضافة</span>
                <span className="tabular-nums font-extrabold text-riwaq-brown">
                  {formatSar(order.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between border-t border-riwaq-beige pt-2 font-extrabold text-riwaq-brown">
                <span>النهائي</span>
                <span className="tabular-nums">{formatSar(order.total)}</span>
              </div>
            </div>
          </section>

          {order.tableBooking ? (
            <section className="rounded-3xl border border-riwaq-green/25 bg-riwaq-green/8 p-4 ring-1 ring-riwaq-green/15">
              <h3 className="font-extrabold text-riwaq-brown">حجز الطاولة</h3>
              <dl className="mt-3 space-y-2 text-sm font-bold text-riwaq-muted">
                <div className="flex justify-between">
                  <dt>الطاولة</dt>
                  <dd className="font-extrabold text-riwaq-brown">{order.tableBooking.tableNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>الضيوف</dt>
                  <dd className="font-extrabold text-riwaq-brown">
                    {order.tableBooking.guests.toLocaleString("ar-SA")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>حالة الحجز</dt>
                  <dd className="font-extrabold text-riwaq-green">
                    {TABLE_STATUS_LABELS[order.tableBooking.status]}
                  </dd>
                </div>
              </dl>
              {order.tableBooking.customerNotes ? (
                <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-riwaq-brown ring-1 ring-white">
                  {order.tableBooking.customerNotes}
                </p>
              ) : null}
            </section>
          ) : null}

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-extrabold text-riwaq-brown">
              <Clock className="h-5 w-5 text-riwaq-caramel" aria-hidden />
              مسار الطلب
            </h3>
            <ol className="relative space-y-0 border-e-2 border-riwaq-beige pe-4">
              {stepOrder.map((step) => {
                const entry = order.timeline.find((t) => t.step === step);
                const done = stepReached(order, step);
                return (
                  <li key={step} className="relative pb-6 last:pb-0">
                    <span className="absolute -end-[21px] top-1 flex h-4 w-4 translate-x-1/2 items-center justify-center rounded-full bg-white ring-2 ring-riwaq-beige">
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-riwaq-green" aria-hidden />
                      ) : (
                        <Circle className="h-3 w-3 text-riwaq-muted" aria-hidden />
                      )}
                    </span>
                    <p className={`text-sm font-extrabold ${done ? "text-riwaq-brown" : "text-riwaq-muted"}`}>
                      {entry?.labelAr ?? step}
                    </p>
                    {entry?.atISO ? (
                      <p className="mt-0.5 text-xs font-bold tabular-nums text-riwaq-muted">
                        {new Date(entry.atISO).toLocaleString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[11px] font-bold text-riwaq-muted">لم يُسجَّل بعد</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <label className="block">
              <span className="font-extrabold text-riwaq-brown">ملاحظات داخلية للموظفين</span>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  onStaffNotesChange(order.id, e.target.value);
                }}
                rows={4}
                placeholder="تنسيق مع البار، تأخير متوقع، طلبات مكررة..."
                className="mt-2 w-full resize-none rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </label>
          </section>
        </div>
      </aside>
    </>
  );
}
