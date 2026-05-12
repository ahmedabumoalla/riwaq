"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataEmptyState, DataErrorState } from "@/components/ui/data-state";
import { reviewStatusLabelsAr, type ReviewStatus } from "@/lib/mock/community";
import type { CommunityPost } from "@/lib/mock/community";

const PAGE_SIZE = 10;

const tabs: { id: "all" | ReviewStatus | "recent" | "top_views" | "top_engagement" | "reported"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "recent", label: "المرفوع حديثًا" },
  { id: "pending", label: "بانتظار المراجعة" },
  { id: "approved", label: "مقبول" },
  { id: "rejected", label: "مرفوض" },
  { id: "flagged", label: "مبلغ عنه" },
  { id: "top_views", label: "الأعلى مشاهدة" },
  { id: "top_engagement", label: "الأعلى تفاعلًا" },
  { id: "reported", label: "بلاغات" },
];

export function PlatformAdminCommunityModerationClient() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (offset: number, signal?: AbortSignal) => {
    const r = await fetch(
      `/api/platform-admin/community-posts?limit=${PAGE_SIZE}&offset=${offset}`,
      signal ? { credentials: "include", signal } : { credentials: "include" },
    );
    const j = (await r.json()) as {
      ok?: boolean;
      posts?: CommunityPost[];
      hasMore?: boolean;
      message?: string;
    };
    if (!r.ok || !j.ok) throw new Error(j.message ?? "تعذر التحميل");
    return { list: j.posts ?? [], more: Boolean(j.hasMore) };
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setPosts(null);
    setHasMore(false);
    fetchPage(0, ac.signal)
      .then(({ list, more }) => {
        setPosts(list);
        setHasMore(more);
        setError(null);
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted) return;
        setError(e instanceof Error ? e.message : "تعذر التحميل");
        setPosts(null);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!posts || loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchPage(posts.length)
      .then(({ list, more }) => {
        setPosts((prev) => (prev ? [...prev, ...list] : list));
        setHasMore(more);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [posts, hasMore, loadingMore, fetchPage]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    let list = [...posts];
    if (tab === "pending") list = list.filter((p) => p.reviewStatus === "pending");
    else if (tab === "approved") list = list.filter((p) => p.reviewStatus === "approved");
    else if (tab === "rejected") list = list.filter((p) => p.reviewStatus === "rejected");
    else if (tab === "flagged" || tab === "reported") list = list.filter((p) => p.reportsCount > 0);
    else if (tab === "recent") list = [...list].reverse();
    else if (tab === "top_views") list.sort((a, b) => b.views - a.views);
    else if (tab === "top_engagement")
      list.sort((a, b) => b.likes + b.comments.length - (a.likes + a.comments.length));
    return list;
  }, [tab, posts]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl min-w-0 px-4 py-16 text-center text-sm font-bold text-riwaq-muted">
        جاري التحميل…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl min-w-0 px-4 py-10">
        <DataErrorState message={error} />
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="mx-auto max-w-7xl min-w-0 space-y-6 px-4 py-10">
        <DataEmptyState title="لا منشورات" description="لا توجد صفوف في community_posts بعد." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl min-w-0 space-y-6">
      <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-lg backdrop-blur-xl sm:p-6">
        <h1 className="text-2xl font-extrabold text-riwaq-brown">مراقبة المجتمع</h1>
        <p className="mt-2 text-sm font-bold text-riwaq-muted">بيانات من Supabase (author + cafe) عبر مسار إدارة المنصة.</p>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-extrabold transition ${
              tab === t.id
                ? "bg-riwaq-brown text-white shadow-md"
                : "bg-white/90 text-riwaq-muted ring-1 ring-riwaq-beige hover:bg-riwaq-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="scrollbar-none hidden overflow-x-auto rounded-3xl border border-riwaq-beige bg-white/90 shadow-sm md:block">
        <table className="w-full min-w-[900px] text-right text-xs">
          <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-[10px] font-extrabold uppercase text-riwaq-muted">
            <tr>
              <th className="px-3 py-3">الناشر</th>
              <th className="px-3 py-3">الكوفي</th>
              <th className="px-3 py-3">النوع</th>
              <th className="px-3 py-3">النص</th>
              <th className="px-3 py-3">مشاهدات</th>
              <th className="px-3 py-3">لايك</th>
              <th className="px-3 py-3">تعليقات</th>
              <th className="px-3 py-3">بلاغات</th>
              <th className="px-3 py-3">مكافأة</th>
              <th className="px-3 py-3">حالة</th>
              <th className="px-3 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-riwaq-beige/60 font-bold last:border-0 hover:bg-riwaq-cream/40">
                <td className="px-3 py-3 whitespace-nowrap">{p.authorName}</td>
                <td className="px-3 py-3">{p.cafeName}</td>
                <td className="px-3 py-3">{p.postKind}</td>
                <td className="max-w-[180px] truncate px-3 py-3 text-[11px] text-riwaq-muted">{p.body}</td>
                <td className="px-3 py-3">{p.views.toLocaleString("ar-SA")}</td>
                <td className="px-3 py-3">{p.likes.toLocaleString("ar-SA")}</td>
                <td className="px-3 py-3">{p.comments.length}</td>
                <td className="px-3 py-3">{p.reportsCount}</td>
                <td className="px-3 py-3">{p.rewardEligible ? "نعم" : "لا"}</td>
                <td className="px-3 py-3">{reviewStatusLabelsAr[p.reviewStatus]}</td>
                <td className="px-3 py-3 text-[10px] text-riwaq-muted">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore ? (
        <div className="flex justify-center pb-4">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-2xl border border-riwaq-beige bg-white/90 px-5 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm ring-1 ring-riwaq-beige/80 disabled:opacity-50"
          >
            {loadingMore ? "جاري التحميل…" : "تحميل المزيد"}
          </button>
        </div>
      ) : null}

      <p className="text-center text-xs font-bold text-riwaq-muted md:hidden">لعرض الجدول كاملًا استخدم شاشة أوسع.</p>
    </div>
  );
}
