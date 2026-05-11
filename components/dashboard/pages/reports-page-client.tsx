"use client";

import { useMemo, useState } from "react";
import { reportKpis, reportTabs, type ReportTab } from "@/lib/mock/dashboard-reports";
import { formatSar } from "@/lib/format";

function BarRow({ label, pct, tone }: { label: string; pct: number; tone?: "green" | "caramel" | "brown" }) {
  const fill =
    tone === "caramel"
      ? "bg-riwaq-caramel"
      : tone === "brown"
        ? "bg-riwaq-brown"
        : "bg-riwaq-green";
  return (
    <div>
      <div className="flex justify-between gap-2 text-[11px] font-extrabold text-riwaq-muted">
        <span className="min-w-0 truncate">{label}</span>
        <span className="tabular-nums shrink-0">{pct.toLocaleString("ar-SA")}٪</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-riwaq-beige">
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${Math.min(100, Math.max(4, pct))}%` }} />
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/85 bg-white/70 p-5 shadow-md ring-1 ring-riwaq-beige/90">
      <h3 className="font-extrabold text-riwaq-brown">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function ReportsPageClient() {
  const [tab, setTab] = useState<ReportTab>("sales");
  const k = reportKpis;

  const tabHint = useMemo(() => {
    const map: Record<ReportTab, string> = {
      sales: "إيرادات الفترة ومؤشرات السلة",
      products: "أداء الأصناف والذروة",
      reservations: "قبول الحجوزات والرفض",
      tables: "طاولات مرتفع الطلب",
      loyalty: "استهلاك النقاط وسلوك الاستبدال",
      campaigns: "التحويل من المحتوى والعروض",
      employees: "سرعة التجهيز والالتزام بالشفت",
      customers: "أعلى قيمة ورقي الشرائح",
    };
    return map[tab];
  }, [tab]);

  return (
    <div className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/85 bg-white/65 p-5 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/90">
          <p className="text-xs font-extrabold text-riwaq-muted">Reports Suite — وهمي</p>
          <h2 className="mt-1 font-extrabold text-2xl text-riwaq-brown">التقارير التشغيلية</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold text-riwaq-muted leading-relaxed">{tabHint}</p>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {reportTabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={[
                  "shrink-0 rounded-2xl px-4 py-2.5 text-sm font-extrabold transition",
                  active
                    ? "bg-riwaq-brown text-white shadow-md"
                    : "bg-white/80 text-riwaq-brown ring-1 ring-riwaq-beige hover:bg-riwaq-cream/80",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <section className="grid gap-4 lg:grid-cols-4" aria-label="مؤشرات رئيسية للتقرير">
          {[
            { label: "الإيرادات", value: formatSar(k.revenue) },
            { label: "متوسط قيمة الطلب", value: formatSar(k.aov) },
            { label: "ذروة اليوم", value: k.peakHour },
            { label: "متوسط التجهيز", value: `${k.avgPrepMin.toLocaleString("ar-SA")} د` },
          ].map((x) => (
            <article key={x.label} className="rounded-3xl bg-linear-to-br from-white/95 to-riwaq-cream/50 p-4 ring-1 ring-riwaq-beige/90">
              <p className="text-[11px] font-extrabold text-riwaq-muted">{x.label}</p>
              <p className="mt-2 font-extrabold text-xl text-riwaq-brown">{x.value}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="توزيع أداء مختار (أشرطة نسبية)">
            {tab === "sales" && (
              <>
                <BarRow label="المبيعات داخل الصالة" pct={58} />
                <BarRow label="طلبات الاستلام" pct={34} tone="caramel" />
                <BarRow label="خدمات الحجز المرتبطة" pct={22} tone="brown" />
              </>
            )}
            {tab === "products" && (
              <>
                <BarRow label={k.topSkus[0] ?? ""} pct={92} />
                <BarRow label={k.topSkus[1] ?? ""} pct={74} tone="caramel" />
                <BarRow label={k.topSkus[2] ?? ""} pct={61} tone="brown" />
              </>
            )}
            {tab === "reservations" && (
              <>
                <BarRow label="قبول تلقائي" pct={88} />
                <BarRow label="قبول بعد مراجعة" pct={72} tone="caramel" />
                <BarRow label="رفض أو إعادة جدولة" pct={28} tone="brown" />
              </>
            )}
            {tab === "tables" && (
              <>
                <BarRow label={k.topTables[0] ?? ""} pct={95} />
                <BarRow label={k.topTables[1] ?? ""} pct={81} tone="caramel" />
                <BarRow label={k.topTables[2] ?? ""} pct={66} tone="brown" />
              </>
            )}
            {tab === "loyalty" && (
              <>
                <BarRow label="نقاط من الطلبات" pct={70} />
                <BarRow label="نقاط من الحجوزات" pct={54} tone="caramel" />
                <BarRow label="نقاط من التوثيق" pct={46} tone="brown" />
              </>
            )}
            {tab === "campaigns" && (
              <>
                <BarRow label="حملات السوشال" pct={76} />
                <BarRow label="عروض الطاولات" pct={63} tone="caramel" />
                <BarRow label="مسوّقي المحتوى" pct={58} tone="brown" />
              </>
            )}
            {tab === "employees" && (
              <>
                <BarRow label="التزام الشفت" pct={91} />
                <BarRow label="سرعة نقاط البيع" pct={84} tone="caramel" />
                <BarRow label="جودة التجهيز" pct={79} tone="brown" />
              </>
            )}
            {tab === "customers" && (
              <>
                <BarRow label="عملاء متكررون أسبوعيًا" pct={68} />
                <BarRow label="عملاء توثيق عالي" pct={42} tone="caramel" />
                <BarRow label="جدد بحجم سلة أعلى" pct={36} tone="brown" />
              </>
            )}
          </Panel>

          <Panel title="مؤشرات جودة وتشغيل">
            <div className="space-y-3 text-sm font-bold text-riwaq-muted">
              <div className="flex justify-between gap-3 rounded-2xl bg-riwaq-cream/50 px-4 py-3 ring-1 ring-riwaq-beige/80">
                <span>نسبة قبول الطلبات</span>
                <span className="font-extrabold text-riwaq-green">{k.orderAcceptRate.toLocaleString("ar-SA")}٪</span>
              </div>
              <div className="flex justify-between gap-3 rounded-2xl bg-riwaq-cream/50 px-4 py-3 ring-1 ring-riwaq-beige/80">
                <span>نسبة رفض الحجوزات</span>
                <span className="font-extrabold text-red-700">{k.reservationRejectRate.toLocaleString("ar-SA")}٪</span>
              </div>
              <div className="flex justify-between gap-3 rounded-2xl bg-riwaq-cream/50 px-4 py-3 ring-1 ring-riwaq-beige/80">
                <span>أداء الحملات (تقدير ROI)</span>
                <span className="font-extrabold text-riwaq-brown">{k.campaignRoi}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-extrabold text-riwaq-muted">أكثر المنتجات مبيعًا</p>
              <div className="flex flex-wrap gap-2">
                {k.topSkus.map((p) => (
                  <span key={p} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-extrabold text-riwaq-muted">أكثر الطاولات طلبًا</p>
              <div className="flex flex-wrap gap-2">
                {k.topTables.map((t) => (
                  <span key={t} className="rounded-full bg-riwaq-green/10 px-3 py-1 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/25">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-extrabold text-riwaq-muted">العملاء الأعلى قيمة</p>
              <ul className="space-y-2">
                {k.topCustomersValue.map((name, idx) => (
                  <li
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold ring-1 ring-riwaq-beige"
                  >
                    <span className="text-riwaq-brown">{name}</span>
                    <span className="tabular-nums text-xs font-extrabold text-riwaq-muted">
                      #{idx + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        <section className="rounded-3xl border border-dashed border-riwaq-caramel/35 bg-riwaq-caramel/5 px-5 py-4 text-sm font-bold text-riwaq-brown">
          التصدير والجدولة غير مفعّلة — ستُربط لاحقًا بقاعدة البيانات والصلاحيات.
        </section>
      </div>
    </div>
  );
}
