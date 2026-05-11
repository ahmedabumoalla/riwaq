"use client";

import { AlertTriangle, CheckCircle2, Circle, Clock, Crown, Sparkles, Star, X } from "lucide-react";
import { formatSar } from "@/lib/format";
import {
  OFFER_KIND_LABELS_AR,
  RESERVATION_STATUS_LABELS,
  TABLE_CATEGORY_LABELS,
  TABLE_SERVICE_LABELS,
  arrivalISOFromReservation,
  expectedSessionEndISO,
  formatDurationHMS,
  isSessionOverrun,
  seatingElapsedMs,
  type ManagedTable,
  type ReservationRecord,
  type TimelineStep,
} from "@/lib/mock/reservations-center";
import { ReservationLinkedThumb } from "@/components/dashboard/reservations/reservation-linked-thumb";

const STEP_FLOW: TimelineStep[] = [
  "created",
  "reviewed",
  "confirmed",
  "arrived",
  "session_started",
  "session_ended",
];

export function ReservationDrawer({
  open,
  reservation,
  table,
  tick,
  onClose,
}: {
  open: boolean;
  reservation: ReservationRecord | null;
  table: ManagedTable | null;
  tick: number;
  onClose: () => void;
}) {
  if (!open || !reservation) return null;

  const reached = (step: TimelineStep) =>
    Boolean(reservation.timeline.find((t) => t.step === step)?.atISO);

  const arrivedAt = arrivalISOFromReservation(reservation);
  const expectedEnd = expectedSessionEndISO(reservation);
  const seatingMs = seatingElapsedMs(reservation, tick);
  const overrun = isSessionOverrun(reservation, tick);
  const requested = reservation.requestedServices ?? [];
  const partition = reservation.partitionRequested ?? false;

  return (
    <>
      <button
        type="button"
        aria-label="إغلاق"
        className="fixed inset-0 z-[70] bg-riwaq-brown/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 start-0 z-[80] flex w-[min(100vw-1rem,28rem)] flex-col border-e border-riwaq-beige bg-white shadow-2xl sm:w-[min(100vw-2rem,34rem)]">
        <div className="flex items-start justify-between gap-3 border-b border-riwaq-beige px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-riwaq-muted">ملف الحجز</p>
            <p className="mt-1 font-extrabold text-xl text-riwaq-brown">{reservation.id}</p>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">{reservation.customerName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-riwaq-muted hover:bg-riwaq-beige/70"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {seatingMs != null ? (
            <section className="rounded-3xl border border-riwaq-green/25 bg-linear-to-bl from-riwaq-green/12 via-white to-riwaq-cream/40 p-4 ring-1 ring-riwaq-green/15">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-extrabold text-riwaq-brown">
                  <Clock className="h-5 w-5 text-riwaq-green" aria-hidden />
                  مدة جلوس العميل
                </h3>
                {overrun ? (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
                    تجاوز الوقت
                  </span>
                ) : null}
              </div>
              <p className="mt-3 font-extrabold tabular-nums text-3xl text-riwaq-brown">
                جالس منذ: {formatDurationHMS(seatingMs)}
              </p>
              <dl className="mt-4 space-y-2 text-xs font-bold text-riwaq-muted">
                <div className="flex justify-between gap-2">
                  <dt>وقت الوصول</dt>
                  <dd className="font-extrabold tabular-nums text-riwaq-brown">
                    {arrivedAt
                      ? new Date(arrivedAt).toLocaleString("ar-SA", {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>نهاية الجلسة المتوقعة</dt>
                  <dd className="font-extrabold tabular-nums text-riwaq-brown">
                    {expectedEnd
                      ? new Date(expectedEnd).toLocaleString("ar-SA", {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>المدة المتوقعة للجلسة</dt>
                  <dd className="font-extrabold tabular-nums text-riwaq-brown">
                    {reservation.sessionMinutes.toLocaleString("ar-SA")} د
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>تجاوز المدة</dt>
                  <dd className="font-extrabold text-riwaq-brown">{overrun ? "نعم" : "لا"}</dd>
                </div>
              </dl>
              {overrun ? (
                <p className="mt-3 flex items-start gap-2 rounded-2xl bg-red-50 px-3 py-2 text-[11px] font-bold text-red-900 ring-1 ring-red-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  تجاوز مدة الجلسة المتوقعة بعد الوصول — يُفضّل متابعة الطاولة بلطف.
                </p>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-3xl border border-riwaq-beige bg-riwaq-cream/50 p-4 ring-1 ring-white">
            <h3 className="font-extrabold text-riwaq-brown">البيانات</h3>
            <dl className="mt-3 space-y-2 text-sm font-bold text-riwaq-muted">
              <div className="flex justify-between gap-2">
                <dt>الحالة</dt>
                <dd className="font-extrabold text-riwaq-brown">
                  {RESERVATION_STATUS_LABELS[reservation.status]}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>الطاولة</dt>
                <dd className="font-extrabold text-riwaq-brown">{reservation.tableLabel}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>نوع الطاولة (حجز)</dt>
                <dd className="font-extrabold text-riwaq-brown">
                  {TABLE_CATEGORY_LABELS[reservation.tableCategory]}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>طلب بارتيشن</dt>
                <dd className="font-extrabold text-riwaq-brown">{partition ? "نعم" : "لا"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>مدة الجلسة المتوقعة</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">
                  {reservation.sessionMinutes.toLocaleString("ar-SA")} د
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>مرتبط بطلب منيو</dt>
                <dd className="font-extrabold text-riwaq-brown">{reservation.linkedOrder ? "نعم" : "لا"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>مرتبط بمكافأة / ولاء</dt>
                <dd className="font-extrabold text-riwaq-brown">
                  {reservation.loyaltyPreview?.linked ? "نعم" : "لا"}
                </dd>
              </div>
            </dl>
          </section>

          {reservation.customerNotes ? (
            <section className="rounded-3xl border border-riwaq-beige bg-white/90 p-4 ring-1 ring-white">
              <h3 className="font-extrabold text-riwaq-brown">ملاحظات العميل</h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-riwaq-muted">
                {reservation.customerNotes}
              </p>
            </section>
          ) : null}

          <section>
            <h3 className="font-extrabold text-riwaq-brown">خدمات مطلوبة مع الطاولة</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {requested.length === 0 ? (
                <span className="text-xs font-bold text-riwaq-muted">لا توجد طلبات خدمات إضافية.</span>
              ) : (
                requested.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-riwaq-brown/10 px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-brown/15"
                  >
                    {TABLE_SERVICE_LABELS[s]}
                  </span>
                ))
              )}
            </div>
          </section>

          {table ? (
            <section className="rounded-3xl border border-riwaq-caramel/25 bg-linear-to-bl from-riwaq-caramel/10 via-white to-riwaq-cream/40 p-4 ring-1 ring-riwaq-caramel/15">
              <h3 className="flex items-center gap-2 font-extrabold text-riwaq-brown">
                <Star className="h-5 w-5 text-riwaq-caramel" aria-hidden />
                الطاولة المختارة — تشغيل
              </h3>
              <p className="mt-2 text-sm font-bold text-riwaq-muted">{table.displayName}</p>
              <p className="mt-3 text-xs font-bold text-riwaq-muted">{table.description}</p>
              {table.offer?.active ? (
                <div className="mt-4 rounded-2xl bg-white/90 p-3 ring-1 ring-riwaq-beige">
                  <p className="text-[11px] font-extrabold text-riwaq-caramel">
                    {OFFER_KIND_LABELS_AR[table.offer.kind]}
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-riwaq-brown">{table.offer.titleAr}</p>
                  <p className="mt-1 text-[11px] font-bold text-riwaq-muted">المدة: {table.offer.durationAr}</p>
                  <p className="mt-2 text-[11px] font-bold leading-relaxed text-riwaq-muted">
                    الشروط: {table.offer.termsAr}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs font-bold text-riwaq-muted">لا يوجد عرض نشط على الطاولة.</p>
              )}
              <div className="mt-4 rounded-2xl bg-white/90 p-3 ring-1 ring-riwaq-beige">
                <p className="flex items-center gap-2 text-[11px] font-extrabold text-riwaq-brown">
                  <Sparkles className="h-4 w-4 text-riwaq-green" aria-hidden />
                  نقاط ولاء متوقعة من الحجز (تقدير وهمي)
                </p>
                <ul className="mt-2 space-y-1 text-[11px] font-bold text-riwaq-muted">
                  <li>
                    أساسية:{" "}
                    <span className="font-extrabold text-riwaq-brown">
                      {table.loyalty.baseBooking.toLocaleString("ar-SA")}
                    </span>
                  </li>
                  <li>
                    توثيق التجربة: +{table.loyalty.documentationBonus.toLocaleString("ar-SA")}
                  </li>
                  <li>
                    نشر المنشور المعتمد: +{table.loyalty.publishBonus.toLocaleString("ar-SA")}
                  </li>
                  <li>
                    تجاوز {table.loyalty.viewsThreshold.toLocaleString("ar-SA")} مشاهدة: +
                    {table.loyalty.viewsBonus.toLocaleString("ar-SA")}
                  </li>
                </ul>
                {reservation.loyaltyPreview?.linked ? (
                  <p className="mt-3 rounded-xl bg-riwaq-green/10 px-3 py-2 text-[11px] font-extrabold leading-relaxed text-riwaq-green ring-1 ring-riwaq-green/20">
                    {reservation.loyaltyPreview.summaryAr}
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {reservation.linkedOrder ? (
            <section>
              <h3 className="font-extrabold text-riwaq-brown">طلب مرتبط</h3>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {reservation.linkedOrder.lines.map((l) => (
                  <ReservationLinkedThumb key={l.id} name={l.name} qty={l.qty} variant={l.imageVariant} />
                ))}
              </div>
              <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-riwaq-brown ring-1 ring-riwaq-beige">
                {formatSar(reservation.linkedOrder.total)} · {reservation.linkedOrder.orderWorkflowStatus} ·{" "}
                {reservation.linkedOrder.paymentStatus}
              </p>
            </section>
          ) : null}

          <section>
            <h3 className="mb-3 flex items-center gap-2 font-extrabold text-riwaq-brown">
              <Clock className="h-5 w-5 text-riwaq-caramel" aria-hidden />
              Timeline الحجز
            </h3>
            <ol className="relative space-y-0 border-e-2 border-riwaq-beige pe-4">
              {STEP_FLOW.map((step) => {
                const entry = reservation.timeline.find((t) => t.step === step);
                const done = reached(step);
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
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[11px] font-bold text-riwaq-muted">لم يُسجَّل</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </aside>
    </>
  );
}
