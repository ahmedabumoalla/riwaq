"use client";

import { useState } from "react";
import { Eye, PauseCircle, PlayCircle, CalendarClock, Package, BarChart2, LogIn } from "lucide-react";
import { CafeDetailDrawer } from "@/components/platform-admin/cafe-detail-drawer";
import {
  CAFE_STATUS_LABELS_AR,
  PLAN_LABELS_AR,
  SUBSCRIPTION_LIFECYCLE_LABELS_AR,
  platformCafes,
  type PlatformCafe,
} from "@/lib/mock/platform-admin";

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

function badgeClass(status: PlatformCafe["cafeStatus"]) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-900";
    case "suspended":
      return "bg-neutral-200 text-neutral-800";
    case "review":
      return "bg-amber-100 text-amber-900";
    case "payment_late":
      return "bg-red-100 text-red-900";
    default:
      return "bg-riwaq-beige text-riwaq-brown";
  }
}

function mockAction(label: string) {
  return () => {
    window.alert(`إجراء تجريبي: ${label}`);
  };
}

export default function PlatformAdminCafesPage() {
  const [selected, setSelected] = useState<PlatformCafe | null>(null);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <p className="text-sm font-bold text-riwaq-muted">
        إدارة شاملة لكل كوفي — بيانات وهمية. الدرج يعرض تفاصيل كاملة للمعاينة.
      </p>

      <div className="overflow-x-auto rounded-3xl border border-riwaq-beige bg-white shadow-sm">
        <table className="w-full min-w-[1200px] text-right text-xs">
          <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-[10px] font-extrabold uppercase tracking-wide text-riwaq-muted">
            <tr>
              <th className="px-3 py-3">الكوفي</th>
              <th className="px-3 py-3">المالك</th>
              <th className="px-3 py-3">التواصل</th>
              <th className="px-3 py-3">فروع</th>
              <th className="px-3 py-3">اشتراك</th>
              <th className="px-3 py-3">الباقة</th>
              <th className="px-3 py-3">شهري</th>
              <th className="px-3 py-3">مبيعات</th>
              <th className="px-3 py-3">طلبات</th>
              <th className="px-3 py-3">حجوزات</th>
              <th className="px-3 py-3">حالة</th>
              <th className="sticky start-0 z-10 bg-riwaq-cream/95 px-3 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {platformCafes.map((c) => (
              <tr key={c.id} className="border-b border-riwaq-beige/70 font-bold text-riwaq-brown last:border-0 hover:bg-riwaq-cream/30">
                <td className="px-3 py-3 whitespace-nowrap">{c.name}</td>
                <td className="px-3 py-3">{c.ownerName}</td>
                <td className="px-3 py-3">
                  <div className="max-w-[140px] truncate text-[11px] font-bold">{c.ownerEmail}</div>
                  <div className="text-[11px] text-riwaq-muted">{c.ownerPhone}</div>
                </td>
                <td className="px-3 py-3">{fmt(c.branchCount)}</td>
                <td className="px-3 py-3">
                  <span className="block text-[11px] text-riwaq-muted">{SUBSCRIPTION_LIFECYCLE_LABELS_AR[c.subscriptionLifecycle]}</span>
                  <span className="text-[10px] text-riwaq-muted">إلى {c.subscriptionEnd}</span>
                </td>
                <td className="px-3 py-3">{PLAN_LABELS_AR[c.plan]}</td>
                <td className="px-3 py-3">{fmt(c.monthlyPrice)}</td>
                <td className="px-3 py-3">{fmt(c.totalSales)}</td>
                <td className="px-3 py-3">{fmt(c.ordersCount)}</td>
                <td className="px-3 py-3">{fmt(c.reservationsCount)}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold ${badgeClass(c.cafeStatus)}`}>
                    {CAFE_STATUS_LABELS_AR[c.cafeStatus]}
                  </span>
                </td>
                <td className="sticky start-0 z-10 bg-white/95 px-2 py-2 backdrop-blur-sm">
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="inline-flex items-center gap-1 rounded-xl border border-riwaq-beige bg-white px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream"
                    >
                      <Eye className="h-3 w-3" /> تفاصيل
                    </button>
                    <button type="button" onClick={mockAction("إيقاف")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      <PauseCircle className="inline h-3 w-3" />
                    </button>
                    <button type="button" onClick={mockAction("تفعيل")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      <PlayCircle className="inline h-3 w-3" />
                    </button>
                    <button type="button" onClick={mockAction("تمديد")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      <CalendarClock className="inline h-3 w-3" />
                    </button>
                    <button type="button" onClick={mockAction("تغيير باقة")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      <Package className="inline h-3 w-3" />
                    </button>
                    <button type="button" onClick={mockAction("أداء")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      <BarChart2 className="inline h-3 w-3" />
                    </button>
                    <button type="button" onClick={mockAction("دخول كمالك read-only")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      <LogIn className="inline h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CafeDetailDrawer cafe={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
