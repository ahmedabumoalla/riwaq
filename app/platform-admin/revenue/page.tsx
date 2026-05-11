import {
  contentRevenueRows,
  customerRewardPayouts,
  manualPayments,
  revenueKpis,
  revenueSeries,
  subscriptionInvoices,
} from "@/lib/mock/platform-admin";

function fmt(n: number) {
  return n.toLocaleString("ar-SA", { maximumFractionDigits: 0 });
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-riwaq-beige bg-white p-4 shadow-sm">
      <p className="text-[11px] font-extrabold text-riwaq-muted">{label}</p>
      <p className="mt-2 text-lg font-extrabold text-riwaq-brown sm:text-xl">{value}</p>
    </div>
  );
}

export default function PlatformAdminRevenuePage() {
  const k = revenueKpis;
  const maxStack = Math.max(...revenueSeries.map((r) => r.subscriptions + r.content + r.fees), 1);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <p className="text-sm font-bold text-riwaq-muted">
        إيرادات من اشتراكات الكافيهات، محتوى العملاء، ورسوم إضافية — بيانات تجريبية.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="MRR (ر.س)" value={fmt(k.mrr)} />
        <Kpi label="ARR (ر.س)" value={fmt(k.arr)} />
        <Kpi label="إجمالي المدفوعات" value={fmt(k.totalPayments)} />
        <Kpi label="إجمالي المتأخرات" value={fmt(k.totalArrears)} />
        <Kpi label="متوسط قيمة الاشتراك" value={`${fmt(k.avgSubscriptionValue)} ر.س`} />
        <Kpi label="أفضل باقة مبيعًا" value="Professional" />
        <Kpi label="أعلى كوفي دفعًا" value={k.topPayingCafe} />
        <Kpi label="أعلى حملة محتوى ربحًا" value={k.topContentCampaign} />
      </div>

      <section className="rounded-3xl border border-riwaq-beige bg-white p-5 shadow-sm">
        <h3 className="text-base font-extrabold text-riwaq-brown">تقسيم الإيراد الشهري (وهمي)</h3>
        <div className="mt-4 flex h-48 items-stretch justify-between gap-2 border-b border-riwaq-beige/80 pb-1">
          {revenueSeries.map((r) => {
            const hSub = (r.subscriptions / maxStack) * 100;
            const hCon = (r.content / maxStack) * 100;
            const hFee = (r.fees / maxStack) * 100;
            return (
              <div key={r.month} className="flex h-full min-h-0 flex-1 flex-col items-center gap-2">
                <div className="flex w-full max-w-[48px] flex-1 min-h-0 flex-col justify-end gap-0.5 sm:max-w-none">
                  <div className="w-full rounded-b-md bg-riwaq-brown" style={{ height: `${hSub}%`, minHeight: hSub ? 4 : 0 }} />
                  <div className="w-full bg-riwaq-caramel" style={{ height: `${hCon}%`, minHeight: hCon ? 4 : 0 }} />
                  <div className="w-full rounded-t-md bg-riwaq-green" style={{ height: `${hFee}%`, minHeight: hFee ? 4 : 0 }} />
                </div>
                <span className="text-[10px] font-extrabold text-riwaq-muted">{r.month}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs font-bold text-riwaq-muted">أسفل: اشتراكات · وسط: محتوى · أعلى: رسوم</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-riwaq-beige bg-white shadow-sm">
          <h4 className="border-b border-riwaq-beige bg-riwaq-cream/50 px-4 py-3 text-sm font-extrabold">فواتير الاشتراكات</h4>
          <table className="w-full text-right text-xs">
            <thead className="text-[10px] font-extrabold text-riwaq-muted">
              <tr>
                <th className="px-3 py-2">رقم</th>
                <th className="px-3 py-2">كوفي</th>
                <th className="px-3 py-2">مبلغ</th>
                <th className="px-3 py-2">تاريخ</th>
                <th className="px-3 py-2">حالة</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionInvoices.map((r) => (
                <tr key={r.id} className="border-t border-riwaq-beige/60 font-bold">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.cafeName}</td>
                  <td className="px-3 py-2">{fmt(r.amount)}</td>
                  <td className="px-3 py-2">{r.issuedAt}</td>
                  <td className="px-3 py-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-3xl border border-riwaq-beige bg-white shadow-sm">
          <h4 className="border-b border-riwaq-beige bg-riwaq-cream/50 px-4 py-3 text-sm font-extrabold">دفعات يدوية</h4>
          <table className="w-full text-right text-xs">
            <thead className="text-[10px] font-extrabold text-riwaq-muted">
              <tr>
                <th className="px-3 py-2">مرجع</th>
                <th className="px-3 py-2">كوفي</th>
                <th className="px-3 py-2">مبلغ</th>
                <th className="px-3 py-2">تاريخ</th>
              </tr>
            </thead>
            <tbody>
              {manualPayments.map((r) => (
                <tr key={r.id} className="border-t border-riwaq-beige/60 font-bold">
                  <td className="px-3 py-2">{r.reference}</td>
                  <td className="px-3 py-2">{r.cafeName}</td>
                  <td className="px-3 py-2">{fmt(r.amount)}</td>
                  <td className="px-3 py-2">{r.recordedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-3xl border border-riwaq-beige bg-white shadow-sm">
          <h4 className="border-b border-riwaq-beige bg-riwaq-cream/50 px-4 py-3 text-sm font-extrabold">إيرادات المحتوى</h4>
          <table className="w-full text-right text-xs">
            <thead className="text-[10px] font-extrabold text-riwaq-muted">
              <tr>
                <th className="px-3 py-2">منشور</th>
                <th className="px-3 py-2">كوفي</th>
                <th className="px-3 py-2">حصة المنصة</th>
                <th className="px-3 py-2">فترة</th>
              </tr>
            </thead>
            <tbody>
              {contentRevenueRows.map((r) => (
                <tr key={r.id} className="border-t border-riwaq-beige/60 font-bold">
                  <td className="px-3 py-2">{r.postId}</td>
                  <td className="px-3 py-2">{r.cafeName}</td>
                  <td className="px-3 py-2">{fmt(r.platformShare)}</td>
                  <td className="px-3 py-2">{r.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-3xl border border-riwaq-beige bg-white shadow-sm">
          <h4 className="border-b border-riwaq-beige bg-riwaq-cream/50 px-4 py-3 text-sm font-extrabold">مكافآت العملاء</h4>
          <table className="w-full text-right text-xs">
            <thead className="text-[10px] font-extrabold text-riwaq-muted">
              <tr>
                <th className="px-3 py-2">عميل</th>
                <th className="px-3 py-2">مبلغ</th>
                <th className="px-3 py-2">حالة</th>
                <th className="px-3 py-2">تاريخ</th>
              </tr>
            </thead>
            <tbody>
              {customerRewardPayouts.map((r) => (
                <tr key={r.id} className="border-t border-riwaq-beige/60 font-bold">
                  <td className="px-3 py-2">{r.customerName}</td>
                  <td className="px-3 py-2">{fmt(r.amount)}</td>
                  <td className="px-3 py-2">{r.status}</td>
                  <td className="px-3 py-2">{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="rounded-3xl border border-riwaq-beige bg-linear-to-l from-emerald-50 to-white p-5 shadow-sm">
        <p className="text-sm font-extrabold text-riwaq-brown">صافي الإيراد (تقدير تجريبي)</p>
        <p className="mt-2 text-3xl font-extrabold text-riwaq-green">{fmt(k.totalPayments - k.totalArrears)} ر.س</p>
      </div>
    </div>
  );
}
