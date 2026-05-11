"use client";

import {
  AlertTriangle,
  Armchair,
  BarChart3,
  CalendarClock,
  Crown,
  Gift,
  Megaphone,
  ShoppingBag,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  alertsMock,
  executiveKpis,
  liveOrdersMock,
  marketingPerfMock,
  reservationTimelineMock,
  staffOpsMock,
  tableOccupancyMock,
} from "@/lib/mock/admin-executive";
import { formatSar } from "@/lib/format";

function tileTone(state: (typeof tableOccupancyMock)[number]["state"]) {
  switch (state) {
    case "متاحة":
      return "bg-emerald-100 text-emerald-900 ring-emerald-200";
    case "محجوزة":
      return "bg-sky-100 text-sky-900 ring-sky-200";
    case "مشغولة":
      return "bg-riwaq-caramel/20 text-riwaq-brown ring-riwaq-caramel/30";
    case "تنظيف":
      return "bg-amber-100 text-amber-950 ring-amber-200";
    default:
      return "bg-neutral-200 text-neutral-800 ring-neutral-300";
  }
}

function alertTone(type: (typeof alertsMock)[number]["type"]) {
  if (type === "تحذير") return "border-red-200 bg-red-50 text-red-900";
  if (type === "فرصة") return "border-riwaq-green/30 bg-riwaq-green/10 text-riwaq-green";
  return "border-riwaq-caramel/30 bg-riwaq-caramel/10 text-riwaq-brown";
}

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

