"use client";

import { Gift, MessageSquare, Sparkles, X } from "lucide-react";
import type { CafeCustomerRow, CustomerDetailMock } from "@/lib/mock/dashboard-customers-intelligence";
import { formatSar } from "@/lib/format";

export function CustomerDetailDrawer({
  open,
  row,
  detail,
  onClose,
}: {
  open: boolean;
  row: CafeCustomerRow | null;
  detail: CustomerDetailMock | null;
  onClose: () => void;
}) {
  if (!open || !row || !detail) return null;

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
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-riwaq-brown to-[#2d1a10] text-lg font-extrabold text-white">
              {row.initials}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-riwaq-muted">ملف العميل</p>
              <p className="truncate font-extrabold text-xl text-riwaq-brown">{row.name}</p>
              <p className="mt-1 text-sm font-bold text-riwaq-muted">{row.phone}</p>
            </div>
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
          <section className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-riwaq-cream/60 p-3 ring-1 ring-riwaq-beige/80">
              <p className="text-[11px] font-extrabold text-riwaq-muted">المستوى</p>
              <p className="mt-1 font-extrabold text-riwaq-brown">{row.tier}</p>
            </div>
            <div className="rounded-2xl bg-riwaq-cream/60 p-3 ring-1 ring-riwaq-beige/80">
              <p className="text-[11px] font-extrabold text-riwaq-muted">النقاط</p>
              <p className="mt-1 font-extrabold tabular-nums text-riwaq-brown">
                {row.points.toLocaleString("ar-SA")}
              </p>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 font-extrabold text-riwaq-brown">
              <MessageSquare className="h-5 w-5 text-riwaq-caramel" aria-hidden />
              ملاحظات داخلية
            </h3>
            <ul className="mt-3 space-y-2">
              {detail.notes.map((n) => (
                <li key={n} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-riwaq-muted ring-1 ring-riwaq-beige">
                  {n}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-extrabold text-riwaq-brown">الطلبات الأخيرة</h3>
            <ul className="mt-3 divide-y divide-riwaq-beige rounded-2xl bg-riwaq-cream/40 ring-1 ring-riwaq-beige/80">
              {detail.orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-bold">
                  <span className="text-riwaq-muted">{o.id}</span>
                  <span className="tabular-nums font-extrabold text-riwaq-brown">{formatSar(o.total)}</span>
                  <span className="text-[11px] font-bold text-riwaq-muted">{o.date}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-extrabold text-riwaq-brown">الحجوزات</h3>
            <ul className="mt-3 space-y-2">
              {detail.reservations.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-muted"
                >
                  <span className="font-extrabold text-riwaq-brown">{r.id}</span> · {r.table} · {r.date}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="flex items-center gap-2 font-extrabold text-riwaq-brown">
              <Sparkles className="h-5 w-5 text-riwaq-green" aria-hidden />
              نقاط الولاء — السجل
            </h3>
            <ul className="mt-3 space-y-2">
              {detail.loyaltyLedger.map((l) => (
                <li
                  key={`${l.label}-${l.date}`}
                  className="flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold ring-1 ring-riwaq-beige"
                >
                  <span className="text-riwaq-muted">{l.label}</span>
                  <span className={l.pts < 0 ? "font-extrabold text-red-700" : "font-extrabold text-riwaq-green"}>
                    {l.pts > 0 ? "+" : ""}
                    {l.pts.toLocaleString("ar-SA")}
                  </span>
                  <span className="text-[11px] text-riwaq-muted">{l.date}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="flex items-center gap-2 font-extrabold text-riwaq-brown">
              <Gift className="h-5 w-5 text-riwaq-caramel" aria-hidden />
              المكافآت
            </h3>
            <ul className="mt-3 space-y-2">
              {detail.rewards.map((r) => (
                <li key={r} className="rounded-2xl bg-riwaq-green/10 px-4 py-3 text-sm font-bold text-riwaq-green ring-1 ring-riwaq-green/25">
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-extrabold text-riwaq-brown">منشورات التوثيق والتفاعل</h3>
            <ul className="mt-3 space-y-3">
              {detail.posts.map((p) => (
                <li key={p.title} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-riwaq-beige">
                  <p className="font-extrabold text-riwaq-brown">{p.title}</p>
                  <p className="mt-1 text-sm font-bold text-riwaq-muted">
                    {p.platform} · {p.views.toLocaleString("ar-SA")} مشاهدة
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}
