"use client";

import {
  AlertTriangle,
  Award,
  Briefcase,
  ClipboardList,
  Clock,
  Gift,
  MapPin,
  Shield,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  adminNoteKinds,
  careerLadder,
  employeeDetailExtended,
  employeesOpsSeed,
  handoffSeed,
  type EmployeeOpsRow,
  type HandoffShift,
} from "@/lib/mock/employees-operations";

function dutyStyle(d: EmployeeOpsRow["duty"]) {
  switch (d) {
    case "كاشير":
      return "bg-riwaq-brown/10 text-riwaq-brown ring-riwaq-brown/20";
    case "تجهيز الطلبات":
      return "bg-riwaq-caramel/15 text-riwaq-caramel ring-riwaq-caramel/25";
    case "استقبال":
      return "bg-riwaq-green/15 text-riwaq-green ring-riwaq-green/25";
    case "تنظيف":
      return "bg-sky-50 text-sky-900 ring-sky-100";
    case "استراحة":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    default:
      return "bg-orange-50 text-orange-900 ring-orange-100";
  }
}

function geoStyle(g: EmployeeOpsRow["geoState"]) {
  switch (g) {
    case "داخل النطاق":
      return "text-riwaq-green";
    case "خارج النطاق":
      return "text-orange-700";
    case "مستأذن":
      return "text-sky-800";
    default:
      return "text-riwaq-muted";
  }
}

