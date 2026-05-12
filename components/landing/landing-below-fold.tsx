"use client";

import { animate, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  Armchair,
  BarChart3,
  Bell,
  CalendarDays,
  Camera,
  Crown,
  Eye,
  Gift,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageCircle,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, end, {
      duration: 2.4,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, end]);

  return (
    <span ref={ref}>
      {n.toLocaleString("ar-SA")}
      {suffix}
    </span>
  );
}

const featureItems = [
  {
    title: "منيو تفاعلي",
    desc: "عرض فاخر للمنتجات مع إضافات واضحة وتحديث لحظي دون فوضى.",
    icon: Menu,
  },
  {
    title: "حجوزات ذكية",
    desc: "مواعيد، تأكيد، وتذكير بهدوء يليق بجلسات الضيافة.",
    icon: CalendarDays,
  },
  {
    title: "إدارة الطاولات",
    desc: "إطلالات، خدمات، عروض ولاء لكل طاولة كما في أفضل أنظمة الحجز.",
    icon: Armchair,
  },
  {
    title: "نظام ولاء",
    desc: "مستويات، نقاط، ومكافآت تشرك العميل دون تعقيد.",
    icon: Gift,
  },
  {
    title: "حملات تسويقية",
    desc: "خصومات، رسائل، وجداول زمنية بواجهة تشغيل واحدة.",
    icon: Megaphone,
  },
  {
    title: "تحويل العملاء إلى مسوقين",
    desc: "توثيق التجربة ومكافآت الأداء لتوسيع الحضور الرقمي بهدوء.",
    icon: Share2,
  },
  {
    title: "إدارة الموظفين",
    desc: "شِفتات، مهام، حضور تشغيلي، ومتابعة أداء الفريق.",
    icon: Users,
  },
  {
    title: "تقارير وتحليلات",
    desc: "قراءة سريعة للأداء اليومي ولحظات الذروة.",
    icon: BarChart3,
  },
  {
    title: "إشعارات فورية",
    desc: "تنبيهات طاولات، طلبات، وحملات دون ضجيج.",
    icon: Bell,
  },
  {
    title: "QR للحجوزات والطلبات",
    desc: "مسح سلس للدخول والشراء يقلل الاحتكاك.",
    icon: QrCode,
  },
] as const;

