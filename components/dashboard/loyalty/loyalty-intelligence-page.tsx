"use client";

import {
  Award,
  Camera,
  Crown,
  Gift,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  computeLoyaltyStats,
  documentationRules,
  loyaltyIntelCustomers,
  rewardProgramTypes,
  tierDefinitions,
  type LoyaltyIntelCustomer,
  type LoyaltyIntelTierId,
} from "@/lib/mock/loyalty-intelligence";

function tierBadge(t: LoyaltyIntelTierId) {
  switch (t) {
    case "سفير المكان":
      return "bg-violet-100 text-violet-900 ring-violet-200";
    case "نخبة":
      return "bg-riwaq-brown/15 text-riwaq-brown ring-riwaq-brown/25";
    case "ذهبي":
      return "bg-riwaq-caramel/15 text-riwaq-caramel ring-riwaq-caramel/25";
    case "فضي":
      return "bg-slate-100 text-slate-800 ring-slate-200";
    default:
      return "bg-sky-50 text-sky-900 ring-sky-100";
  }
}

export function LoyaltyIntelligencePageClient() {
  const [customers] = useState<LoyaltyIntelCustomer[]>(loyaltyIntelCustomers);
  const [q, setQ] = useState("");
  const [tierF, setTierF] = useState<LoyaltyIntelTierId | "all">("all");
  const [minPts, setMinPts] = useState(0);
  const [activityF, setActivityF] = useState<"all" | "active" | "inactive">("all");
  const [docF, setDocF] = useState<"all" | "yes" | "no">("all");

  const stats = useMemo(() => computeLoyaltyStats(customers), [customers]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (q.trim() && !c.name.includes(q.trim())) return false;
      if (tierF !== "all" && c.tier !== tierF) return false;
      if (c.pointsCurrent < minPts) return false;
      if (activityF === "active" && c.inactiveDays >= 7) return false;
      if (activityF === "inactive" && c.inactiveDays < 14) return false;
      if (docF === "yes" && !c.documented) return false;
      if (docF === "no" && c.documented) return false;
      return true;
    });
  }, [customers, q, tierF, minPts, activityF, docF]);

  return (
    <div className="space-y-8 px-4 py-6 lg:px-8 lg:py-8">
      <header className="rounded-3xl border border-white/85 bg-white/70 p-6 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/70">
        <p className="text-xs font-extrabold uppercase tracking-wide text-riwaq-caramel">
          Loyalty Intelligence Center
        </p>
        <h1 className="mt-2 font-extrabold text-2xl text-riwaq-brown">ذكاء الولاء في رِواق</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-riwaq-muted">
          لوحة تشغيلية لقراءة القيمة طويلة المدى للعملاء، مع مستويات، توثيق، ومكافآت قابلة للربط لاحقًا —
          كل البيانات هنا وهمية للعرض.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <Stat label="إجمالي عملاء الولاء" value={stats.totalMembers.toLocaleString("ar-SA")} icon={Users} />
        <Stat label="النقاط المصدرة (تقدير)" value={stats.pointsIssued.toLocaleString("ar-SA")} icon={Sparkles} />
        <Stat label="النقاط المستخدمة" value={stats.pointsUsed.toLocaleString("ar-SA")} icon={TrendingUp} />
        <Stat label="المكافآت المستبدلة (تقريب)" value={stats.rewardsRedeemed.toLocaleString("ar-SA")} icon={Gift} />
        <Stat label="أعلى عميل نقاطًا" value={stats.topCustomerName} icon={Crown} small />
        <Stat label="عملاء غير نشطين (+١٤ يوم)" value={stats.inactiveMembers.toLocaleString("ar-SA")} icon={Users} />
        <Stat label="متوسط تكرار الزيارة" value={`كل ${stats.avgVisitFrequencyDays} يوم`} icon={Award} small />
      </section>

      <section aria-labelledby="tier-levels">
        <h2 id="tier-levels" className="font-extrabold text-lg text-riwaq-brown">
          مستويات الولاء
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {tierDefinitions.map((t) => (
            <article
              key={t.id}
              className="rounded-3xl border border-white/90 bg-white/75 p-5 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/70"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold text-riwaq-brown">{t.id}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1 ${tierBadge(t.id)}`}>
                  خصم {t.discountPercent}%
                </span>
              </div>
              <p className="mt-2 text-[11px] font-bold text-riwaq-muted">
                من {t.pointsRequired.toLocaleString("ar-SA")} نقطة
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-[11px] font-extrabold text-riwaq-brown">المزايا</p>
                <ul className="space-y-1 text-[11px] font-bold leading-relaxed text-riwaq-muted">
                  {t.benefits.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 border-t border-riwaq-beige pt-3">
                <p className="text-[11px] font-extrabold text-riwaq-caramel">مكافآت خاصة</p>
                <ul className="mt-1 space-y-1 text-[11px] font-bold text-riwaq-muted">
                  {t.specialRewards.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="rounded-3xl border border-white/85 bg-white/65 p-4 shadow-lg backdrop-blur-md lg:p-5">
        <div className="grid gap-4 lg:grid-cols-5">
          <label className="block lg:col-span-2">
            <span className="flex items-center gap-2 text-[11px] font-extrabold text-riwaq-muted">
              <Search className="h-4 w-4 text-riwaq-caramel" aria-hidden />
              بحث باسم العميل
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-2.5 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
              placeholder="مثال: نورة..."
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold text-riwaq-muted">المستوى</span>
            <select
              value={tierF}
              onChange={(e) => setTierF(e.target.value as typeof tierF)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              {tierDefinitions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold text-riwaq-muted">الحد الأدنى للنقاط</span>
            <input
              type="number"
              min={0}
              value={minPts}
              onChange={(e) => setMinPts(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-xs font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold text-riwaq-muted">النشاط</span>
            <select
              value={activityF}
              onChange={(e) => setActivityF(e.target.value as typeof activityF)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              <option value="active">نشط (زيارة خلال أسبوع)</option>
              <option value="inactive">خامل (+١٤ يوم)</option>
            </select>
          </label>
          <label className="block lg:col-span-5">
            <span className="text-[11px] font-extrabold text-riwaq-muted">توثيق التجربة</span>
            <select
              value={docF}
              onChange={(e) => setDocF(e.target.value as typeof docF)}
              className="mt-1 w-full max-w-xs rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              <option value="yes">وثّقوا تجربتهم</option>
              <option value="no">بدون توثيق بعد</option>
            </select>
          </label>
        </div>
      </div>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <article
            key={c.id}
            className="flex flex-col rounded-3xl border border-white/90 bg-white/75 p-5 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 ring-riwaq-beige/70"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-riwaq-brown to-[#2d1a10] text-lg font-extrabold text-white shadow-inner">
                {c.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-lg text-riwaq-brown">{c.name}</p>
                <p className="mt-1 text-sm font-bold text-riwaq-muted" dir="ltr">
                  {c.phone}
                </p>
                <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold ring-1 ${tierBadge(c.tier)}`}>
                  <Crown className="h-3.5 w-3.5" aria-hidden />
                  {c.tier}
                </span>
              </div>
            </div>
            <dl className="mt-4 grid gap-2 text-xs font-bold text-riwaq-muted">
              <div className="flex justify-between gap-2">
                <dt>النقاط الحالية</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">
                  {c.pointsCurrent.toLocaleString("ar-SA")}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>المستخدمة</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">
                  {c.pointsRedeemed.toLocaleString("ar-SA")}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>آخر زيارة</dt>
                <dd className="font-extrabold text-riwaq-brown">{c.lastVisit}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>أكثر منتج</dt>
                <dd className="truncate font-extrabold text-riwaq-brown">{c.topProduct}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>أكثر طاولة</dt>
                <dd className="truncate font-extrabold text-riwaq-brown">{c.topTable}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>منشورات موثقة</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">{c.docPosts}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>مشاهدات إجمالية</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">{c.totalViews.toLocaleString("ar-SA")}</dd>
              </div>
            </dl>
            <div className="mt-4 rounded-2xl bg-riwaq-cream/60 px-3 py-3 ring-1 ring-riwaq-beige">
              <p className="text-[10px] font-extrabold text-riwaq-muted">المكافآت المستحقة</p>
              <p className="mt-1 text-xs font-extrabold leading-relaxed text-riwaq-brown">{c.pendingRewards}</p>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-riwaq-beige bg-white/50 py-12 text-center text-sm font-bold text-riwaq-muted">
          لا يوجد عملاء ضمن الفلاتر الحالية.
        </p>
      ) : null}

      <section aria-labelledby="reward-settings">
        <h2 id="reward-settings" className="font-extrabold text-xl text-riwaq-brown">
          إعدادات المكافآت
        </h2>
        <p className="mt-2 text-sm font-bold text-riwaq-muted">
          أنواع برامج يمكن ربطها بالفرع — عرض تشغيلي فقط.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {rewardProgramTypes.map((r) => (
            <span
              key={r}
              className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm ring-1 ring-riwaq-beige"
            >
              {r}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/85 bg-linear-to-bl from-riwaq-green/10 via-white to-riwaq-cream/40 p-6 shadow-lg ring-1 ring-riwaq-green/15">
        <div className="flex flex-wrap items-center gap-3">
          <Camera className="h-8 w-8 text-riwaq-green" aria-hidden />
          <div>
            <h2 className="font-extrabold text-lg text-riwaq-brown">مكافآت التوثيق</h2>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">
              قواعد جاهزة للعرض على الإدارة والعملاء عند ربط المنصات لاحقًا.
            </p>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documentationRules.map((d) => (
            <li
              key={d.id}
              className="rounded-2xl border border-white/90 bg-white/80 px-4 py-4 text-sm font-bold text-riwaq-muted shadow-sm ring-1 ring-riwaq-beige"
            >
              <p className="font-extrabold text-riwaq-brown">{d.titleAr}</p>
              <p className="mt-2 font-extrabold text-riwaq-green">{d.rewardAr}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  small,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  small?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-white/85 bg-white/75 p-4 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/60">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold leading-snug text-riwaq-muted">{label}</p>
          <p className={`mt-2 font-extrabold text-riwaq-brown ${small ? "text-sm leading-snug" : "text-xl tabular-nums"}`}>
            {value}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-riwaq-caramel/15 text-riwaq-caramel ring-1 ring-riwaq-caramel/25">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </article>
  );
}
