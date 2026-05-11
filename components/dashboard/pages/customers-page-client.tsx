"use client";

import { Crown, Search, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { CustomerDetailDrawer } from "@/components/dashboard/customers/customer-detail-drawer";
import {
  cafeCustomersMock,
  customerDetailMock,
  customerIntelSummary,
  type CafeCustomerRow,
} from "@/lib/mock/dashboard-customers-intelligence";
import { formatSar } from "@/lib/format";

function TierBadge({ tier }: { tier: CafeCustomerRow["tier"] }) {
  const cls =
    tier === "نخبة"
      ? "bg-riwaq-brown text-white ring-riwaq-brown"
      : tier === "ذهبي"
        ? "bg-riwaq-caramel/20 text-riwaq-brown ring-riwaq-caramel/35"
        : tier === "فضي"
          ? "bg-slate-100 text-slate-800 ring-slate-200"
          : "bg-white text-riwaq-brown ring-riwaq-beige";
  return <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ring-1 ${cls}`}>{tier}</span>;
}

export function CustomersPageClient() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return cafeCustomersMock;
    return cafeCustomersMock.filter(
      (c) =>
        c.name.includes(q.trim()) ||
        c.phone.replace(/\s/g, "").includes(n.replace(/\s/g, "")) ||
        c.id.includes(n),
    );
  }, [q]);

  const selectedRow = selectedId ? cafeCustomersMock.find((c) => c.id === selectedId) ?? null : null;
  const detail = selectedId ? customerDetailMock(selectedId) : null;

  const s = customerIntelSummary;

  return (
    <div className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/85 bg-white/65 p-5 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/90">
          <p className="text-xs font-extrabold text-riwaq-muted">Customer Intelligence Center</p>
          <h2 className="mt-1 font-extrabold text-2xl text-riwaq-brown">ذكاء العملاء والسلوك</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold text-riwaq-muted leading-relaxed">
            لوحة للفرق التشغيلية والتسويق — تعرض ملخصًا تنفيذيًا وجدولًا غنيًا لكل عميل مع درج تفاصيل كامل (وهمي).
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="ملخص العملاء">
          {[
            { label: "إجمالي العملاء", value: s.total.toLocaleString("ar-SA"), icon: Users },
            { label: "نشطون", value: s.active.toLocaleString("ar-SA"), icon: TrendingUp },
            { label: "VIP / نخبة وذهبي", value: s.vip.toLocaleString("ar-SA"), icon: Crown },
            { label: "غير نشطين", value: s.inactive.toLocaleString("ar-SA"), icon: Users },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-3xl border border-white/85 bg-white/70 p-4 shadow-md ring-1 ring-riwaq-beige/90"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold text-riwaq-muted">{card.label}</p>
                  <p className="mt-2 font-extrabold text-2xl tabular-nums text-riwaq-brown">{card.value}</p>
                </div>
                <card.icon className="h-6 w-6 shrink-0 text-riwaq-caramel" aria-hidden />
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-3 lg:grid-cols-3">
          <article className="rounded-3xl border border-riwaq-green/25 bg-linear-to-br from-riwaq-green/12 via-white to-riwaq-cream/40 p-5 ring-1 ring-riwaq-green/15 lg:col-span-1">
            <p className="text-xs font-extrabold text-riwaq-muted">متوسط قيمة العميل</p>
            <p className="mt-2 font-extrabold text-3xl tabular-nums text-riwaq-brown">{formatSar(s.avgValue)}</p>
            <p className="mt-2 text-xs font-bold text-riwaq-muted">آخر ٩٠ يومًا — تقدير تشغيلي</p>
          </article>
          <article className="rounded-3xl border border-white/85 bg-white/70 p-5 shadow-md ring-1 ring-riwaq-beige/90 lg:col-span-1">
            <p className="text-xs font-extrabold text-riwaq-muted">أكثر العملاء زيارة</p>
            <p className="mt-2 font-extrabold text-xl text-riwaq-brown">{s.topVisitName}</p>
          </article>
          <article className="rounded-3xl border border-white/85 bg-white/70 p-5 shadow-md ring-1 ring-riwaq-beige/90 lg:col-span-1">
            <p className="text-xs font-extrabold text-riwaq-muted">أكثر العملاء توثيقًا</p>
            <p className="mt-2 font-extrabold text-xl text-riwaq-brown">{s.topDocName}</p>
          </article>
        </section>

        <section className="rounded-3xl border border-white/85 bg-white/65 shadow-xl ring-1 ring-riwaq-beige/90">
          <div className="flex flex-col gap-3 border-b border-riwaq-beige/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-extrabold text-lg text-riwaq-brown">سجل العملاء</h3>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-riwaq-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="بحث بالاسم أو الجوال..."
                className="w-full rounded-2xl border border-riwaq-beige bg-white py-2.5 pr-10 pl-3 text-sm font-bold outline-none ring-riwaq-caramel/25 focus:ring-2"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-sm">
              <thead className="bg-riwaq-cream/60 text-[11px] font-extrabold text-riwaq-muted">
                <tr className="text-start">
                  <th className="px-4 py-3">العميل</th>
                  <th className="px-4 py-3">الجوال</th>
                  <th className="px-4 py-3">المستوى</th>
                  <th className="px-4 py-3">النقاط</th>
                  <th className="px-4 py-3">طلبات</th>
                  <th className="px-4 py-3">حجوزات</th>
                  <th className="px-4 py-3">إنفاق</th>
                  <th className="px-4 py-3">آخر زيارة</th>
                  <th className="px-4 py-3">أكثر منتج</th>
                  <th className="px-4 py-3">أكثر طاولة</th>
                  <th className="px-4 py-3">منشورات</th>
                  <th className="px-4 py-3">مشاهدات</th>
                  <th className="px-4 py-3">مكافآت</th>
                  <th className="px-4 py-3"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-riwaq-beige/80 font-bold">
                {filtered.map((c) => (
                  <tr key={c.id} className="text-riwaq-brown hover:bg-riwaq-cream/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-riwaq-brown text-[11px] font-extrabold text-white">
                          {c.initials}
                        </span>
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-riwaq-muted">{c.phone}</td>
                    <td className="px-4 py-3">
                      <TierBadge tier={c.tier} />
                    </td>
                    <td className="px-4 py-3 tabular-nums">{c.points.toLocaleString("ar-SA")}</td>
                    <td className="px-4 py-3 tabular-nums">{c.ordersTotal.toLocaleString("ar-SA")}</td>
                    <td className="px-4 py-3 tabular-nums">{c.reservationsTotal.toLocaleString("ar-SA")}</td>
                    <td className="px-4 py-3 tabular-nums">{formatSar(c.spendTotal)}</td>
                    <td className="px-4 py-3 text-xs text-riwaq-muted">{c.lastVisit}</td>
                    <td className="px-4 py-3 text-xs">{c.topProduct}</td>
                    <td className="px-4 py-3 text-xs">{c.topTable}</td>
                    <td className="px-4 py-3 tabular-nums">{c.posts.toLocaleString("ar-SA")}</td>
                    <td className="px-4 py-3 tabular-nums">{c.views.toLocaleString("ar-SA")}</td>
                    <td className="px-4 py-3 tabular-nums">{c.rewardsEarned.toLocaleString("ar-SA")}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedId(c.id)}
                        className="rounded-xl bg-riwaq-brown px-3 py-2 text-[11px] font-extrabold text-white hover:brightness-105"
                      >
                        تفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <CustomerDetailDrawer open={selectedId !== null} row={selectedRow} detail={detail} onClose={() => setSelectedId(null)} />
    </div>
  );
}
