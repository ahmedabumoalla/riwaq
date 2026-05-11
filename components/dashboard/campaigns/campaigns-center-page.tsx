"use client";

import {
  BarChart3,
  Eye,
  Flame,
  Megaphone,
  Pause,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "@/components/dashboard/ui/modal";
import {
  campaignAggregates,
  campaignCenterSeed,
  creatorLeaderboard,
  type CampaignCenterRow,
  type CampaignCenterStatus,
  type CampaignCenterType,
  type SocialPlatform,
} from "@/lib/mock/campaigns-center";

const typesAll: CampaignCenterType[] = [
  "خصم",
  "كوبون",
  "رسالة للعملاء",
  "حملة توثيق تجربة",
  "حملة مؤثرين",
  "حملة طاولة مميزة",
  "حملة منتج جديد",
  "حملة وقت الركود",
];

const statusesAll: CampaignCenterStatus[] = ["مسودة", "مجدولة", "نشطة", "متوقفة", "منتهية"];

const platformsAll: SocialPlatform[] = ["TikTok", "Instagram", "Snapchat", "X"];

function statusStyle(s: CampaignCenterStatus) {
  switch (s) {
    case "نشطة":
      return "bg-riwaq-green/15 text-riwaq-green ring-riwaq-green/25";
    case "مجدولة":
      return "bg-sky-50 text-sky-900 ring-sky-100";
    case "مسودة":
      return "bg-zinc-100 text-zinc-700 ring-zinc-200";
    case "متوقفة":
      return "bg-orange-50 text-orange-900 ring-orange-100";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

export function CampaignsCenterPageClient() {
  const [rows, setRows] = useState<CampaignCenterRow[]>(campaignCenterSeed);
  const [detail, setDetail] = useState<CampaignCenterRow | null>(null);
  const [typeF, setTypeF] = useState<CampaignCenterType | "all">("all");
  const [statusF, setStatusF] = useState<CampaignCenterStatus | "all">("all");
  const [platF, setPlatF] = useState<SocialPlatform | "all">("all");
  const [perfF, setPerfF] = useState<"all" | "high" | "low">("all");
  const [dateAfter, setDateAfter] = useState("");

  const agg = useMemo(() => campaignAggregates(rows), [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (typeF !== "all" && r.type !== typeF) return false;
      if (statusF !== "all" && r.status !== statusF) return false;
      if (platF !== "all" && !r.platforms?.includes(platF)) return false;
      if (perfF === "high" && r.conversionRate < 6) return false;
      if (perfF === "low" && r.conversionRate >= 6) return false;
      if (dateAfter && r.startDate < dateAfter) return false;
      return true;
    });
  }, [rows, typeF, statusF, platF, perfF, dateAfter]);

  function pauseCampaign(id: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id && r.status === "نشطة" ? { ...r, status: "متوقفة" as const } : r)),
    );
    setDetail((d) => (d?.id === id ? { ...d, status: "متوقفة" } : d));
  }

  return (
    <div className="space-y-8 px-4 py-6 lg:px-8 lg:py-8">
      <header className="rounded-3xl border border-white/85 bg-white/70 p-6 shadow-lg backdrop-blur-md ring-1 ring-riwaq-caramel/15">
        <p className="text-xs font-extrabold uppercase tracking-wide text-riwaq-caramel">
          Marketing &amp; Creator Campaigns Center
        </p>
        <h1 className="mt-2 font-extrabold text-2xl text-riwaq-brown">مركز الحملات والمسوّقين</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-riwaq-muted">
          ربط الخصومات، التوثيق، والمؤثرين في تجربة واحدة هادئة — البيانات المعروضة محلية وهمية.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <MiniStat icon={Flame} label="حملات نشطة" value={agg.activeCampaigns.toLocaleString("ar-SA")} />
        <MiniStat icon={Target} label="عملاء مستهدفين (مجمّع)" value={agg.targeted.toLocaleString("ar-SA")} />
        <MiniStat icon={TrendingUp} label="معدل تفاعل تقريبي %" value={agg.avgEngagement.toLocaleString("ar-SA")} />
        <MiniStat icon={Megaphone} label="كوبونات مستخدمة (تقدير)" value={agg.couponsUsed.toLocaleString("ar-SA")} />
        <MiniStat icon={Share2} label="محتوى منشور" value={agg.posts.toLocaleString("ar-SA")} />
        <MiniStat icon={Eye} label="إجمالي مشاهدات" value={agg.views.toLocaleString("ar-SA")} />
        <MiniStat icon={BarChart3} label="أفضل حملة" value={agg.bestCampaignTitle} narrow />
      </section>

      <section className="rounded-3xl border border-riwaq-brown/10 bg-linear-to-bl from-white via-riwaq-beige/35 to-white p-6 shadow-xl ring-1 ring-white">
        <div className="flex flex-wrap items-center gap-3">
          <Sparkles className="h-9 w-9 text-riwaq-brown" aria-hidden />
          <div>
            <h2 className="font-extrabold text-xl text-riwaq-brown">حوّل عملاءك إلى مسوّقين</h2>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">
              منشئ حملة توثيق — واجهة تشغيلية؛ لا يُرسل أي محتوى فعليًا.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-white">
            <p className="text-xs font-extrabold text-riwaq-brown">عنوان الحملة</p>
            <p className="mt-2 text-sm font-bold text-riwaq-muted">مثال: «روّق بلون الغروب»</p>
            <p className="mt-4 text-xs font-extrabold text-riwaq-brown">شروط المشاركة</p>
            <p className="mt-2 text-sm font-bold text-riwaq-muted">
              تصوير فنجان داخل الفرع، ذكر اسم رِواق، وتطبيق هاشتاق الحملة لمدة ٧ أيام.
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-white">
            <p className="text-xs font-extrabold text-riwaq-brown">المنصات المستهدفة</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {platformsAll.map((p) => (
                <span key={p} className="rounded-full bg-riwaq-cream px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs font-extrabold text-riwaq-brown">نوع المحتوى</p>
            <p className="mt-2 text-sm font-bold text-riwaq-muted">صورة · فيديو · Story · Reel · TikTok</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-white lg:col-span-2">
            <p className="text-xs font-extrabold text-riwaq-brown">طريقة المكافأة</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["نقاط ولاء", "خصم", "منتج مجاني", "مكافأة مالية"].map((x) => (
                <span key={x} className="rounded-full bg-riwaq-brown/10 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown">
                  {x}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs font-extrabold text-riwaq-brown">قواعد الأداء</p>
            <ul className="mt-2 grid gap-2 text-sm font-bold text-riwaq-muted sm:grid-cols-2">
              <li>• حسب المشاهدات</li>
              <li>• حسب الإعجابات</li>
              <li>• حسب التعليقات</li>
              <li>• حسب المشاركات</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-riwaq-muted">
              <span>حد أقصى للمكافآت: ٢٠٠٠ نقطة / يوم (وهمي)</span>
              <span>تاريخ البداية والنهاية يُحدَّدان من الجدولة لاحقًا</span>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-3xl border border-white/85 bg-white/65 p-4 shadow-lg backdrop-blur-md lg:p-5">
        <div className="grid gap-4 lg:grid-cols-6">
          <label className="block">
            <span className="text-[11px] font-extrabold text-riwaq-muted">نوع الحملة</span>
            <select
              value={typeF}
              onChange={(e) => setTypeF(e.target.value as typeof typeF)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              {typesAll.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold text-riwaq-muted">الحالة</span>
            <select
              value={statusF}
              onChange={(e) => setStatusF(e.target.value as typeof statusF)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              {statusesAll.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold text-riwaq-muted">المنصة</span>
            <select
              value={platF}
              onChange={(e) => setPlatF(e.target.value as typeof platF)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              {platformsAll.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold text-riwaq-muted">الأداء</span>
            <select
              value={perfF}
              onChange={(e) => setPerfF(e.target.value as typeof perfF)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-extrabold text-riwaq-brown outline-none focus:ring-2 focus:ring-riwaq-caramel/30"
            >
              <option value="all">الكل</option>
              <option value="high">مرتفع (+٦٪ تحويل)</option>
              <option value="low">أقل من ٦٪</option>
            </select>
          </label>
          <label className="block lg:col-span-2">
            <span className="text-[11px] font-extrabold text-riwaq-muted">من تاريخ بداية (يساوي أو بعد)</span>
            <input
              type="date"
              value={dateAfter}
              onChange={(e) => setDateAfter(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-xs font-bold text-riwaq-brown outline-none ring-riwaq-caramel/30 focus:ring-2"
            />
          </label>
        </div>
      </div>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => (
          <article
            key={r.id}
            className="flex flex-col rounded-3xl border border-white/90 bg-white/75 p-5 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 ring-riwaq-beige/70"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-extrabold text-lg text-riwaq-brown">{r.title}</p>
                <p className="mt-1 text-xs font-extrabold text-riwaq-caramel">{r.type}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ring-1 ${statusStyle(r.status)}`}>
                {r.status}
              </span>
            </div>
            <p className="mt-3 text-sm font-bold leading-relaxed text-riwaq-muted">{r.audience}</p>
            <dl className="mt-4 grid gap-2 text-[11px] font-bold text-riwaq-muted">
              <div className="flex justify-between gap-2">
                <dt>الفترة</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">
                  {r.startDate} → {r.endDate}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>الميزانية</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">
                  {r.budgetSar.toLocaleString("ar-SA")} ر.س
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>المشاركون</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">{r.participants.toLocaleString("ar-SA")}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>المنشورات</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">{r.posts.toLocaleString("ar-SA")}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>المشاهدات</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">{r.views.toLocaleString("ar-SA")}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>معدل التحويل</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-green">{r.conversionRate.toLocaleString("ar-SA")}%</dd>
              </div>
            </dl>
            <p className="mt-3 rounded-2xl bg-riwaq-cream/60 px-3 py-2 text-[11px] font-bold leading-relaxed text-riwaq-brown ring-1 ring-riwaq-beige">
              المكافآت: {r.rewardsSummary}
            </p>
            {r.platforms?.length ? (
              <div className="mt-3 flex flex-wrap gap-1">
                {r.platforms.map((p) => (
                  <span key={p} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-riwaq-muted ring-1 ring-riwaq-beige">
                    {p}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-auto flex flex-wrap gap-2 border-t border-riwaq-beige/80 pt-4">
              <button
                type="button"
                onClick={() => setDetail(r)}
                className="inline-flex flex-1 min-w-[7rem] items-center justify-center rounded-2xl bg-riwaq-brown px-4 py-2 text-xs font-extrabold text-white shadow-md hover:brightness-105"
              >
                تفاصيل
              </button>
              <button
                type="button"
                disabled={r.status !== "نشطة"}
                onClick={() => pauseCampaign(r.id)}
                className="inline-flex flex-1 min-w-[7rem] items-center justify-center gap-1 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-extrabold text-orange-900 hover:bg-orange-100 disabled:opacity-35"
              >
                <Pause className="h-4 w-4" aria-hidden />
                إيقاف
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-white/85 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <h2 className="font-extrabold text-xl text-riwaq-brown">أفضل العملاء المسوّقين</h2>
        <p className="mt-1 text-sm font-bold text-riwaq-muted">Leaderboard تشغيلي — يحدَّث لاحقًا من التحليلات.</p>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-right text-sm">
            <thead>
              <tr className="border-b border-riwaq-beige text-[11px] font-extrabold text-riwaq-muted">
                <th className="py-3">العميل</th>
                <th className="py-3">منشورات</th>
                <th className="py-3">مشاهدات</th>
                <th className="py-3">تفاعل</th>
                <th className="py-3">مكافآت</th>
                <th className="py-3">أفضل منصة</th>
              </tr>
            </thead>
            <tbody>
              {creatorLeaderboard.map((c, i) => (
                <tr key={c.id} className="border-b border-riwaq-beige/70 font-bold text-riwaq-muted hover:bg-white/60">
                  <td className="py-3 font-extrabold text-riwaq-brown">
                    <span className="me-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-riwaq-brown/10 text-xs font-extrabold text-riwaq-brown">
                      {i + 1}
                    </span>
                    {c.name}
                  </td>
                  <td className="py-3 tabular-nums">{c.posts.toLocaleString("ar-SA")}</td>
                  <td className="py-3 tabular-nums">{c.views.toLocaleString("ar-SA")}</td>
                  <td className="py-3 tabular-nums">{c.engagement.toLocaleString("ar-SA")}</td>
                  <td className="py-3 tabular-nums text-riwaq-green">{c.rewardsEarned.toLocaleString("ar-SA")}</td>
                  <td className="py-3 font-extrabold text-riwaq-caramel">{c.topPlatform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={detail !== null} title={detail?.title ?? ""} onClose={() => setDetail(null)}>
        {detail ? (
          <div className="space-y-3 text-sm font-bold text-riwaq-muted">
            <p>
              النوع: <span className="font-extrabold text-riwaq-brown">{detail.type}</span>
            </p>
            <p>
              الجمهور: <span className="font-extrabold text-riwaq-brown">{detail.audience}</span>
            </p>
            <p className="rounded-2xl bg-riwaq-cream px-4 py-3 text-xs leading-relaxed ring-1 ring-riwaq-beige">
              ملخص تشغيلي: الميزانية {detail.budgetSar.toLocaleString("ar-SA")} ر.س، التحويل{" "}
              {detail.conversionRate.toLocaleString("ar-SA")}%، المنشورات {detail.posts.toLocaleString("ar-SA")}.
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  narrow,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  narrow?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-white/85 bg-white/75 p-4 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/60">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-riwaq-green/15 text-riwaq-green ring-1 ring-riwaq-green/25">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold text-riwaq-muted">{label}</p>
          <p className={`mt-1 font-extrabold text-riwaq-brown ${narrow ? "text-sm leading-snug" : "text-lg tabular-nums"}`}>
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}
