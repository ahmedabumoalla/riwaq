"use client";

import { useEffect, useState } from "react";
import { PLAN_LABELS_AR, platformSubscriptions, type PlatformSubscriptionRow } from "@/lib/mock/platform-admin";

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

function act(label: string) {
  return () => window.alert(`تجريبي: ${label}`);
}

const sections: { title: string; filter: (s: PlatformSubscriptionRow) => boolean }[] = [
  { title: "الاشتراكات النشطة", filter: (s) => s.lifecycle === "active" },
  { title: "المنتهية", filter: (s) => s.lifecycle === "expired" },
  { title: "تنتهي خلال 7 أيام", filter: (s) => s.lifecycle === "expires_7d" },
  { title: "المتأخرة بالدفع", filter: (s) => s.lifecycle === "past_due" },
  { title: "التجريبية", filter: (s) => s.lifecycle === "trial" },
  { title: "الموقوفة", filter: (s) => s.lifecycle === "paused" },
];

export default function PlatformAdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(platformSubscriptions);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/platform-admin/subscriptions", { credentials: "include" })
      .then((r) => r.json())
      .then((j: { ok?: boolean; data?: PlatformSubscriptionRow[] }) => {
        if (cancelled || !j.ok || !Array.isArray(j.data)) return;
        setSubscriptions(j.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <p className="text-sm font-bold text-riwaq-muted">تجميع حسب دورة حياة الاشتراك — واجهة تحكم كاملة.</p>

      {sections.map(({ title, filter }) => {
        const list = subscriptions.filter(filter);
        if (list.length === 0) return null;
        return (
          <section key={title}>
            <h3 className="mb-3 text-base font-extrabold text-riwaq-brown">{title}</h3>
            <div className="overflow-x-auto rounded-3xl border border-riwaq-beige bg-white shadow-sm">
              <table className="w-full min-w-[960px] text-right text-xs">
                <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-[10px] font-extrabold text-riwaq-muted">
                  <tr>
                    <th className="px-3 py-3">الكوفي</th>
                    <th className="px-3 py-3">الباقة</th>
                    <th className="px-3 py-3">شهري</th>
                    <th className="px-3 py-3">البداية</th>
                    <th className="px-3 py-3">النهاية</th>
                    <th className="px-3 py-3">دفع</th>
                    <th className="px-3 py-3">طريقة</th>
                    <th className="px-3 py-3">آخر فاتورة</th>
                    <th className="px-3 py-3">مدفوع</th>
                    <th className="px-3 py-3">أيام متبقية</th>
                    <th className="px-3 py-3">ملاحظات</th>
                    <th className="px-3 py-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((s) => (
                    <tr key={s.id} className="border-b border-riwaq-beige/70 font-bold last:border-0 hover:bg-riwaq-cream/30">
                      <td className="px-3 py-3">{s.cafeName}</td>
                      <td className="px-3 py-3">{PLAN_LABELS_AR[s.plan]}</td>
                      <td className="px-3 py-3">{fmt(s.monthlyPrice)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{s.startDate}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{s.endDate}</td>
                      <td className="px-3 py-3">{s.paymentStatus === "paid" ? "مسدد" : s.paymentStatus === "pending" ? "معلق" : "فشل"}</td>
                      <td className="px-3 py-3 text-[11px]">{s.paymentMethod}</td>
                      <td className="px-3 py-3">{s.lastInvoiceId}</td>
                      <td className="px-3 py-3">{fmt(s.totalPaid)}</td>
                      <td className="px-3 py-3">{fmt(s.daysRemaining)}</td>
                      <td className="px-3 py-3 max-w-[140px] truncate text-[11px] text-riwaq-muted">{s.notes}</td>
                      <td className="px-2 py-2">
                        <div className="flex flex-wrap gap-1">
                          <button type="button" onClick={act("+ شهر")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                            + شهر
                          </button>
                          <button type="button" onClick={act("+ 3 أشهر")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                            + 3ش
                          </button>
                          <button type="button" onClick={act("إيقاف")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                            إيقاف
                          </button>
                          <button type="button" onClick={act("تفعيل")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                            تفعيل
                          </button>
                          <button type="button" onClick={act("باقة")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                            باقة
                          </button>
                          <button type="button" onClick={act("دفعة يدوية")} className="rounded-lg border border-riwaq-green/40 px-2 py-1 text-[10px] font-extrabold text-riwaq-green hover:bg-emerald-50">
                            دفعة
                          </button>
                          <button type="button" onClick={act("فاتورة")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                            فاتورة
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
