const reports = [
  { key: "cafes", title: "تقرير أداء الكافيهات", hint: "مبيعات، طلبات، رضا" },
  { key: "subs", title: "تقرير الاشتراكات", hint: "تجديد، تأخر، ترقية" },
  { key: "rev", title: "تقرير الإيرادات", hint: "MRR، محتوى، رسوم" },
  { key: "cust", title: "تقرير العملاء", hint: "ولاء، إنفاق، مخاطر" },
  { key: "content", title: "تقرير المحتوى", hint: "منصات، مشاهدات، مراجعة" },
  { key: "rewards", title: "تقرير المكافآت", hint: "مستحقة، مدفوعة، نزاعات" },
  { key: "risk", title: "تقرير المخاطر", hint: "دفع، احتيال، سياسات" },
];

function FakeLine() {
  const pts = [40, 55, 48, 62, 58, 70, 66, 78, 74, 82];
  return (
    <div className="mt-4 flex h-28 items-end justify-between gap-1">
      {pts.map((h, i) => (
        <div key={i} className="flex flex-1 flex-col justify-end">
          <div
            className="w-full rounded-t-md bg-linear-to-t from-riwaq-brown to-riwaq-caramel opacity-90"
            style={{ height: `${h}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function FakeDonut({ label }: { label: string }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <div
        className="h-16 w-16 shrink-0 rounded-full bg-conic/decreasing from-riwaq-brown from-0deg via-riwaq-caramel via-120deg to-riwaq-green to-240deg p-1"
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-white" />
      </div>
      <p className="text-xs font-bold text-riwaq-muted">{label}</p>
    </div>
  );
}

export default function PlatformAdminReportsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <p className="text-sm font-bold text-riwaq-muted">تقارير تنفيذية — رسوم CSS فقط بدون مكتبات خارجية.</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <article
            key={r.key}
            className="flex flex-col rounded-3xl border border-riwaq-beige bg-white p-5 shadow-sm"
          >
            <h3 className="text-base font-extrabold text-riwaq-brown">{r.title}</h3>
            <p className="mt-1 text-xs font-bold text-riwaq-muted">{r.hint}</p>
            <FakeLine />
            <FakeDonut label="توزيع وهمي — قابل للاستبدال ببيانات حقيقية" />
            <button
              type="button"
              className="mt-4 rounded-2xl border border-riwaq-beige bg-riwaq-cream/50 py-2.5 text-xs font-extrabold text-riwaq-brown transition hover:bg-riwaq-cream"
            >
              تصدير PDF (وهمي)
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
