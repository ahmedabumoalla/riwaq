import { Heart, Megaphone, Trophy } from "lucide-react";
import { communityMock } from "@/lib/mock/customer-app";

export function CustomerCommunityView() {
  const c = communityMock;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-extrabold text-2xl text-riwaq-brown">مجتمع رِواق</h1>
        <p className="mt-1 text-sm font-bold text-riwaq-muted">منشورات واستطلاعات وتحديات — واجهة فقط بدون دردشة حقيقية</p>
      </div>

      <section className="rounded-[1.75rem] bg-linear-to-bl from-riwaq-brown/92 via-[#3d2618] to-riwaq-caramel/90 p-5 text-white shadow-2xl ring-1 ring-white/10">
        <div className="flex items-start gap-3">
          <Megaphone className="mt-1 h-6 w-6 shrink-0 text-white/85" aria-hidden />
          <div>
            <p className="text-xs font-extrabold text-white/70">إعلان من الكوفي</p>
            <p className="mt-2 text-sm font-bold leading-relaxed">{c.cafeAnnouncement}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-extrabold text-lg text-riwaq-brown">منشورات العملاء</h2>
        <div className="mt-4 space-y-4">
          {c.posts.map((p) => (
            <article key={p.id} className="rounded-3xl border border-white/95 bg-white/90 p-5 shadow-md ring-1 ring-riwaq-beige/90">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-riwaq-brown">{p.author}</p>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-riwaq-muted">{p.text}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-riwaq-cream px-3 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                  <Heart className="h-4 w-4 text-red-500" aria-hidden />
                  {p.likes.toLocaleString("ar-SA")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/95 bg-white/88 p-5 shadow-lg ring-1 ring-riwaq-beige/90">
        <h2 className="font-extrabold text-lg text-riwaq-brown">تصويت الكوفي</h2>
        {c.polls.map((poll) => (
          <div key={poll.q} className="mt-5">
            <p className="font-extrabold text-riwaq-brown">{poll.q}</p>
            <div className="mt-4 space-y-2">
              {poll.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl bg-riwaq-cream/60 px-4 py-3 text-start text-sm font-bold text-riwaq-brown ring-1 ring-riwaq-beige hover:bg-riwaq-beige/70"
                >
                  {opt}
                  <span className="text-[11px] font-extrabold text-riwaq-muted">
                    {poll.votes.toLocaleString("ar-SA")} صوت إجمالي
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-dashed border-riwaq-green/35 bg-riwaq-green/8 p-5 ring-1 ring-riwaq-green/15">
        <h2 className="flex items-center gap-2 font-extrabold text-lg text-riwaq-brown">
          <Trophy className="h-6 w-6 text-riwaq-green" aria-hidden />
          تحديات الأسبوع
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {c.challenges.map((ch) => (
            <li key={ch} className="rounded-2xl bg-white/90 px-4 py-4 text-center text-sm font-extrabold text-riwaq-brown shadow-sm ring-1 ring-riwaq-beige">
              {ch}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