export function EmployeesOperationsPageClient() {
  const [employees] = useState<EmployeeOpsRow[]>(employeesOpsSeed);
  const [handoffs, setHandoffs] = useState<HandoffShift[]>(handoffSeed);
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const drawerEmp = employees.find((e) => e.id === drawerId) ?? null;
  const ext = drawerId ? employeeDetailExtended(drawerId) : null;

  const stats = useMemo(() => {
    const present = employees.filter((e) => e.geoState === "داخل النطاق").length;
    const out = employees.filter((e) => e.geoState === "خارج النطاق").length;
    const break_ = employees.filter((e) => e.duty === "استراحة").length;
    const tasks = employees.reduce((s, e) => s + e.tasks.length, 0);
    const avgPerf =
      employees.length === 0
        ? 0
        : employees.reduce((s, e) => s + e.performanceRating, 0) / employees.length;
    const top = [...employees].sort((a, b) => b.performanceRating - a.performanceRating)[0];
    const alerts = employees.filter((e) => e.adminNotePreview.includes("تنبيه")).length;
    return { present, out, break_, tasks, avgPerf, top, alerts };
  }, [employees]);

  function endHandoff(id: string) {
    setHandoffs((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="space-y-8 px-4 py-6 lg:px-8 lg:py-8">
      <header className="rounded-3xl border border-white/85 bg-white/70 p-6 shadow-lg backdrop-blur-md ring-1 ring-riwaq-green/15">
        <p className="text-xs font-extrabold uppercase tracking-wide text-riwaq-green">Employee Operations Center</p>
        <h1 className="mt-2 font-extrabold text-2xl text-riwaq-brown">مركز تشغيل الموظفين</h1>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-riwaq-muted">
          حضور وهمي داخل/خارج النطاق، استلامات، سلم وظيفي، ومكافآت — جاهز للعرض التشغيلي دون تتبع حقيقي.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <EmpStat icon={UserCheck} label="حاضرون داخل النطاق" value={stats.present.toLocaleString("ar-SA")} />
        <EmpStat icon={MapPin} label="خارج النطاق" value={stats.out.toLocaleString("ar-SA")} />
        <EmpStat icon={Clock} label="في استراحة" value={stats.break_.toLocaleString("ar-SA")} />
        <EmpStat icon={ClipboardList} label="مهام نشطة (مجمّع)" value={stats.tasks.toLocaleString("ar-SA")} />
        <EmpStat icon={Star} label="متوسط الأداء" value={stats.avgPerf.toLocaleString("ar-SA", { minimumFractionDigits: 1 })} />
        <EmpStat icon={Award} label="أعلى أداء" value={stats.top?.name ?? "—"} narrow />
        <EmpStat icon={AlertTriangle} label="تنبيهات إدارية" value={stats.alerts.toLocaleString("ar-SA")} />
      </section>

      <section className="rounded-3xl border border-white/85 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <Shield className="h-8 w-8 text-riwaq-brown" aria-hidden />
          <div>
            <h2 className="font-extrabold text-xl text-riwaq-brown">الاستلامات الحالية</h2>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">
              مسارات تشغيلية وهمية؛ الأزرار تحاكي الإجراء فقط محليًا.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {handoffs.map((h) => (
            <article
              key={h.id}
              className="rounded-3xl border border-riwaq-beige bg-riwaq-cream/40 p-5 ring-1 ring-white"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-extrabold text-riwaq-brown">{h.role}</p>
                  <p className="mt-1 text-sm font-bold text-riwaq-muted">{h.employeeName}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                  {h.status}
                </span>
              </div>
              <dl className="mt-4 grid gap-2 text-xs font-bold text-riwaq-muted">
                <div className="flex justify-between gap-2">
                  <dt>بداية الاستلام</dt>
                  <dd className="font-extrabold text-riwaq-brown">{h.startLabel}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>مدة الاستلام</dt>
                  <dd className="font-extrabold text-riwaq-brown">{h.durationLabel}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => endHandoff(h.id)}
                  className="rounded-2xl bg-riwaq-green px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:brightness-105"
                >
                  إنهاء الاستلام
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-riwaq-beige bg-white px-4 py-2 text-xs font-extrabold text-riwaq-brown hover:bg-riwaq-beige/40"
                >
                  نقل لموظف آخر
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/85 bg-white/70 p-6 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <Briefcase className="h-8 w-8 text-riwaq-caramel" aria-hidden />
          <div>
            <h2 className="font-extrabold text-xl text-riwaq-brown">السلم الوظيفي</h2>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">صلاحيات، مهام، ومتطلبات ترقية معروضة للفرق الإدارية.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {careerLadder.map((c) => (
            <article key={c.id} className="rounded-3xl border border-white/90 bg-linear-to-bl from-white to-riwaq-cream/50 p-5 shadow-md ring-1 ring-riwaq-beige">
              <p className="font-extrabold text-lg text-riwaq-brown">{c.id}</p>
              <div className="mt-3 space-y-3 text-[11px] font-bold text-riwaq-muted">
                <div>
                  <p className="font-extrabold text-riwaq-caramel">الصلاحيات</p>
                  <ul className="mt-1 space-y-1">
                    {c.permissions.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-extrabold text-riwaq-caramel">المهام</p>
                  <ul className="mt-1 space-y-1">
                    {c.tasks.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-extrabold text-riwaq-caramel">متطلبات الترقية</p>
                  <ul className="mt-1 space-y-1">
                    {c.promotionNeeds.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/85 bg-linear-to-bl from-riwaq-brown/8 via-white to-riwaq-beige/40 p-6 shadow-lg ring-1 ring-riwaq-brown/10">
        <div className="flex flex-wrap items-center gap-3">
          <Gift className="h-8 w-8 text-riwaq-brown" aria-hidden />
          <div>
            <h2 className="font-extrabold text-xl text-riwaq-brown">المكافآت والملاحظات الإدارية</h2>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">تصنيف جاهز لمسارات الموارد البشرية لاحقًا.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {adminNoteKinds.map((k) => (
            <span
              key={k}
              className="rounded-full bg-white px-4 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm ring-1 ring-riwaq-beige"
            >
              {k}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {employees.map((e) => (
          <article
            key={e.id}
            className="rounded-3xl border border-white/90 bg-white/75 p-5 shadow-xl shadow-riwaq-brown/8 backdrop-blur-md ring-1 ring-riwaq-beige/70"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-riwaq-brown to-[#2d1a10] text-lg font-extrabold text-white shadow-inner">
                {e.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-lg text-riwaq-brown">{e.name}</h3>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ring-1 ${dutyStyle(e.duty)}`}>
                    {e.duty}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-riwaq-muted">
                  {e.employeeNumber} · {e.role} · {e.branch}
                </p>
                <p className={`mt-2 text-[11px] font-extrabold ${geoStyle(e.geoState)}`}>
                  الموقع التشغيلي (وهمي): {e.geoState}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid gap-2 text-xs font-bold text-riwaq-muted">
              <div className="flex justify-between gap-2">
                <dt>بداية الشفت</dt>
                <dd className="font-extrabold text-riwaq-brown">{e.shiftStartLabel}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>مدة العمل الحالية</dt>
                <dd className="font-extrabold text-riwaq-brown">{e.currentWorkDurationLabel}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>طلبات اليوم</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-brown">{e.ordersHandledToday}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>تقييم الأداء</dt>
                <dd className="inline-flex items-center gap-1 font-extrabold text-riwaq-brown">
                  <Star className="h-4 w-4 fill-riwaq-caramel text-riwaq-caramel" aria-hidden />
                  {e.performanceRating.toLocaleString("ar-SA", { minimumFractionDigits: 1 })}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>رصيد مكافآت</dt>
                <dd className="font-extrabold tabular-nums text-riwaq-green">{e.rewardsBalance}</dd>
              </div>
            </dl>
            <div className="mt-4 rounded-2xl bg-riwaq-cream/60 px-3 py-3 ring-1 ring-riwaq-beige">
              <p className="text-[10px] font-extrabold text-riwaq-muted">مهام حالية</p>
              <ul className="mt-2 space-y-1 text-[11px] font-bold text-riwaq-brown">
                {e.tasks.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </div>
            <p className="mt-3 rounded-2xl bg-white/90 px-3 py-2 text-[11px] font-bold text-riwaq-muted ring-1 ring-riwaq-beige">
              ملاحظة إدارية: <span className="font-extrabold text-riwaq-brown">{e.adminNotePreview}</span>
            </p>
            <button
              type="button"
              onClick={() => setDrawerId(e.id)}
              className="mt-4 w-full rounded-2xl bg-riwaq-brown px-4 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              ملف الموظف الكامل
            </button>
          </article>
        ))}
      </section>

      {drawerEmp && ext ? (
        <>
          <button
            type="button"
            aria-label="إغلاق"
            className="fixed inset-0 z-[70] bg-riwaq-brown/40 backdrop-blur-[2px]"
            onClick={() => setDrawerId(null)}
          />
          <aside className="fixed inset-y-0 start-0 z-[80] flex w-[min(100vw-1rem,30rem)] flex-col border-e border-riwaq-beige bg-white shadow-2xl sm:w-[min(100vw-2rem,36rem)]">
            <div className="flex items-start justify-between gap-3 border-b border-riwaq-beige px-5 py-4">
              <div>
                <p className="text-xs font-extrabold text-riwaq-muted">Employee Detail</p>
                <p className="mt-1 font-extrabold text-xl text-riwaq-brown">{drawerEmp.name}</p>
                <p className="mt-1 text-sm font-bold text-riwaq-muted">{drawerEmp.employeeNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerId(null)}
                className="rounded-xl px-3 py-1 text-sm font-extrabold text-riwaq-muted hover:bg-riwaq-beige/70"
              >
                إغلاق
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              <section className="rounded-3xl border border-riwaq-beige bg-riwaq-cream/50 p-4">
                <h3 className="font-extrabold text-riwaq-brown">جدول الشفت</h3>
                <ul className="mt-3 space-y-2 text-sm font-bold text-riwaq-muted">
                  {ext.shiftWeek.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-extrabold text-riwaq-brown">مهام اليوم</h3>
                <ul className="mt-2 space-y-1 text-sm font-bold text-riwaq-muted">
                  {ext.tasksQueue.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-extrabold text-riwaq-brown">سجل الاستلامات</h3>
                <ul className="mt-2 space-y-1 text-xs font-bold text-riwaq-muted">
                  {ext.handoffsLog.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-extrabold text-riwaq-brown">سجل المكافآت</h3>
                <ul className="mt-2 space-y-1 text-xs font-bold text-riwaq-green">
                  {ext.rewardsLog.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-extrabold text-riwaq-brown">سجل الملاحظات</h3>
                <ul className="mt-2 space-y-1 text-xs font-bold text-riwaq-muted">
                  {ext.notesLog.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </section>
              <section className="rounded-3xl border border-white/90 bg-white p-4 ring-1 ring-riwaq-beige">
                <h3 className="font-extrabold text-riwaq-brown">الأداء اليومي</h3>
                <ul className="mt-3 space-y-2">
                  {ext.dailyPerf.map((d) => (
                    <li key={d.label} className="flex justify-between text-sm font-bold text-riwaq-muted">
                      <span>{d.label}</span>
                      <span className="font-extrabold tabular-nums text-riwaq-brown">{d.score}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="rounded-3xl border border-white/90 bg-white p-4 ring-1 ring-riwaq-beige">
                <h3 className="font-extrabold text-riwaq-brown">الأداء الشهري</h3>
                <ul className="mt-3 space-y-2">
                  {ext.monthlyPerf.map((d) => (
                    <li key={d.label} className="flex justify-between text-sm font-bold text-riwaq-muted">
                      <span>{d.label}</span>
                      <span className="font-extrabold tabular-nums text-riwaq-green">{d.score}%</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}

function EmpStat({
  icon: Icon,
  label,
  value,
  narrow,
}: {
  icon: typeof Users;
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
