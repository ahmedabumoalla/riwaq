"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Coffee,
  Gift,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

const LandingBelowFold = dynamic(
  () => import("./landing-below-fold").then((m) => ({ default: m.LandingBelowFold })),
  { loading: () => <LandingBelowFoldSkeleton /> },
);

function LandingBelowFoldSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-3xl border border-white/70 bg-white/40 shadow-sm ring-1 ring-riwaq-beige/50"
        />
      ))}
    </div>
  );
}

const navLinks = [
  { href: "#features", label: "المزايا" },
  { href: "#tables", label: "الطاولات" },
  { href: "#creators", label: "المسوّقون" },
  { href: "#customer-app", label: "تجربة العميل" },
  { href: "#operations", label: "التشغيل" },
  { href: "#stats", label: "أرقام" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#testimonials", label: "آراء" },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-3xl border border-white/65 bg-white/50 px-4 py-3 shadow-xl shadow-riwaq-brown/6 backdrop-blur-xl sm:px-6"
        aria-label="التنقل الرئيسي"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-extrabold text-xl tracking-tight text-riwaq-brown"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-riwaq-caramel/30 to-riwaq-green/20 text-riwaq-caramel ring-1 ring-white/80">
            <Coffee className="h-5 w-5" aria-hidden />
          </span>
          رِواق
        </Link>
        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-3 py-2 text-xs font-extrabold text-riwaq-muted transition hover:bg-white/70 hover:text-riwaq-brown"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login?next=/dashboard"
            className="hidden rounded-2xl border border-riwaq-beige/90 bg-white/80 px-4 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm transition hover:border-riwaq-caramel/35 sm:inline-flex"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/auth/register"
            className="hidden rounded-2xl border border-transparent bg-white/40 px-3 py-2 text-xs font-extrabold text-riwaq-muted transition hover:text-riwaq-brown md:inline-flex"
          >
            حساب جديد
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex rounded-2xl border border-riwaq-beige/90 bg-white/70 px-3 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm transition hover:bg-white sm:hidden"
          >
            دخول
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center gap-1 rounded-2xl bg-linear-to-l from-riwaq-brown to-[#2d1a10] px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-riwaq-brown/20 transition hover:brightness-105 sm:px-5 sm:text-sm"
          >
            ابدأ الآن
            <ArrowLeft className="h-4 w-4 opacity-90" aria-hidden />
          </Link>
        </div>
      </nav>
      <div className="mx-auto mt-2 flex max-w-7xl gap-1 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navLinks.slice(0, 6).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-[11px] font-extrabold text-riwaq-muted backdrop-blur-md"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

function HeroLiveMockup() {
  const pills = [
    { label: "طلبات", active: true },
    { label: "حجوزات", active: false },
    { label: "ولاء", active: false },
    { label: "حملات", active: false },
    { label: "موظفين", active: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-xl lg:max-w-none"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-linear-to-br from-riwaq-caramel/20 via-transparent to-riwaq-green/18 blur-3xl"
      />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/55 shadow-2xl shadow-riwaq-brown/12 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/60 bg-white/40 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-riwaq-brown text-white shadow-inner">
              <LayoutDashboard className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-riwaq-muted">Riwaq OS</p>
              <p className="font-extrabold text-sm text-riwaq-brown">فرع الواجهة · تشغيل حي</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-extrabold text-emerald-800 ring-1 ring-emerald-500/25">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            مباشر
          </span>
        </div>

        <div className="flex gap-1 overflow-x-auto px-4 pt-4 pb-2 [&::-webkit-scrollbar]:hidden">
          {pills.map((p) => (
            <span
              key={p.label}
              className={`shrink-0 rounded-2xl px-4 py-2 text-[11px] font-extrabold ring-1 transition ${
                p.active
                  ? "bg-riwaq-brown text-white ring-riwaq-brown"
                  : "bg-white/70 text-riwaq-muted ring-riwaq-beige/80"
              }`}
            >
              {p.label}
            </span>
          ))}
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[7.5rem_1fr] sm:p-5">
          <div className="hidden flex-col gap-2 sm:flex">
            {[
              { icon: UtensilsCrossed, v: "٢٤", l: "جلسات نشطة", c: "text-riwaq-caramel" },
              { icon: CalendarDays, v: "١٢", l: "حجز قادم", c: "text-riwaq-green" },
              { icon: Gift, v: "+٨٤٠", l: "نقاط اليوم", c: "text-violet-700" },
            ].map((x) => (
              <div
                key={x.l}
                className="rounded-2xl border border-white/80 bg-linear-to-br from-white/90 to-riwaq-cream/40 p-3 shadow-sm ring-1 ring-riwaq-beige/50"
              >
                <x.icon className={`h-4 w-4 ${x.c}`} aria-hidden />
                <p className="mt-2 font-extrabold tabular-nums text-lg text-riwaq-brown">{x.v}</p>
                <p className="text-[10px] font-bold leading-tight text-riwaq-muted">{x.l}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/80 bg-linear-to-br from-white to-riwaq-beige/40 p-4 shadow-md ring-1 ring-white/90">
                <p className="text-[11px] font-extrabold text-riwaq-muted">طلبات الساعة</p>
                <p className="mt-2 font-extrabold tabular-nums text-3xl text-riwaq-brown">٤٧</p>
                <p className="mt-1 text-[10px] font-bold text-emerald-700">↑ ١٢٪ عن الأمس</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-linear-to-br from-white to-riwaq-green/10 p-4 shadow-md ring-1 ring-white/90">
                <p className="text-[11px] font-extrabold text-riwaq-muted">إشغال الطاولات</p>
                <p className="mt-2 font-extrabold tabular-nums text-3xl text-riwaq-brown">٧٨٪</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-riwaq-beige">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-l from-riwaq-brown to-riwaq-caramel"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-riwaq-beige/80 bg-white/70 p-4 ring-1 ring-white">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-extrabold text-riwaq-brown">
                  <Bell className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                  إشعارات
                </p>
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-extrabold text-red-800 ring-1 ring-red-200">
                  ٣
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-[11px] font-bold text-riwaq-muted">
                <li className="flex justify-between gap-2 rounded-xl bg-riwaq-cream/60 px-3 py-2">
                  <span>طاولة رووف — تجاوز وقت الجلسة</span>
                  <span className="shrink-0 font-extrabold text-riwaq-caramel">الآن</span>
                </li>
                <li className="flex justify-between gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-riwaq-beige/70">
                  <span>حملة توثيق — ذروة مشاهدات</span>
                  <span className="shrink-0 text-riwaq-muted">منذ ١٢ د</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section id="hero-cta" className="relative px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-28 lg:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(199,138,69,0.18),transparent),radial-gradient(ellipse_70%_50%_at_100%_40%,rgba(73,107,74,0.12),transparent)]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fadeUp} className="order-1 space-y-8 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/65 px-4 py-2 text-sm font-extrabold text-riwaq-brown shadow-md backdrop-blur-md ring-1 ring-riwaq-beige/60"
          >
            <Sparkles className="h-4 w-4 text-riwaq-caramel" aria-hidden />
            مصمم خصيصًا للكافيهات الحديثة
          </motion.div>

          <h1 className="max-w-2xl font-extrabold text-4xl leading-[1.12] tracking-tight text-riwaq-brown sm:text-5xl lg:text-[3.5rem]">
            رِواق نظام تشغيل ذكي{" "}
            <span className="bg-linear-to-l from-riwaq-caramel via-[#b3742e] to-riwaq-brown bg-clip-text text-transparent">
              للكافيهات
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-9 text-riwaq-muted">
            منصة متكاملة تجمع الطلبات والحجوزات والولاء والتسويق وإدارة الموظفين وتحويل العملاء إلى مسوقين للمكان —
            بهدوء وفخامة تشغيل حقيقية.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-linear-to-l from-riwaq-brown to-[#2d1a10] px-9 py-4 text-base font-extrabold text-white shadow-xl shadow-riwaq-brown/25 transition hover:brightness-105"
            >
              ابدأ الآن
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href="#final-cta"
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/80 bg-white/70 px-9 py-4 text-base font-extrabold text-riwaq-brown shadow-lg backdrop-blur-md transition hover:border-riwaq-caramel/40"
            >
              احجز تجربة
              <CalendarDays className="h-5 w-5 text-riwaq-caramel" aria-hidden />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { t: "+١٢٠٠ طلب يومي", icon: Zap },
              { t: "+٨٥٪ زيادة تفاعل العملاء", icon: TrendingUp },
              { t: "+٤٠٪ زيادة الحجوزات", icon: CalendarDays },
            ].map((x) => (
              <span
                key={x.t}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/55 px-4 py-2.5 text-sm font-extrabold text-riwaq-brown shadow-sm backdrop-blur-md ring-1 ring-riwaq-beige/60"
              >
                <x.icon className="h-4 w-4 text-riwaq-green" aria-hidden />
                {x.t}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="order-2 lg:order-2">
          <HeroLiveMockup />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-riwaq-beige/80 bg-white/35 px-4 py-12 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-right">
        <div className="flex items-center gap-2 font-extrabold text-lg text-riwaq-brown">
          <Coffee className="h-5 w-5 text-riwaq-caramel" aria-hidden />
          رِواق
        </div>
        <p className="max-w-md text-sm font-bold leading-7 text-riwaq-muted">
          نظام تشغيل SaaS للكافيهات الحديثة — طلبات، حجوزات، ولاء، حملات، وموظفون في تجربة واحدة هادئة.
        </p>
        <p className="text-xs font-extrabold text-riwaq-muted">
          © {new Date().getFullYear()} رِواق. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

export function LandingHome() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <Suspense fallback={<LandingBelowFoldSkeleton />}>
          <LandingBelowFold />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
