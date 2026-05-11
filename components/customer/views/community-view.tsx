import { Heart, Megaphone, Trophy } from "lucide-react";
import { CommunityFeed } from "@/components/community/community-feed";
import { communityPosts, communitySidebarMeta } from "@/lib/mock/community";

export function CustomerCommunityView() {
  const c = communitySidebarMeta;

  return (
    <div className="min-w-0 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-riwaq-brown sm:text-3xl">مجتمع رِواق</h1>
        <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-riwaq-muted">
          منشورات، تفاعل، ومكافآت — تجربة قريبة من التطبيقات العالمية مع هوية رِواق. التفاعل الحالي على الواجهة فقط.
        </p>
      </div>

      <section className="rounded-3xl border border-white/80 bg-linear-to-bl from-riwaq-brown/92 via-[#3d2618] to-riwaq-caramel/90 p-5 text-white shadow-2xl ring-1 ring-white/10 sm:p-6">
        <div className="flex items-start gap-3">
          <Megaphone className="mt-1 h-6 w-6 shrink-0 text-white/85" aria-hidden />
          <div>
            <p className="text-xs font-extrabold text-white/70">إعلان من الكوفي</p>
            <p className="mt-2 text-sm font-bold leading-relaxed sm:text-base">{c.cafeAnnouncement}</p>
          </div>
        </div>
      </section>

      <CommunityFeed posts={communityPosts} />

      <section className="rounded-3xl border border-white/90 bg-white/88 p-5 shadow-lg ring-1 ring-riwaq-beige/90 sm:p-6">
        <h2 className="text-lg font-extrabold text-riwaq-brown">تصويت الكوفي</h2>
        {c.polls.map((poll) => (
          <div key={poll.q} className="mt-5">
            <p className="font-extrabold text-riwaq-brown">{poll.q}</p>
            <div className="mt-4 space-y-2">
              {poll.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-riwaq-cream/60 px-4 py-3 text-start text-sm font-bold text-riwaq-brown ring-1 ring-riwaq-beige transition hover:bg-riwaq-beige/70"
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

      <section className="rounded-3xl border border-dashed border-riwaq-green/35 bg-riwaq-green/8 p-5 ring-1 ring-riwaq-green/15 sm:p-6">
        <h2 className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-riwaq-brown">
          <Trophy className="h-6 w-6 text-riwaq-green" aria-hidden />
          تحديات الأسبوع
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {c.challenges.map((ch) => (
            <li
              key={ch}
              className="rounded-2xl bg-white/90 px-4 py-4 text-center text-sm font-extrabold text-riwaq-brown shadow-sm ring-1 ring-riwaq-beige"
            >
              <Heart className="mx-auto mb-2 h-5 w-5 text-riwaq-caramel" aria-hidden />
              {ch}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