function FeaturesSection() {
  return (
    <motion.section
      id="features"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold text-riwaq-caramel">الاستعداد للتشغيل الفعلي</p>
          <h2 className="mt-4 font-extrabold text-3xl text-riwaq-brown sm:text-4xl lg:text-[2.75rem]">
            منصة SaaS كاملة لهدوء الكوفي وقوة الأداء
          </h2>
          <p className="mt-5 text-base leading-8 text-riwaq-muted">
            بطاقات نظيفة، حدود واضحة، وتجربة تلمس احتراف العالمية دون فقدان دفء الهوية العربية.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {featureItems.map(({ title, desc, icon: Icon }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.45 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-white/75 bg-white/50 p-6 shadow-lg shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/40 transition-shadow hover:shadow-2xl hover:shadow-riwaq-brown/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-white to-riwaq-beige/60 text-riwaq-brown ring-1 ring-riwaq-beige transition group-hover:from-riwaq-caramel/20 group-hover:to-riwaq-green/15">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-5 font-extrabold text-lg text-riwaq-brown">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-riwaq-muted">{desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

const tableShowcase = [
  {
    name: "رووف الغروب",
    meta: "مطلة · ٦ مقاعد",
    hue: "from-sky-200/60 via-white to-amber-50",
    tags: ["إطلالة", "دفاية", "+١٠٠ نقاط توثيق"],
    session: "١٠٥ د",
    promo: "عرض تصوير معتمد",
  },
  {
    name: "جناح VIP",
    meta: "بارتيشن مدمج · ٦ مقاعد",
    hue: "from-riwaq-brown/25 via-white to-riwaq-caramel/15",
    tags: ["بارتيشن", "شاشة", "هدية مجانية"],
    session: "١٢٠ د",
    promo: "خصم حجز موسمي",
  },
  {
    name: "باحة داخلية",
    meta: "جلسة خارجية · ٤ مقاعد",
    hue: "from-emerald-100/70 via-white to-riwaq-beige",
    tags: ["جلسة خارجية", "شاحن", "إضاءة خاصة"],
    session: "٩٠ د",
    promo: "نقاط ولاء إضافية",
  },
];

function TablesSection() {
  return (
    <motion.section
      id="tables"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold text-riwaq-green">إدارة الطاولات</p>
            <h2 className="mt-3 font-extrabold text-3xl text-riwaq-brown sm:text-4xl">
              حجوزات فاخرة بواجهة تشبه أفضل منصات العالم
            </h2>
            <p className="mt-4 text-base leading-8 text-riwaq-muted">
              كل طاولة قصة — إطلالة، خدمات، عروض، وولاء يُشعر الضيف أنه في مكان يُدار باحتراف.
            </p>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/50 px-6 py-4 text-sm font-extrabold text-riwaq-brown shadow-md backdrop-blur-md ring-1 ring-riwaq-beige">
            Floor Plan · عروض · نقاط · مدة الجلسة
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tableShowcase.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="overflow-hidden rounded-3xl border border-white/80 bg-white/55 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 ring-riwaq-beige/50"
            >
              <div className={`relative h-40 bg-linear-to-br ${t.hue} ring-1 ring-white/60`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Armchair className="h-16 w-16 text-riwaq-brown/20" aria-hidden />
                </div>
                <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown shadow-sm ring-1 ring-white">
                  طاولة معروضة
                </span>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="font-extrabold text-xl text-riwaq-brown">{t.name}</h3>
                  <p className="mt-1 text-sm font-bold text-riwaq-muted">{t.meta}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-riwaq-cream px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-linear-to-l from-riwaq-brown/8 to-transparent px-4 py-3 ring-1 ring-riwaq-brown/10">
                  <span className="text-xs font-extrabold text-riwaq-muted">مدة الجلسة</span>
                  <span className="font-extrabold text-riwaq-brown">{t.session}</span>
                </div>
                <p className="rounded-2xl bg-riwaq-green/10 px-4 py-3 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/20">
                  عرض خاص: {t.promo}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function CreatorsSection() {
  const platforms = ["TikTok", "Instagram", "Snapchat", "X"] as const;

  return (
    <motion.section
      id="creators"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/65 bg-linear-to-bl from-white/75 via-riwaq-beige/35 to-white/65 shadow-2xl shadow-riwaq-brown/12 backdrop-blur-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -start-32 top-0 h-96 w-96 rounded-full bg-riwaq-caramel/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-24 bottom-0 h-80 w-80 rounded-full bg-riwaq-green/14 blur-3xl"
        />

        <div className="relative grid gap-12 p-8 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-riwaq-brown px-4 py-2 text-sm font-extrabold text-white shadow-lg">
              <Crown className="h-4 w-4 text-riwaq-caramel" aria-hidden />
              حوّل عملاءك إلى مسوقين
            </div>
            <h2 className="font-extrabold text-3xl leading-snug text-riwaq-brown sm:text-4xl lg:text-[2.65rem]">
              مسار يتحرك مع عميلك… فينعكس على حضور كوفيك
            </h2>
            <p className="text-base leading-8 text-riwaq-muted">
              يوثّق العميل تجربته، ينشرها على المنصات التي يحبها، تحلّل رِواق التفاعل بهدوء، ثم تُكرم المنشورات الأصدق
              بنقاط ومكافآت — فيكبر انتشارك دون صياح إعلاني.
            </p>

            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm backdrop-blur-md"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              {[
                { k: "مشاهدات", v: "٢٤٠ ألف", icon: Eye },
                { k: "إعجابات", v: "١٨٫٥ ألف", icon: Star },
                { k: "مكافآت", v: "+٤٨٠٠ نقطة", icon: Gift },
              ].map((x) => (
                <div
                  key={x.k}
                  className="rounded-2xl border border-white/80 bg-white/70 p-4 text-center shadow-md backdrop-blur-md ring-1 ring-riwaq-beige/60"
                >
                  <x.icon className="mx-auto h-5 w-5 text-riwaq-caramel" aria-hidden />
                  <p className="mt-2 font-extrabold tabular-nums text-riwaq-brown">{x.v}</p>
                  <p className="text-[10px] font-extrabold text-riwaq-muted">{x.k}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative space-y-4">
            {[
              "العميل يوثّق تجربته",
              "ينشرها على المنصات",
              "المنصة تحلل التفاعل",
              "يحصل على نقاط ومكافآت",
              "الكوفي ينتشر أكثر",
            ].map((step, idx, arr) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-riwaq-brown text-sm font-extrabold text-white shadow-inner">
                  {idx + 1}
                </span>
                <div className="flex flex-1 items-center justify-between gap-3 rounded-3xl border border-white/80 bg-white/65 px-5 py-4 shadow-lg backdrop-blur-md ring-1 ring-riwaq-beige/60">
                  <span className="font-extrabold text-riwaq-brown">{step}</span>
                  {idx < arr.length - 1 ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="hidden text-riwaq-muted sm:inline"
                    >
                      ←
                    </motion.span>
                  ) : (
                    <Sparkles className="h-5 w-5 text-riwaq-caramel" aria-hidden />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function PhoneFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <div className="rounded-[2.25rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl shadow-black/25 ring-1 ring-white/20">
        <div className="overflow-hidden rounded-[1.65rem] bg-riwaq-cream">
          <div className="flex items-center justify-between border-b border-riwaq-beige/80 bg-white/90 px-4 py-3">
            <span className="text-[10px] font-extrabold text-riwaq-muted">٩:٤١</span>
            <span className="text-[11px] font-extrabold text-riwaq-brown">{title}</span>
            <span className="h-2 w-8 rounded-full bg-zinc-900/90" />
          </div>
          <div className="min-h-[280px] p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CustomerAppSection() {
  return (
    <motion.section
      id="customer-app"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold text-riwaq-caramel">تجربة العميل</p>
          <h2 className="mt-4 font-extrabold text-3xl text-riwaq-brown sm:text-4xl">
            تطبيق يشبه أفضل تجارب الضيافة العالمية… بلمسة رِواق
          </h2>
          <p className="mt-5 text-base leading-8 text-riwaq-muted">
            واجهات وهمية للعرض — تصور كيف يرى ضيفك كوفيك من جوّاله.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-4">
          <PhoneFrame title="حجز طاولة">
            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-riwaq-beige">
                <p className="text-[11px] font-extrabold text-riwaq-muted">السبت ٨ مساءً</p>
                <p className="mt-1 font-extrabold text-riwaq-brown">رووف الغروب · ٦ أشخاص</p>
              </div>
              <button type="button" className="w-full rounded-2xl bg-riwaq-brown py-3 text-xs font-extrabold text-white">
                تأكيد الحجز
              </button>
            </div>
          </PhoneFrame>

          <PhoneFrame title="طلب منتج">
            <div className="space-y-2">
              {["موكا باردة", "كيك الجزر", "شاي كرك"].map((p) => (
                <div key={p} className="flex justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-riwaq-beige">
                  <span className="text-xs font-extrabold text-riwaq-brown">{p}</span>
                  <span className="text-[11px] font-bold text-riwaq-muted">+</span>
                </div>
              ))}
            </div>
          </PhoneFrame>

          <PhoneFrame title="متابعة الطلب">
            <div className="space-y-3 text-xs font-extrabold">
              <div className="rounded-xl bg-riwaq-green/15 px-3 py-2 text-riwaq-green ring-1 ring-riwaq-green/25">
                قيد التجهيز
              </div>
              <div className="rounded-xl bg-white px-3 py-2 text-riwaq-muted ring-1 ring-riwaq-beige">
                الوقت المتوقع: ١٢ دقيقة
              </div>
            </div>
          </PhoneFrame>

          <PhoneFrame title="ولاء ومكافآت">
            <div className="rounded-2xl bg-linear-to-br from-riwaq-brown/10 to-riwaq-caramel/15 p-4 ring-1 ring-riwaq-beige">
              <p className="text-[11px] font-extrabold text-riwaq-muted">رصيد النقاط</p>
              <p className="mt-2 font-extrabold text-2xl text-riwaq-brown">٤٬٢٨٠</p>
              <p className="mt-3 text-[11px] font-bold text-riwaq-muted">استبدال مشروب مجاني متاح</p>
            </div>
          </PhoneFrame>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "دخول المجتمع",
            "ألعاب خفيفة وهدايا موسمية",
            "توثيق التجربة بالكاميرا",
            "إشعارات هادئة للزيارة القادمة",
          ].map((x) => (
            <div
              key={x}
              className="rounded-2xl border border-white/75 bg-white/50 px-4 py-4 text-center text-sm font-extrabold text-riwaq-brown shadow-md backdrop-blur-md ring-1 ring-riwaq-beige/50"
            >
              <Camera className="mx-auto mb-2 h-5 w-5 text-riwaq-caramel" aria-hidden />
              {x}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function OperationsSection() {
  return (
    <motion.section
      id="operations"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold text-riwaq-green">العمليات والإدارة</p>
          <h2 className="mt-4 font-extrabold text-3xl text-riwaq-brown sm:text-4xl">
            لوحة قيادة تُشبه أنظمة SaaS العالمية
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-14 overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 shadow-2xl shadow-riwaq-brown/12 backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/60 bg-white/45 px-6 py-5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-riwaq-brown" aria-hidden />
              <div>
                <p className="text-xs font-extrabold text-riwaq-muted">لوحة التشغيل الموحّدة</p>
                <p className="font-extrabold text-lg text-riwaq-brown">اليوم · جميع الفروع</p>
              </div>
            </div>
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
              تحديث قبل ٣٠ ثانية
            </span>
          </div>

          <div className="grid gap-4 p-6 lg:grid-cols-4">
            {[
              { label: "الطلبات", val: "١٬٢٦٤", sub: "نشطة الآن ٤٧", icon: UtensilsCrossed },
              { label: "الحجوزات", val: "١٨٩", sub: "خلال ٢٤ ساعة", icon: CalendarDays },
              { label: "الموظفون", val: "٣٢", sub: "في الشفت الحالي", icon: Users },
              { label: "الأداء", val: "٩٤٪", sub: "هدف الخدمة", icon: TrendingUp },
              { label: "الحملات", val: "٦", sub: "نشطة / مجدولة", icon: Megaphone },
              { label: "الإيرادات", val: "٤٨٬٢٠٠", sub: "ر.س تقريبي اليوم", icon: BarChart3 },
              { label: "نسبة الإشغال", val: "٧٨٪", sub: "متوسط الفروع", icon: Armchair },
              { label: "التنبيهات", val: "١١", sub: "بحاجة لمتابعة", icon: Bell },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-white/80 bg-linear-to-br from-white/95 to-riwaq-cream/45 p-5 shadow-md ring-1 ring-riwaq-beige/50"
              >
                <c.icon className="h-5 w-5 text-riwaq-caramel" aria-hidden />
                <p className="mt-3 text-[11px] font-extrabold text-riwaq-muted">{c.label}</p>
                <p className="mt-1 font-extrabold text-2xl text-riwaq-brown tabular-nums">{c.val}</p>
                <p className="mt-2 text-[11px] font-bold text-riwaq-muted">{c.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function StatsSection() {
  return (
    <motion.section
      id="stats"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/65 bg-linear-to-bl from-riwaq-brown via-[#3d2618] to-[#2d1a10] p-10 text-white shadow-2xl lg:p-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold text-riwaq-caramel">أرقام معبرة · عرض تشغيلي</p>
          <h2 className="mt-4 font-extrabold text-3xl sm:text-4xl">تأثير يُحسّ على أرض الواقع</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "الطلبات", end: 1284000, suffix: "" },
            { label: "الحجوزات", end: 48200, suffix: "" },
            { label: "العملاء", end: 96500, suffix: "" },
            { label: "التفاعل", end: 186, suffix: "%" },
            { label: "المنشورات", end: 28400, suffix: "" },
            { label: "نقاط الولاء", end: 9200000, suffix: "" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-white/15 bg-white/10 px-5 py-6 text-center backdrop-blur-md ring-1 ring-white/10"
            >
              <p className="text-[11px] font-extrabold text-white/70">{s.label}</p>
              <p className="mt-3 font-extrabold text-2xl tabular-nums sm:text-3xl">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

const pricingPlans = [
  {
    name: "Starter",
    tag: "للبداية الهادئة",
    highlighted: false,
    branches: "فرع واحد",
    bookings: "حتى ٨٠٠ حجز / شهر",
    loyalty: "ولاء أساسي",
    campaigns: "حملتان نشطتان",
    employees: "حتى ١٥ موظفًا",
    reports: "تقارير يومية أساسية",
  },
  {
    name: "Professional",
    tag: "الأكثر طلبًا",
    highlighted: true,
    branches: "حتى ٣ فروع",
    bookings: "حتى ٥٬٠٠٠ حجز / شهر",
    loyalty: "ولاء متعدد المستويات",
    campaigns: "حملات غير محدودة · مسوّقون",
    employees: "حتى ٦٠ موظفًا",
    reports: "تحليلات وذروة وزيارات",
  },
  {
    name: "Enterprise",
    tag: "للمجموعات الكبرى",
    highlighted: false,
    branches: "فروع غير محدودة",
    bookings: "حسب الاتفاق",
    loyalty: "برامج ولاء مخصصة",
    campaigns: "فرق نجاح وشراكات",
    employees: "بدون سقف تشغيلي",
    reports: "BI وتصدير متقدم",
  },
] as const;

function PricingSection() {
  return (
    <motion.section
      id="pricing"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold text-riwaq-caramel">الأسعار</p>
          <h2 className="mt-4 font-extrabold text-3xl text-riwaq-brown sm:text-4xl">باقات واضحة لمختلف أحجام الكوفي</h2>
          <p className="mt-4 text-sm font-bold text-riwaq-muted">أرقام توضيحية — التفعيل الفعلي يتم مع فريق رِواق.</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {pricingPlans.map((plan) => (
            <motion.article
              key={plan.name}
              whileHover={{ y: plan.highlighted ? -4 : -2 }}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-xl backdrop-blur-md ${
                plan.highlighted
                  ? "border-riwaq-caramel/50 bg-linear-to-b from-white via-riwaq-cream to-white ring-2 ring-riwaq-caramel/35 lg:-translate-y-2 lg:scale-[1.02]"
                  : "border-white/75 bg-white/55 ring-1 ring-riwaq-beige/60"
              }`}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-l from-riwaq-brown to-[#2d1a10] px-4 py-1 text-[11px] font-extrabold text-white shadow-lg">
                  موصى به
                </span>
              ) : null}
              <h3 className="font-extrabold text-2xl text-riwaq-brown">{plan.name}</h3>
              <p className="mt-2 text-sm font-bold text-riwaq-muted">{plan.tag}</p>
              <ul className="mt-8 flex flex-1 flex-col gap-4 text-sm font-bold text-riwaq-muted">
                <li className="flex justify-between gap-2 border-b border-riwaq-beige/70 pb-3">
                  <span>الفروع</span>
                  <span className="font-extrabold text-riwaq-brown">{plan.branches}</span>
                </li>
                <li className="flex justify-between gap-2 border-b border-riwaq-beige/70 pb-3">
                  <span>الحجوزات</span>
                  <span className="text-end font-extrabold text-riwaq-brown">{plan.bookings}</span>
                </li>
                <li className="flex justify-between gap-2 border-b border-riwaq-beige/70 pb-3">
                  <span>الولاء</span>
                  <span className="text-end font-extrabold text-riwaq-brown">{plan.loyalty}</span>
                </li>
                <li className="flex justify-between gap-2 border-b border-riwaq-beige/70 pb-3">
                  <span>الحملات</span>
                  <span className="text-end font-extrabold text-riwaq-brown">{plan.campaigns}</span>
                </li>
                <li className="flex justify-between gap-2 border-b border-riwaq-beige/70 pb-3">
                  <span>الموظفون</span>
                  <span className="text-end font-extrabold text-riwaq-brown">{plan.employees}</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>التقارير</span>
                  <span className="text-end font-extrabold text-riwaq-brown">{plan.reports}</span>
                </li>
              </ul>
              <Link
                href="#final-cta"
                className={`mt-8 inline-flex justify-center rounded-3xl px-6 py-4 text-center text-sm font-extrabold transition ${
                  plan.highlighted
                    ? "bg-linear-to-l from-riwaq-brown to-[#2d1a10] text-white shadow-lg hover:brightness-105"
                    : "border border-riwaq-beige bg-white text-riwaq-brown hover:border-riwaq-caramel/40"
                }`}
              >
                اختر {plan.name}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

const testimonials = [
  {
    cafe: "كوفي خطّ البحر",
    city: "جدة",
    quote:
      "من أول أسبوع صار عندنا انطباع أن هذا نظام ناضج — الحجوزات والطاولات صارت أوضح للفريق وللضيف.",
    rating: 5,
    initials: "خب",
    hue: "from-sky-400/30 to-cyan-300/20",
  },
  {
    cafe: "دار بنّي",
    city: "الرياض",
    quote:
      "حملات التوثيق عطّتنا حضور حقيقي بدون ضغط؛ العملاء صاروا يشاركون تجربتهم ويستلمون مكافآت منظمة.",
    rating: 5,
    initials: "دب",
    hue: "from-amber-400/35 to-orange-200/25",
  },
  {
    cafe: "روّق الليل",
    city: "الدمام",
    quote:
      "لوحة التشغيل تجمع كل شيء بهدوء؛ الموظفين يعرفون مهمتهم والإدارة تشوف الأداء بلقطة واحدة.",
    rating: 5,
    initials: "رل",
    hue: "from-violet-400/30 to-fuchsia-200/20",
  },
] as const;

function TestimonialsSection() {
  return (
    <motion.section
      id="testimonials"
      {...fadeUp}
      className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold text-riwaq-green">آراء عملاء</p>
          <h2 className="mt-4 font-extrabold text-3xl text-riwaq-brown sm:text-4xl">كوفيهات عربية تتحدث بلغة النتائج</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.cafe}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-white/75 bg-white/55 p-7 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 ring-riwaq-beige/60"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${t.hue} font-extrabold text-riwaq-brown ring-1 ring-white shadow-inner`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-extrabold text-lg text-riwaq-brown">{t.cafe}</p>
                  <p className="text-xs font-bold text-riwaq-muted">{t.city}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-riwaq-caramel text-riwaq-caramel" aria-hidden />
                ))}
              </div>
              <p className="mt-5 text-sm font-bold leading-8 text-riwaq-muted">«{t.quote}»</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function FinalCTASection() {
  return (
    <motion.section
      id="final-cta"
      {...fadeUp}
      className="scroll-mt-28 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-32"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/50 bg-linear-to-bl from-white/80 via-riwaq-beige/40 to-white/70 p-10 shadow-2xl shadow-riwaq-brown/15 backdrop-blur-xl lg:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(199,138,69,0.12),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(73,107,74,0.1),transparent_45%)]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-riwaq-green" aria-hidden />
          <h2 className="mt-6 font-extrabold text-3xl leading-snug text-riwaq-brown sm:text-4xl lg:text-[2.75rem]">
            حوّل كوفيك إلى تجربة متكاملة مع رِواق
          </h2>
          <p className="mt-5 text-base leading-8 text-riwaq-muted">
            فريقنا جاهز لعرض تشغيلي يطابق احتياج فرعك — من الطاولات إلى المسوّقين.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-linear-to-l from-riwaq-brown to-[#2d1a10] px-10 py-4 text-base font-extrabold text-white shadow-xl hover:brightness-105 sm:w-auto"
            >
              ابدأ الآن
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-riwaq-beige bg-white/85 px-10 py-4 text-base font-extrabold text-riwaq-brown shadow-lg backdrop-blur-md hover:border-riwaq-caramel/40 sm:w-auto"
            >
              اطلب تجربة
              <MessageCircle className="h-5 w-5 text-riwaq-caramel" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export function LandingBelowFold() {
  return (
    <>
      <FeaturesSection />
      <TablesSection />
      <CreatorsSection />
      <CustomerAppSection />
      <OperationsSection />
      <StatsSection />
      <PricingSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
