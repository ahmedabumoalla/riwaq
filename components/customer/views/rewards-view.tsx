import { QrCode } from "lucide-react";
import { mockRewards } from "@/lib/mock/customer-app";

export function CustomerRewardsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-extrabold text-2xl text-riwaq-brown">مكافآتي</h1>
        <p className="mt-1 text-sm font-bold text-riwaq-muted">استبدال وهمي مع QR للعرض في الفرع</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {mockRewards.map((r) => (
          <article
            key={r.id}
            className="flex flex-col rounded-[1.75rem] border border-white/95 bg-white/90 p-5 shadow-xl ring-1 ring-riwaq-beige/90"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="rounded-full bg-riwaq-green/12 px-3 py-1 text-[11px] font-extrabold text-riwaq-green ring-1 ring-riwaq-green/22">
                  {r.kind}
                </span>
                <h2 className="mt-3 font-extrabold text-xl text-riwaq-brown">{r.title}</h2>
              </div>
              <div className="rounded-2xl bg-riwaq-cream px-4 py-3 text-center ring-1 ring-riwaq-beige">
                <p className="text-[11px] font-extrabold text-riwaq-muted">QR</p>
                <QrCode className="mx-auto mt-1 h-12 w-12 text-riwaq-brown/35" aria-hidden />
                <p className="mt-2 font-mono text-[10px] font-bold text-riwaq-muted">{r.qr}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-riwaq-beige/80 pt-5">
              <div>
                <p className="text-[11px] font-extrabold text-riwaq-muted">التكلفة بالنقاط</p>
                <p className="font-extrabold text-2xl tabular-nums text-riwaq-caramel">
                  {r.cost.toLocaleString("ar-SA")}
                </p>
                <p className="mt-2 text-xs font-bold text-riwaq-muted">ينتهي {r.expires}</p>
              </div>
              <button
                type="button"
                className="rounded-2xl bg-riwaq-brown px-6 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105"
              >
                استبدال
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
