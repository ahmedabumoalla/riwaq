import {
  operationalAlerts,
  overview,
  revenueSeries,
  socialTopCustomers,
  subscriptionHealth,
  topCafes,
} from "@/lib/mock/platform-admin";

function fmt(n: number) {
  return n.toLocaleString("ar-SA", { maximumFractionDigits: n < 100 ? 1 : 0 });
}

function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-riwaq-beige/90 bg-white p-4 shadow-sm shadow-riwaq-brown/5">
      <p className="text-[11px] font-extrabold text-riwaq-muted">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-riwaq-brown sm:text-2xl">{value}</p>
      {sub ? <p className="mt-1 text-xs font-bold text-riwaq-green">{sub}</p> : null}
    </div>
  );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-extrabold text-riwaq-brown">{title}</h2>
      {desc ? <p className="text-sm font-bold text-riwaq-muted">{desc}</p> : null}
    </div>
  );
}

export default function PlatformAdminOverviewPage() {
  const o = overview;
  const maxStack = Math.max(
    ...revenueSeries.map((r) => r.subscriptions + r.content + r.fees),
    1
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div className="rounded-3xl border border-riwaq-beige bg-linear-to-l from-white to-riwaq-cream/50 p-5 shadow-md shadow-riwaq-brown/8 sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-riwaq-caramel">Executive</p>
        <h2 className="mt-1 text-2xl font-extrabold text-riwaq-brown">نظرة عامة على المنصة</h2>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-riwaq-muted">
          مؤشرات موحّدة للكافيهات، الاشتراكات، GMV، المحتوى، والمكافآت — بيانات تجريبية للعرض التنفيذي.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="إجمالي الكافيهات" value={fmt(o.totalCafes)} />
        <KpiCard label="الكافيهات النشطة" value={fmt(o.activeCafes)} />
        <KpiCard label="اشتراكات شهرية نشطة" value={fmt(o.activeMonthlySubscriptions)} />
        <KpiCard label="اشتراكات منتهية" value={fmt(o.expiredSubscriptions)} />
        <KpiCard label="MRR (ر.س)" value={fmt(o.mrr)} sub="إيراد اشتراكات متكرر" />
        <KpiCard label="GMV (ر.س)" value={fmt(o.gmv)} sub="إجمالي مبيعات الكافيهات" />
        <KpiCard label="إجمالي الطلبات" value={fmt(o.totalOrders)} />
        <KpiCard label="إجمالي الحجوزات" value={fmt(o.totalReservations)} />
        <KpiCard label="إجمالي العملاء" value={fmt(o.totalCustomers)} />
        <KpiCard label="منشورات العملاء" value={fmt(o.totalCustomerPosts)} />
        <KpiCard label="إجمالي المشاهدات" value={fmt(o.totalViews)} />
        <KpiCard label="إجمالي التفاعل" value={fmt(o.totalEngagement)} />
        <KpiCard label="عمولة / إيراد محتوى (ر.س)" value={fmt(o.contentCommissionRevenue)} />
        <KpiCard label="معدل النمو الشهري" value={`${fmt(o.monthlyGrowthRate)}٪`} />
      </div>

      <section>
        <SectionTitle title="أفضل الكافيهات" desc="حسب المبيعات والطلبات والمشاهدات" />
        <div className="overflow-hidden rounded-3xl border border-riwaq-beige bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="border-b border-riwaq-beige bg-riwaq-cream/50 text-xs font-extrabold text-riwaq-muted">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">الكوفي</th>
                <th className="px-4 py-3">المبيعات</th>
                <th className="px-4 py-3">الطلبات</th>
                <th className="px-4 py-3">المشاهدات</th>
              </tr>
            </thead>
            <tbody>
              {topCafes.map((c) => (
                <tr key={c.id} className="border-b border-riwaq-beige/60 font-bold text-riwaq-brown last:border-0">
                  <td className="px-4 py-3 text-riwaq-caramel">{c.rank}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{fmt(c.sales)} ر.س</td>
                  <td className="px-4 py-3">{fmt(c.orders)}</td>
                  <td className="px-4 py-3">{fmt(c.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionTitle title="صحة الاشتراكات" desc="توزيع الحالات التشغيلية" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(
            [
              ["نشط", subscriptionHealth.active, "bg-riwaq-green/90"],
              ["قارب على الانتهاء", subscriptionHealth.expiringSoon, "bg-riwaq-caramel"],
              ["متأخر في الدفع", subscriptionHealth.pastDue, "bg-red-600/90"],
              ["موقوف", subscriptionHealth.paused, "bg-riwaq-muted"],
              ["تجريبي", subscriptionHealth.trial, "bg-sky-600/85"],
            ] as const
          ).map(([label, count, bg]) => (
            <div
              key={label}
              className="flex flex-col justify-between rounded-3xl border border-riwaq-beige bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-extrabold text-riwaq-muted">{label}</p>
              <p className="mt-3 text-3xl font-extrabold text-riwaq-brown">{fmt(count)}</p>
              <div className={`mt-3 h-1.5 rounded-full ${bg}`} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="إيرادات المنصة" desc="رسم تكديسي وهمي — اشتراكات، محتوى، رسوم" />
        <div className="rounded-3xl border border-riwaq-beige bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-extrabold">
            <span className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full bg-riwaq-brown" /> اشتراكات
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full bg-riwaq-caramel" /> محتوى
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full bg-riwaq-green" /> رسوم
            </span>
          </div>
          <div className="flex h-52 items-stretch justify-between gap-2 border-b border-riwaq-beige/80 pb-1 pt-4">
            {revenueSeries.map((r) => {
              const hSub = (r.subscriptions / maxStack) * 100;
              const hCon = (r.content / maxStack) * 100;
              const hFee = (r.fees / maxStack) * 100;
              return (
                <div key={r.month} className="flex h-full min-h-0 flex-1 flex-col items-center gap-2">
                  <div className="flex w-full max-w-[52px] flex-1 min-h-0 flex-col justify-end gap-0.5 sm:max-w-none">
                    <div
                      className="w-full rounded-b-md bg-riwaq-brown transition-all"
                      style={{ height: `${hSub}%`, minHeight: hSub > 0 ? 4 : 0 }}
                      title={`اشتراكات: ${fmt(r.subscriptions)}`}
                    />
                    <div
                      className="w-full bg-riwaq-caramel transition-all"
                      style={{ height: `${hCon}%`, minHeight: hCon > 0 ? 4 : 0 }}
                      title={`محتوى: ${fmt(r.content)}`}
                    />
                    <div
                      className="w-full rounded-t-md bg-riwaq-green transition-all"
                      style={{ height: `${hFee}%`, minHeight: hFee > 0 ? 4 : 0 }}
                      title={`رسوم: ${fmt(r.fees)}`}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-riwaq-muted">{r.month}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs font-bold text-riwaq-muted">الإجمالي الشهري الأعلى: {fmt(maxStack)} ر.س (تقريبي)</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle title="أداء المحتوى" desc="أفضل العملاء — مشاهدات، تفاعل، مكافآت" />
          <div className="space-y-3">
            {socialTopCustomers.map((u, i) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 rounded-3xl border border-riwaq-beige bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-riwaq-brown text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-extrabold text-riwaq-brown">{u.name}</p>
                    <p className="text-xs font-bold text-riwaq-muted">
                      {fmt(u.views)} مشاهدة · {fmt(u.engagement)} تفاعل
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-extrabold text-riwaq-green">{fmt(u.rewardsEarned)} ر.س</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle title="تنبيهات تشغيلية" desc="متابعة استباقية" />
          <ul className="space-y-3">
            {operationalAlerts.map((a) => (
              <li
                key={a.id}
                className={[
                  "rounded-3xl border p-4 shadow-sm",
                  a.severity === "critical"
                    ? "border-red-200 bg-red-50/80"
                    : a.severity === "warning"
                      ? "border-amber-200 bg-amber-50/80"
                      : "border-sky-200 bg-sky-50/70",
                ].join(" ")}
              >
                <p className="text-sm font-extrabold text-riwaq-brown">{a.title}</p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-riwaq-muted">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
