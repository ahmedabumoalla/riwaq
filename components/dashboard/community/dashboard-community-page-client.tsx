"use client";

import { useMemo, useState } from "react";
import { Gift, MessageCircle, Star, Wand2 } from "lucide-react";
import { PostCard } from "@/components/community/post-card";
import type { CommunityPost } from "@/lib/mock/community";

export function DashboardCommunityPageClient({ posts }: { posts: CommunityPost[] }) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const visible = posts.filter((p) => !hidden[p.id]);

  const topPost = useMemo(() => [...posts].sort((a, b) => b.likes + b.views - (a.likes + a.views))[0], [posts]);
  const topCustomer = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of posts) {
      if (p.authorKind !== "customer") continue;
      counts[p.authorName] = (counts[p.authorName] ?? 0) + 1;
    }
    const name = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return name ? { name: name[0], n: name[1] } : null;
  }, [posts]);
  const suggestions = posts.filter((p) => p.postKind === "product_suggestion");
  const recipes = posts.filter((p) => p.postKind === "recipe");

  return (
    <div className="mx-auto max-w-6xl min-w-0 space-y-8 px-1 sm:px-0">
      <div className="rounded-3xl border border-white/90 bg-white/85 p-6 shadow-lg backdrop-blur-xl">
        <h1 className="text-2xl font-extrabold text-riwaq-brown">مجتمع الكوفي</h1>
        <p className="mt-2 text-sm font-bold text-riwaq-muted">منشورات مرتبطة بكوفيك — من Supabase مع RLS.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["بانتظار المراجعة", posts.filter((p) => p.reviewStatus === "pending").length],
          ["أعلى تفاعل (لايك)", posts.reduce((m, p) => Math.max(m, p.likes), 0).toLocaleString("ar-SA")],
          ["تعليقات العملاء", posts.reduce((s, p) => s + p.comments.length, 0)],
          ["مكافآت مقترحة", posts.filter((p) => p.rewardEligible).length],
        ].map(([t, v]) => (
          <div key={String(t)} className="rounded-3xl border border-riwaq-beige bg-riwaq-cream/50 p-4 shadow-sm">
            <p className="text-xs font-extrabold text-riwaq-muted">{t}</p>
            <p className="mt-2 text-2xl font-extrabold text-riwaq-brown">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-riwaq-caramel/30 bg-riwaq-caramel/8 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-caramel">أكثر منشور تفاعلًا</p>
          {topPost ? (
            <p className="mt-2 text-sm font-extrabold leading-relaxed text-riwaq-brown">{topPost.body.slice(0, 120)}…</p>
          ) : (
            <p className="mt-2 text-sm font-bold text-riwaq-muted">لا بيانات</p>
          )}
        </div>
        <div className="rounded-3xl border border-riwaq-green/30 bg-riwaq-green/8 p-5 shadow-sm">
          <p className="text-xs font-extrabold text-riwaq-green">أكثر عميل نشر عن الكوفي</p>
          {topCustomer ? (
            <p className="mt-2 text-lg font-extrabold text-riwaq-brown">
              {topCustomer.name}{" "}
              <span className="text-sm font-bold text-riwaq-muted">({topCustomer.n} منشورات)</span>
            </p>
          ) : (
            <p className="mt-2 text-sm font-bold text-riwaq-muted">لا بيانات</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl">
          <h2 className="text-sm font-extrabold text-riwaq-brown">اقتراحات منتجات</h2>
          <ul className="mt-3 space-y-2 text-sm font-bold text-riwaq-muted">
            {suggestions.length ? suggestions.map((p) => <li key={p.id}>• {p.body.slice(0, 80)}…</li>) : <li>لا اقتراحات.</li>}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl">
          <h2 className="text-sm font-extrabold text-riwaq-brown">وصفات مقترحة</h2>
          <ul className="mt-3 space-y-2 text-sm font-bold text-riwaq-muted">
            {recipes.length ? recipes.map((p) => <li key={p.id}>• {p.body.slice(0, 80)}…</li>) : <li>لا وصفات.</li>}
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-riwaq-beige bg-white/80 p-4 text-sm font-bold text-riwaq-muted shadow-sm">
        مكافآت المنشورات: حدد مكافآت من الإعدادات، اختر أفضل منشور أسبوعيًا، وحوّل منشورًا إلى حملة من الأزرار أسفل كل بطاقة.
      </div>

      <div className="space-y-6">
        {visible.map((p) => (
          <div key={p.id} className="space-y-3">
            <PostCard post={p} showFullComments />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-2xl bg-riwaq-green px-3 text-xs font-extrabold text-white hover:bg-riwaq-green/90"
                onClick={() => window.alert("ربط قبول المنشور عبر API لاحقًا")}
              >
                قبول في صفحة الكوفي
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-2xl border border-riwaq-beige bg-white px-3 text-xs font-extrabold hover:bg-riwaq-cream"
                onClick={() => setHidden((h) => ({ ...h, [p.id]: true }))}
              >
                إخفاء
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-2xl border border-riwaq-beige px-3 text-xs font-extrabold hover:bg-riwaq-cream"
                onClick={() => window.alert("رد على التعليقات لاحقًا")}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                رد
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-2xl border border-riwaq-caramel/40 px-3 text-xs font-extrabold text-riwaq-caramel hover:bg-riwaq-caramel/10"
                onClick={() => window.alert("تمييز المنشور لاحقًا")}
              >
                <Star className="h-3.5 w-3.5" />
                تمييز
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-2xl border border-riwaq-brown/20 px-3 text-xs font-extrabold hover:bg-riwaq-cream"
                onClick={() => window.alert("تحويل إلى حملة لاحقًا")}
              >
                <Wand2 className="h-3.5 w-3.5" />
                حملة
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1 rounded-2xl bg-riwaq-brown px-3 text-xs font-extrabold text-white hover:bg-riwaq-brown/90"
                onClick={() => window.alert("مكافأة العميل لاحقًا")}
              >
                <Gift className="h-3.5 w-3.5" />
                مكافأة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
