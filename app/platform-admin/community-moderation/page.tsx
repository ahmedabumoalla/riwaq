"use client";

import { useMemo, useState } from "react";
import { communityPosts, reviewStatusLabelsAr, type ReviewStatus } from "@/lib/mock/community";

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

export default function PlatformAdminCommunityModerationPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");

  const filtered = useMemo(() => {
    let list = [...communityPosts];
    if (tab === "pending") list = list.filter((p) => p.reviewStatus === "pending");
    else if (tab === "approved") list = list.filter((p) => p.reviewStatus === "approved");
    else if (tab === "rejected") list = list.filter((p) => p.reviewStatus === "rejected");
    else if (tab === "flagged" || tab === "reported") list = list.filter((p) => p.reportsCount > 0);
    else if (tab === "recent") list = [...list].reverse();
    else if (tab === "top_views") list.sort((a, b) => b.views - a.views);
    else if (tab === "top_engagement") list.sort((a, b) => b.likes + b.comments.length - (a.likes + a.comments.length));
    return list;
  }, [tab]);

  return (
    <div className="mx-auto max-w-7xl min-w-0 space-y-6">
      <div className="rounded-3xl border border-white/90 bg-white/90 p-5 shadow-lg backdrop-blur-xl sm:p-6">
        <h1 className="text-2xl font-extrabold text-riwaq-brown">مراقبة المجتمع</h1>
        <p className="mt-2 text-sm font-bold text-riwaq-muted">لوحة تحكم كاملة للمنشورات والمكافآت ومنع التلاعب (واجهة).</p>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-extrabold transition ${
              tab === t.id ? "bg-riwaq-brown text-white shadow-md" : "bg-white/90 text-riwaq-muted ring-1 ring-riwaq-beige hover:bg-riwaq-cream"
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
                <td className="px-3 py-3">{p.rewardEligible ? p.rewardPointsPreview : "—"}</td>
                <td className="px-3 py-3">{reviewStatusLabelsAr[p.reviewStatus]}</td>
                <td className="px-2 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(["قبول", "رفض", "إخفاء", "حذف", "بلاغات", "مكافأة", "حظر", "جودة"] as const).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => window.alert(a)}
                        className="rounded-lg border border-riwaq-beige bg-white px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {filtered.map((p) => (
          <li key={p.id} className="rounded-3xl border border-riwaq-beige bg-white/90 p-4 shadow-sm">
            <p className="font-extrabold text-riwaq-brown">{p.authorName}</p>
            <p className="text-xs font-bold text-riwaq-muted">{p.cafeName}</p>
            <p className="mt-2 text-sm font-bold">{p.body}</p>
            <p className="mt-2 text-[11px] text-riwaq-muted">{reviewStatusLabelsAr[p.reviewStatus]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
