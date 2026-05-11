"use client";

import { Gift, TrendingUp } from "lucide-react";
import { useCustomerSession } from "@/components/customer/customer-session-context";
import { loyaltyProgressMock } from "@/lib/mock/customer-app";

export function CustomerLoyaltyView() {
  const l = loyaltyProgressMock;
  const { loyaltyPoints } = useCustomerSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-extrabold text-2xl text-riwaq-brown">نقاطي والولاء</h1>
        <p className="mt-1 text-sm font-bold text-riwaq-muted">الرصيد من قاعدة البيانات؛ أدناه سجل عرضي حتى ربط الجداول</p>
      </div>

      <section className="rounded-[1.75rem] bg-linear-to-bl from-riwaq-brown via-[#402617] to-riwaq-caramel p-6 text-white shadow-2xl ring-1 ring-white/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white/80">رصيد النقاط</p>
            <p className="mt-2 font-extrabold text-4xl tabular-nums">{loyaltyPoints.toLocaleString("ar-SA")}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-extrabold ring-1 ring-white/15">
              <TrendingUp className="h-4 w-4" aria-hidden />
              المستوى الحالي: {l.currentTier}
            </p>
          </div>
          <Gift className="h-14 w-14 shrink-0 text-white/25" aria-hidden />
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-xs font-extrabold text-white/80">
            <span>التقدم إلى {l.nextTier}</span>
            <span className="tabular-nums">{l.pct.toLocaleString("ar-SA")}٪</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-white/90" style={{ width: `${l.pct}%` }} />
          </div>
          <p className="mt-3 text-[11px] font-bold text-white/75">
            عرض تقدّم المستوى — يُحسب لاحقًا من قواعد الولاء في قاعدة البيانات
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-lg ring-1 ring-riwaq-beige/90">
        <h2 className="font-extrabold text-lg text-riwaq-brown">أين جاءت نقاطك مؤخرًا</h2>
        <ul className="mt-4 divide-y divide-riwaq-beige/80">
          {l.ledger.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3 py-4 text-sm font-bold">
              <span className="text-riwaq-muted">{row.label}</span>
              <span className="font-extrabold tabular-nums text-riwaq-green">
                +{row.pts.toLocaleString("ar-SA")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-lg ring-1 ring-riwaq-beige/90">
        <h2 className="font-extrabold text-lg text-riwaq-brown">قواعد الولاء</h2>
        <ul className="mt-4 space-y-3">
          {l.rules.map((r) => (
            <li key={r} className="rounded-2xl bg-riwaq-cream/60 px-4 py-3 text-sm font-bold text-riwaq-muted ring-1 ring-riwaq-beige">
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-dashed border-riwaq-caramel/40 bg-riwaq-caramel/8 px-5 py-4 text-sm font-bold text-riwaq-brown">
        المكافآت القابلة للاستبدال تظهر في صفحة «مكافآتي». ربط المحفظة والـ API لاحقًا.
      </section>
    </div>
  );
}
