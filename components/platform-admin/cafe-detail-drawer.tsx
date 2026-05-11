"use client";

import { X } from "lucide-react";
import {
  CAFE_STATUS_LABELS_AR,
  PLAN_LABELS_AR,
  SUBSCRIPTION_LIFECYCLE_LABELS_AR,
  type PlatformCafe,
} from "@/lib/mock/platform-admin";

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ar-SA", { dateStyle: "medium" });
  } catch {
    return iso;
  }
}

type CafeDetailDrawerProps = {
  cafe: PlatformCafe | null;
  onClose: () => void;
};

export function CafeDetailDrawer({ cafe, onClose }: CafeDetailDrawerProps) {
  if (!cafe) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-start">
      <button type="button" className="absolute inset-0 bg-riwaq-brown/50 backdrop-blur-sm" aria-label="إغلاق" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cafe-drawer-title"
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-riwaq-beige bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-riwaq-beige px-5 py-4">
          <div className="min-w-0">
            <h2 id="cafe-drawer-title" className="truncate text-lg font-extrabold text-riwaq-brown">
              {cafe.name}
            </h2>
            <p className="mt-1 text-xs font-bold text-riwaq-muted">
              {CAFE_STATUS_LABELS_AR[cafe.cafeStatus]} · {SUBSCRIPTION_LIFECYCLE_LABELS_AR[cafe.subscriptionLifecycle]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-riwaq-muted hover:bg-riwaq-cream"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <section className="mb-6">
            <h3 className="text-xs font-extrabold text-riwaq-caramel">بيانات الكوفي</h3>
            <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 px-3 py-2">
                <dt className="text-[10px] font-extrabold text-riwaq-muted">المالك</dt>
                <dd className="font-bold text-riwaq-brown">{cafe.ownerName}</dd>
              </div>
              <div className="rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 px-3 py-2">
                <dt className="text-[10px] font-extrabold text-riwaq-muted">البريد</dt>
                <dd className="truncate font-bold text-riwaq-brown">{cafe.ownerEmail}</dd>
              </div>
              <div className="rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 px-3 py-2">
                <dt className="text-[10px] font-extrabold text-riwaq-muted">الجوال</dt>
                <dd className="font-bold text-riwaq-brown">{cafe.ownerPhone}</dd>
              </div>
              <div className="rounded-2xl border border-riwaq-beige bg-riwaq-cream/40 px-3 py-2">
                <dt className="text-[10px] font-extrabold text-riwaq-muted">الباقة</dt>
                <dd className="font-bold text-riwaq-brown">{PLAN_LABELS_AR[cafe.plan]}</dd>
              </div>
            </dl>
          </section>

          <section className="mb-6">
            <h3 className="text-xs font-extrabold text-riwaq-caramel">الفروع</h3>
            <ul className="mt-2 space-y-2">
              {cafe.branches.map((b) => (
                <li key={b.id} className="rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm font-bold">
                  {b.name} — {b.city}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="text-xs font-extrabold text-riwaq-caramel">ملخص تشغيلي</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              {[
                ["المنتجات", fmt(cafe.productsCount)],
                ["الطلبات", fmt(cafe.ordersCount)],
                ["الحجوزات", fmt(cafe.reservationsCount)],
                ["الطاولات", fmt(cafe.tablesCount)],
                ["الموظفون", fmt(cafe.employeesCount)],
                ["العملاء", fmt(cafe.customersCount)],
                ["الحملات", fmt(cafe.campaignsCount)],
                ["منشورات العملاء", fmt(cafe.customerPostsCount)],
                ["المشاهدات", fmt(cafe.viewsTotal)],
                ["التفاعل", fmt(cafe.engagementTotal)],
                ["المبيعات", `${fmt(cafe.totalSales)} ر.س`],
                ["آخر نشاط", fmtDate(cafe.lastActivityAt)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-riwaq-beige/80 bg-riwaq-cream/30 px-2 py-2">
                  <p className="font-extrabold text-riwaq-muted">{k}</p>
                  <p className="mt-0.5 font-extrabold text-riwaq-brown">{v}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-xs font-extrabold text-riwaq-caramel">الاشتراك والفواتير</h3>
            <p className="mt-2 text-sm font-bold text-riwaq-brown">
              من {fmtDate(cafe.subscriptionStart)} إلى {fmtDate(cafe.subscriptionEnd)} — {fmt(cafe.monthlyPrice)} ر.س / شهر
            </p>
            <p className="mt-2 text-xs text-riwaq-muted">قائمة فواتير وهمية مرتبطة بـ subscription_id في المستقبل.</p>
          </section>

          <section>
            <h3 className="text-xs font-extrabold text-riwaq-caramel">ملاحظات داخلية</h3>
            <p className="mt-2 rounded-2xl border border-riwaq-beige bg-amber-50/80 p-3 text-sm font-bold text-riwaq-brown">
              {cafe.internalNotes}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
