const sections = [
  {
    title: "إعدادات الباقات",
    fields: ["Starter — حدود الفروع", "Professional — حملات متقدمة", "Enterprise — SLA مخصص"],
  },
  {
    title: "أسعار الاشتراكات",
    fields: ["499 / 1299 / 2499 ر.س شهريًا", "خصم سنوي 15٪", "فترة تجريبية 14 يومًا"],
  },
  {
    title: "قواعد احتساب مكافآت المشاهدات",
    fields: ["نقطة لكل 1000 مشاهدة معتمدة", "حد أدنى للصرف 50 ر.س", "سقف يومي للكوفي"],
  },
  {
    title: "قواعد احتساب نقاط التفاعل",
    fields: ["لايك +1، تعليق +3، مشاركة +5", "تطبيع ضد الزيادات الاصطناعية"],
  },
  {
    title: "نسبة المنصة من الحملات",
    fields: ["عمولة افتراضية 12٪", "تفاوض Enterprise منفصل"],
  },
  {
    title: "حدود الصرف",
    fields: ["KYC للمبالغ فوق 5000 ر.س", "حد شهري للعميل 20 ألف ر.س"],
  },
  {
    title: "صلاحيات الأدمن",
    fields: ["مسؤول منصة كامل", "مسؤول مالي", "مسؤول دعم قراءة فقط"],
  },
  {
    title: "الإيميلات المسموحة كسوبر أدمن",
    fields: ["admin@riwaq.sa", "super@riwaq.sa"],
  },
];

export default function PlatformAdminSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <p className="text-sm font-bold text-riwaq-muted">إعدادات مركزية للمنصة — واجهة نموذجية للربط لاحقًا بـ API.</p>

      <div className="space-y-4">
        {sections.map((s) => (
          <section key={s.title} className="rounded-3xl border border-riwaq-beige bg-white p-5 shadow-sm">
            <h3 className="text-base font-extrabold text-riwaq-brown">{s.title}</h3>
            <ul className="mt-3 space-y-2">
              {s.fields.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-bold text-riwaq-muted">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-riwaq-caramel" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <input
                className="min-w-[200px] flex-1 rounded-2xl border border-riwaq-beige bg-riwaq-cream/30 px-3 py-2 text-sm font-bold text-riwaq-brown placeholder:text-riwaq-muted/70"
                placeholder="قيمة جديدة…"
              />
              <button
                type="button"
                className="rounded-2xl bg-riwaq-brown px-4 py-2 text-xs font-extrabold text-white hover:bg-riwaq-brown/90"
              >
                حفظ (وهمي)
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