export default function ExecutiveDashboard() {
  const k = executiveKpis;

  const kpiCards = [
    { label: "مبيعات اليوم", value: formatSar(k.salesToday), icon: Wallet, hint: "مقارنة أمس · +٨٪" },
    { label: "طلبات اليوم", value: k.ordersToday.toLocaleString("ar-SA"), icon: ShoppingBag, hint: "ذروة ٧–٩ م" },
    { label: "حجوزات اليوم", value: k.reservationsToday.toLocaleString("ar-SA"), icon: CalendarClock, hint: "٤ رووف مساءً" },
    {
      label: "إشغال الطاولات",
      value: `${k.tableOccupancyPct.toLocaleString("ar-SA")}٪`,
      icon: Armchair,
      hint: "هدف اليوم ٨٥٪",
    },
    { label: "عملاء نشطون", value: k.activeCustomers.toLocaleString("ar-SA"), icon: Users, hint: "٣٠ يومًا" },
    {
      label: "نقاط ولاء مستخدمة",
      value: k.loyaltyPointsUsed.toLocaleString("ar-SA"),
      icon: Gift,
      hint: "استبدالات وخصومات",
    },
    { label: "حملات نشطة", value: k.activeCampaigns.toLocaleString("ar-SA"), icon: Megaphone, hint: "٣ على السوشال" },
    { label: "موظفون حاضرون", value: k.staffPresent.toLocaleString("ar-SA"), icon: Sparkles, hint: "مناوبة مسائية" },
    {
      label: "متوسط التجهيز",
      value: `${k.avgPrepMin.toLocaleString("ar-SA")} د`,
      icon: Timer,
      hint: "تحت SLA الفرع",
    },
  ] as const;

  const highlights = [
    { label: "أكثر منتج مبيعًا", value: k.topProduct, icon: TrendingUp },
    { label: "أكثر طاولة حجزًا", value: k.topTable, icon: Armchair },
    { label: "أفضل عميل ولاء", value: k.topLoyaltyCustomer, icon: Crown },
    { label: "أفضل موظف أداء", value: k.topStaff, icon: BarChart3 },
  ] as const;

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.section {...fadeIn} className="space-y-4" aria-label="مؤشرات تنفيذية">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map(({ label, value, icon: Icon, hint }) => (
              <article
                key={label}
                className="rounded-3xl border border-white/85 bg-white/70 p-4 shadow-lg shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-riwaq-muted">{label}</p>
                    <p className="mt-2 font-extrabold text-2xl tabular-nums text-riwaq-brown">{value}</p>
                    <p className="mt-1 text-[11px] font-bold text-riwaq-muted">{hint}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-riwaq-brown/8 text-riwaq-brown ring-1 ring-riwaq-brown/10">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-4">
            {highlights.map(({ label, value, icon: Icon }) => (
              <article
                key={label}
                className="rounded-3xl border border-riwaq-caramel/25 bg-linear-to-br from-white/85 via-riwaq-cream/40 to-riwaq-beige/35 p-4 shadow-md ring-1 ring-riwaq-caramel/15"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-riwaq-caramel/15 text-riwaq-caramel">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-riwaq-muted">{label}</p>
                    <p className="truncate font-extrabold text-lg text-riwaq-brown">{value}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-2">
          <motion.section
            {...fadeIn}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-3xl border border-white/85 bg-white/65 shadow-xl shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90"
            aria-labelledby="live-orders-heading"
          >
            <div className="flex items-center justify-between border-b border-riwaq-beige/90 px-5 py-4">
              <h2 id="live-orders-heading" className="font-extrabold text-lg text-riwaq-brown">
                طلبات مباشرة
              </h2>
              <span className="rounded-full bg-riwaq-green/15 px-3 py-1 text-[11px] font-extrabold text-riwaq-green">
                Live
              </span>
            </div>
            <ul className="divide-y divide-riwaq-beige/80">
              {liveOrdersMock.map((o) => (
                <li key={o.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-extrabold text-riwaq-brown">{o.customer}</p>
                      <p className="mt-1 text-sm font-bold text-riwaq-muted">{o.items}</p>
                      <p className="mt-2 text-[11px] font-bold text-riwaq-muted">{o.id}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-extrabold tabular-nums text-riwaq-brown">{formatSar(o.total)}</span>
                      <span className="rounded-full bg-riwaq-brown/10 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown">
                        {o.status}
                      </span>
                      <span className="text-[11px] font-bold text-riwaq-muted">
                        متبقّي تقريبًا{" "}
                        <span className="tabular-nums font-extrabold text-riwaq-caramel">
                          {o.etaMin.toLocaleString("ar-SA")} د
                        </span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            {...fadeIn}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="rounded-3xl border border-white/85 bg-white/65 shadow-xl shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90"
            aria-labelledby="res-timeline-heading"
          >
            <div className="flex items-center justify-between border-b border-riwaq-beige/90 px-5 py-4">
              <h2 id="res-timeline-heading" className="font-extrabold text-lg text-riwaq-brown">
                خط زمن الحجوزات القادمة
              </h2>
              <span className="rounded-full bg-riwaq-caramel/15 px-3 py-1 text-[11px] font-extrabold text-riwaq-caramel">
                اليوم
              </span>
            </div>
            <ol className="relative space-y-0 px-5 py-5">
              <span className="absolute end-[1.35rem] top-6 bottom-6 w-px bg-riwaq-beige" aria-hidden />
              {reservationTimelineMock.map((r) => (
                <li key={r.id} className="relative flex gap-4 py-3">
                  <span className="relative z-10 mt-1 flex h-3 w-3 shrink-0 rounded-full bg-riwaq-green ring-4 ring-white" />
                  <div className="min-w-0 flex-1 rounded-2xl bg-riwaq-cream/40 px-4 py-3 ring-1 ring-riwaq-beige/80">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-extrabold text-riwaq-brown">{r.name}</p>
                        <p className="mt-1 text-sm font-bold text-riwaq-muted">{r.table}</p>
                        <p className="mt-2 text-[11px] font-bold text-riwaq-muted">{r.id}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                          {r.time}
                        </span>
                        <span className="text-[11px] font-bold text-riwaq-muted">
                          {r.guests.toLocaleString("ar-SA")} ضيوف
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <motion.section
            {...fadeIn}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-3xl border border-white/85 bg-white/65 p-5 shadow-xl shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90"
            aria-labelledby="tables-mini-heading"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="tables-mini-heading" className="font-extrabold text-lg text-riwaq-brown">
                إشغال الطاولات — خريطة مصغّرة
              </h2>
              <Armchair className="h-5 w-5 text-riwaq-muted" aria-hidden />
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
              {tableOccupancyMock.map((t) => (
                <div
                  key={t.id}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center text-[11px] font-extrabold ring-1 ${tileTone(t.state)}`}
                >
                  <span className="tabular-nums text-sm">{t.label}</span>
                  <span className="leading-tight">{t.state}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            {...fadeIn}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="rounded-3xl border border-white/85 bg-white/65 shadow-xl shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90"
            aria-labelledby="marketing-heading"
          >
            <div className="border-b border-riwaq-beige/90 px-5 py-4">
              <h2 id="marketing-heading" className="font-extrabold text-lg text-riwaq-brown">
                أداء الحملات والتوثيق
              </h2>
            </div>
            <div className="divide-y divide-riwaq-beige/80 px-5 py-2">
              {marketingPerfMock.map((row) => (
                <div key={row.campaign} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0">
                    <p className="font-extrabold text-riwaq-brown">{row.campaign}</p>
                    <p className="mt-1 text-[11px] font-bold text-riwaq-muted">
                      منشورات {row.posts.toLocaleString("ar-SA")} · مشاهدات {row.views}
                    </p>
                  </div>
                  <span className="rounded-full bg-riwaq-green/15 px-3 py-1 text-xs font-extrabold text-riwaq-green">
                    تحويل {row.conversion}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <motion.section
            {...fadeIn}
            transition={{ duration: 0.35, delay: 0.14 }}
            className="rounded-3xl border border-white/85 bg-white/65 shadow-xl shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90"
            aria-labelledby="staff-heading"
          >
            <div className="border-b border-riwaq-beige/90 px-5 py-4">
              <h2 id="staff-heading" className="font-extrabold text-lg text-riwaq-brown">
                عمليات الموظفين والاستلامات
              </h2>
            </div>
            <ul className="divide-y divide-riwaq-beige/80">
              {staffOpsMock.map((s) => (
                <li key={s.name} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-riwaq-brown">{s.name}</p>
                      <p className="mt-1 text-sm font-bold text-riwaq-muted">{s.role}</p>
                    </div>
                    <div className="text-end">
                      <p className="rounded-full bg-riwaq-cream px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                        {s.state}
                      </p>
                      <p className="mt-2 text-[11px] font-bold text-riwaq-muted">{s.since}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            {...fadeIn}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="rounded-3xl border border-white/85 bg-white/65 shadow-xl shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90"
            aria-labelledby="alerts-heading"
          >
            <div className="flex items-center justify-between border-b border-riwaq-beige/90 px-5 py-4">
              <h2 id="alerts-heading" className="flex items-center gap-2 font-extrabold text-lg text-riwaq-brown">
                <AlertTriangle className="h-5 w-5 text-riwaq-caramel" aria-hidden />
                تنبيهات تشغيلية
              </h2>
            </div>
            <ul className="space-y-3 px-5 py-5">
              {alertsMock.map((a) => (
                <li
                  key={a.id}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm ${alertTone(a.type)}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="font-extrabold">{a.type}</span>
                    <span className="text-[11px] opacity-80">{a.time}</span>
                  </div>
                  <p className="mt-2 leading-relaxed">{a.message}</p>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
