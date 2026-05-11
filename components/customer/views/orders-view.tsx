import { CheckCircle2, Circle, QrCode, RotateCcw, XCircle } from "lucide-react";
import { mockCustomerOrders } from "@/lib/mock/customer-app";
import { formatSar } from "@/lib/format";

export function CustomerOrdersView() {
  const active = mockCustomerOrders.find((o) => o.timeline.some((t) => !t.done));
  const past = mockCustomerOrders.filter((o) => o !== active);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-extrabold text-2xl text-riwaq-brown">طلباتي</h1>
        <p className="mt-1 text-sm font-bold text-riwaq-muted">تتبّع حالة الطلب والاستلام — تجربة عرض فقط</p>
      </div>

      {active ? (
        <section className="rounded-[1.75rem] border border-riwaq-green/25 bg-linear-to-bl from-riwaq-green/12 via-white to-riwaq-cream/40 p-5 shadow-xl ring-1 ring-riwaq-green/15">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold text-riwaq-muted">الطلب النشط</p>
              <h2 className="mt-1 font-extrabold text-xl text-riwaq-brown">{active.id}</h2>
              <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/25">
                {active.status}
                {active.etaMin != null ? ` · ~${active.etaMin.toLocaleString("ar-SA")} د` : ""}
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 px-4 py-3 ring-1 ring-riwaq-beige shadow-inner">
              <p className="text-[11px] font-extrabold text-riwaq-muted">QR الاستلام</p>
              <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-xl bg-linear-to-br from-riwaq-beige to-white ring-1 ring-riwaq-beige">
                <QrCode className="h-14 w-14 text-riwaq-brown/35" aria-hidden />
              </div>
              <p className="mt-2 text-center text-[10px] font-mono font-bold text-riwaq-muted">RW-PICK-{active.id}</p>
            </div>
          </div>

          {active.promo ? (
            <p className="mt-4 rounded-2xl bg-riwaq-caramel/12 px-4 py-3 text-sm font-extrabold text-riwaq-brown ring-1 ring-riwaq-caramel/25">
              {active.promo}
            </p>
          ) : null}

          <ul className="mt-5 divide-y divide-riwaq-beige/80 rounded-2xl bg-white/80 ring-1 ring-riwaq-beige">
            {active.items.map((i) => (
              <li key={i.name} className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold">
                <span className="text-riwaq-brown">{i.name}</span>
                <span className="tabular-nums text-riwaq-muted">
                  ×{i.qty.toLocaleString("ar-SA")} · {formatSar(i.price * i.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-extrabold tabular-nums text-lg text-riwaq-brown">الإجمالي {formatSar(active.total)}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-riwaq-beige bg-white px-4 py-2.5 text-xs font-extrabold text-riwaq-brown shadow-sm"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                إعادة الطلب
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-extrabold text-red-800"
              >
                <XCircle className="h-4 w-4" aria-hidden />
                إلغاء إن سمح
              </button>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-extrabold text-riwaq-muted">مسار الطلب</p>
            <ol className="relative mt-4 space-y-4">
              <span className="absolute end-[10px] top-2 bottom-2 w-px bg-riwaq-beige" aria-hidden />
              {active.timeline.map((step) => (
                <li key={step.step} className="relative flex gap-4">
                  <span className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-riwaq-beige">
                    {step.done ? (
                      <CheckCircle2 className="h-5 w-5 text-riwaq-green" aria-hidden />
                    ) : (
                      <Circle className="h-5 w-5 text-riwaq-muted/40" aria-hidden />
                    )}
                  </span>
                  <span
                    className={
                      step.done ? "font-extrabold text-riwaq-brown" : "font-bold text-riwaq-muted"
                    }
                  >
                    {step.step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-extrabold text-lg text-riwaq-brown">طلبات سابقة</h2>
        <div className="mt-4 space-y-4">
          {past.map((o) => (
            <article
              key={o.id}
              className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md ring-1 ring-riwaq-beige/90"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-riwaq-brown">{o.id}</p>
                  <p className="mt-1 text-xs font-extrabold text-riwaq-muted">{o.status}</p>
                </div>
                <p className="font-extrabold tabular-nums text-riwaq-green">{formatSar(o.total)}</p>
              </div>
              <ul className="mt-3 space-y-1 text-sm font-bold text-riwaq-muted">
                {o.items.map((i) => (
                  <li key={i.name}>
                    {i.name} ×{i.qty.toLocaleString("ar-SA")}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-riwaq-cream px-4 py-2 text-xs font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                إعادة الطلب
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
