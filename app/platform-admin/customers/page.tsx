"use client";

import { CUSTOMER_STATUS_LABELS_AR, platformCustomers, type CustomerIntelStatus } from "@/lib/mock/platform-admin";

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

function statusBadge(s: CustomerIntelStatus) {
  const map: Record<CustomerIntelStatus, string> = {
    active: "bg-emerald-100 text-emerald-900",
    high_impact: "bg-violet-100 text-violet-900",
    needs_review: "bg-amber-100 text-amber-900",
    banned: "bg-neutral-800 text-white",
  };
  return map[s];
}

function act(label: string) {
  return () => window.alert(`تجريبي: ${label}`);
}

export default function PlatformAdminCustomersPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <p className="text-sm font-bold text-riwaq-muted">ذكاء موحّد لكل عميل عبر المنصة والكافيهات.</p>

      <div className="overflow-x-auto rounded-3xl border border-riwaq-beige bg-white shadow-sm">
        <table className="w-full min-w-[1100px] text-right text-xs">
          <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-[10px] font-extrabold text-riwaq-muted">
            <tr>
              <th className="px-3 py-3">العميل</th>
              <th className="px-3 py-3">تواصل</th>
              <th className="px-3 py-3">تسجيل</th>
              <th className="px-3 py-3">كافيهات</th>
              <th className="px-3 py-3">طلبات</th>
              <th className="px-3 py-3">إنفاق</th>
              <th className="px-3 py-3">منشورات</th>
              <th className="px-3 py-3">مشاهدات</th>
              <th className="px-3 py-3">مكافآت</th>
              <th className="px-3 py-3">حالة</th>
              <th className="px-3 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {platformCustomers.map((u) => (
              <tr key={u.id} className="border-b border-riwaq-beige/70 font-bold last:border-0 hover:bg-riwaq-cream/30">
                <td className="px-3 py-3">{u.fullName}</td>
                <td className="px-3 py-3">
                  <div className="max-w-[120px] truncate">{u.email}</div>
                  <div className="text-[11px] text-riwaq-muted">{u.phone}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{u.registeredAt}</td>
                <td className="px-3 py-3">{fmt(u.cafesVisited)}</td>
                <td className="px-3 py-3">{fmt(u.ordersCount)}</td>
                <td className="px-3 py-3">{fmt(u.totalSpend)} ر.س</td>
                <td className="px-3 py-3">{fmt(u.postsCount)}</td>
                <td className="px-3 py-3">{fmt(u.viewsTotal)}</td>
                <td className="px-3 py-3 text-[11px]">
                  مستحقة {fmt(u.rewardsDue)} / مدفوعة {fmt(u.rewardsPaid)}
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold ${statusBadge(u.status)}`}>
                    {CUSTOMER_STATUS_LABELS_AR[u.status]}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex flex-wrap gap-1">
                    <button type="button" onClick={act("تفاصيل")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      تفاصيل
                    </button>
                    <button type="button" onClick={act("مراجعة منشورات")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      منشورات
                    </button>
                    <button type="button" onClick={act("حظر")} className="rounded-xl border border-red-200 px-2 py-1 text-[10px] font-extrabold text-red-800 hover:bg-red-50">
                      حظر
                    </button>
                    <button type="button" onClick={act("رفع للمراجعة")} className="rounded-xl border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      مراجعة
                    </button>
                    <button type="button" onClick={act("صرف مكافأة")} className="rounded-xl border border-riwaq-green/40 px-2 py-1 text-[10px] font-extrabold text-riwaq-green hover:bg-emerald-50">
                      صرف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
