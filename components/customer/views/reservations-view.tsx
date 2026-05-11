"use client";

import { CalendarClock, QrCode, Sparkles } from "lucide-react";
import { useState } from "react";
import { mockCustomerReservations } from "@/lib/mock/customer-app";

const types = ["داخلية هادئة", "باحة خارجية", "رووف غروب", "جناح VIP"];
const svcs = [
  { id: "partition", label: "بارتيشن" },
  { id: "heater", label: "دفاية" },
  { id: "screen", label: "شاشة" },
  { id: "view", label: "إطلالة مميزة" },
] as const;

export function CustomerReservationsView() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [tableType, setTableType] = useState(types[0]);
  const [guests, setGuests] = useState(4);
  const [when, setWhen] = useState("الجمعة ٨:٠٠ م");
  const [picked, setPicked] = useState<string[]>(["view"]);

  const upcoming = mockCustomerReservations.filter((r) => r.status !== "منتهي");
  const ended = mockCustomerReservations.filter((r) => r.status === "منتهي");

  function toggleSvc(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  const basePts = 120;
  const docBonus = 180;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-extrabold text-2xl text-riwaq-brown">حجوزاتي</h1>
          <p className="mt-1 text-sm font-bold text-riwaq-muted">إدارة الجلسات وتجربة حجز جديدة — محليًا للعرض</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setWizardOpen(true);
            setStep(0);
          }}
          className="rounded-2xl bg-riwaq-brown px-5 py-3 text-sm font-extrabold text-white shadow-lg hover:brightness-105"
        >
          حجز جديد
        </button>
      </div>

      <section className="space-y-4">
        <h2 className="font-extrabold text-lg text-riwaq-brown">نشطة أو قادمة</h2>
        {upcoming.map((r) => (
          <article
            key={r.id}
            className="overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/88 shadow-xl ring-1 ring-riwaq-beige/90"
          >
            <div className={`h-32 bg-linear-to-br ${r.gradient}`}>
              <div className="flex h-full items-center justify-center">
                <CalendarClock className="h-12 w-12 text-riwaq-brown/20" aria-hidden />
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold text-riwaq-muted">{r.id}</p>
                  <h3 className="font-extrabold text-xl text-riwaq-brown">{r.table}</h3>
                  <p className="mt-2 text-sm font-bold text-riwaq-muted">{r.when}</p>
                </div>
                <span className="rounded-full bg-riwaq-green/12 px-3 py-1 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/22">
                  {r.status}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-riwaq-cream/60 px-4 py-3 text-sm font-bold ring-1 ring-riwaq-beige/80">
                  <p className="text-[11px] font-extrabold text-riwaq-muted">مدة الجلسة المتوقعة</p>
                  <p className="mt-1 font-extrabold tabular-nums text-riwaq-brown">
                    {r.durationMin.toLocaleString("ar-SA")} دقيقة
                  </p>
                </div>
                <div className="rounded-2xl bg-riwaq-cream/60 px-4 py-3 text-sm font-bold ring-1 ring-riwaq-beige/80">
                  <p className="text-[11px] font-extrabold text-riwaq-muted">بارتيشن</p>
                  <p className="mt-1 font-extrabold text-riwaq-brown">{r.partition ? "مطلوب" : "غير مطلوب"}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-riwaq-muted">خدمات مفعّلة</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.services.map((s) => (
                    <span key={s} className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-riwaq-beige">
                <div>
                  <p className="text-[11px] font-extrabold text-riwaq-muted">QR الحجز</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-riwaq-cream ring-1 ring-riwaq-beige">
                      <QrCode className="h-9 w-9 text-riwaq-brown/35" aria-hidden />
                    </span>
                    <span className="font-mono text-xs font-bold text-riwaq-muted">RW-RSV-{r.id}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-xl bg-riwaq-beige/80 px-4 py-2 text-xs font-extrabold text-riwaq-brown">
                    تعديل
                  </button>
                  <button type="button" className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-extrabold text-red-800">
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2 className="font-extrabold text-lg text-riwaq-brown">سابقة</h2>
        <div className="mt-4 space-y-3">
          {ended.map((r) => (
            <article key={r.id} className="rounded-2xl border border-riwaq-beige bg-white/80 px-4 py-4 text-sm font-bold text-riwaq-muted shadow-sm">
              <span className="font-extrabold text-riwaq-brown">{r.table}</span> · {r.when} ·{" "}
              {r.status}
            </article>
          ))}
        </div>
      </section>

      {wizardOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[90] bg-riwaq-brown/45 backdrop-blur-[2px]"
            aria-label="إغلاق"
            onClick={() => setWizardOpen(false)}
          />
          <div className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] top-[15vh] z-[95] overflow-hidden rounded-[1.75rem] border border-white/95 bg-white shadow-2xl lg:inset-x-auto lg:left-1/2 lg:top-[12vh] lg:w-[min(32rem,calc(100vw-2rem))] lg:-translate-x-1/2">
            <div className="flex h-full flex-col">
              <div className="border-b border-riwaq-beige px-5 py-4">
                <p className="text-xs font-extrabold text-riwaq-muted">حجز طاولة</p>
                <p className="font-extrabold text-lg text-riwaq-brown">الخطوة {step + 1} من ٤</p>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                {step === 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-riwaq-muted">اختر نوع الطاولة</p>
                    <div className="grid gap-2">
                      {types.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTableType(t)}
                          className={[
                            "rounded-2xl px-4 py-3 text-start text-sm font-extrabold ring-1 transition",
                            tableType === t
                              ? "bg-riwaq-brown text-white ring-riwaq-brown"
                              : "bg-riwaq-cream text-riwaq-brown ring-riwaq-beige hover:bg-riwaq-beige/70",
                          ].join(" ")}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {step === 1 ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-riwaq-muted">
                      عدد الأشخاص
                      <input
                        type="range"
                        min={2}
                        max={12}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="mt-3 w-full accent-riwaq-brown"
                      />
                      <p className="mt-2 text-center font-extrabold tabular-nums text-riwaq-brown">
                        {guests.toLocaleString("ar-SA")}
                      </p>
                    </label>
                  </div>
                ) : null}
                {step === 2 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-riwaq-muted">وقت الحجز</p>
                    <select
                      value={when}
                      onChange={(e) => setWhen(e.target.value)}
                      className="w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold outline-none ring-riwaq-caramel/25 focus:ring-2"
                    >
                      <option>الجمعة ٨:٠٠ م</option>
                      <option>الجمعة ٩:٣٠ م</option>
                      <option>السبت ٥:٠٠ م</option>
                    </select>
                  </div>
                ) : null}
                {step === 3 ? (
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-riwaq-muted">خدمات إضافية</p>
                    <div className="flex flex-wrap gap-2">
                      {svcs.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSvc(s.id)}
                          className={[
                            "rounded-full px-4 py-2 text-xs font-extrabold ring-1 transition",
                            picked.includes(s.id)
                              ? "bg-riwaq-green text-white ring-riwaq-green"
                              : "bg-white text-riwaq-brown ring-riwaq-beige",
                          ].join(" ")}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-linear-to-br from-riwaq-green/12 via-white to-riwaq-caramel/10 p-4 ring-1 ring-riwaq-green/20">
                      <p className="flex items-center gap-2 font-extrabold text-riwaq-brown">
                        <Sparkles className="h-5 w-5 text-riwaq-green" aria-hidden />
                        نقاط متوقعة
                      </p>
                      <p className="mt-2 text-sm font-bold text-riwaq-muted">
                        أساسية للحجز:{" "}
                        <span className="font-extrabold text-riwaq-brown">
                          +{basePts.toLocaleString("ar-SA")}
                        </span>
                      </p>
                      <p className="mt-1 text-sm font-bold text-riwaq-muted">
                        إضافية عند توثيق التجربة:{" "}
                        <span className="font-extrabold text-riwaq-caramel">
                          +{docBonus.toLocaleString("ar-SA")}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex gap-2 border-t border-riwaq-beige px-5 py-4">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="flex-1 rounded-2xl border border-riwaq-beige py-3 text-sm font-extrabold text-riwaq-brown disabled:opacity-40"
                >
                  السابق
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="flex-1 rounded-2xl bg-riwaq-brown py-3 text-sm font-extrabold text-white"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setWizardOpen(false)}
                    className="flex-1 rounded-2xl bg-riwaq-green py-3 text-sm font-extrabold text-white"
                  >
                    تأكيد وهمي
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
