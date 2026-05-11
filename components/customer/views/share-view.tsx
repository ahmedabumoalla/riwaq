"use client";

import { Link2, Trophy } from "lucide-react";
import { useState } from "react";
import { mockShareSubmissions, shareLeaderboardMock } from "@/lib/mock/customer-app";

const platforms = ["TikTok", "Instagram", "Snapchat", "X"] as const;
const contentTypes = ["صورة", "فيديو", "Story", "Reel", "TikTok"] as const;
const linked = ["طلب", "حجز طاولة", "منتج", "طاولة مميزة"] as const;

export function CustomerShareView() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<(typeof platforms)[number]>("Instagram");
  const [ctype, setCtype] = useState<(typeof contentTypes)[number]>("Reel");
  const [linkKind, setLinkKind] = useState<(typeof linked)[number]>("حجز طاولة");
  const [views, setViews] = useState(4200);
  const [likes, setLikes] = useState(310);
  const [comments, setComments] = useState(24);
  const [shares, setShares] = useState(18);

  return (
    <div className="space-y-8 pb-4">
      <div>
        <h1 className="font-extrabold text-2xl text-riwaq-brown">شارك تجربتك</h1>
        <p className="mt-1 text-sm font-bold text-riwaq-muted">
          وثّق منشورك واحصل على نقاط ومكافآت — كل المراجعات هنا للعرض التسويقي فقط
        </p>
      </div>

      <section className="rounded-[1.75rem] border border-white/95 bg-white/90 p-5 shadow-xl ring-1 ring-riwaq-beige/90">
        <h2 className="flex items-center gap-2 font-extrabold text-lg text-riwaq-brown">
          <Link2 className="h-5 w-5 text-riwaq-caramel" aria-hidden />
          إرسال رابط المنشور
        </h2>
        <div className="mt-5 grid gap-4">
          <label className="block text-[11px] font-extrabold text-riwaq-muted">
            رابط المنشور
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold outline-none ring-riwaq-caramel/25 focus:ring-2"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-[11px] font-extrabold text-riwaq-muted">
              المنصة
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as (typeof platforms)[number])}
                className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold outline-none ring-riwaq-caramel/25 focus:ring-2"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[11px] font-extrabold text-riwaq-muted">
              نوع المحتوى
              <select
                value={ctype}
                onChange={(e) => setCtype(e.target.value as (typeof contentTypes)[number])}
                className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold outline-none ring-riwaq-caramel/25 focus:ring-2"
              >
                {contentTypes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block text-[11px] font-extrabold text-riwaq-muted">
            التجربة المرتبطة
            <select
              value={linkKind}
              onChange={(e) => setLinkKind(e.target.value as (typeof linked)[number])}
              className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold outline-none ring-riwaq-caramel/25 focus:ring-2"
            >
              {linked.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label className="block text-[11px] font-extrabold text-riwaq-muted">
              المشاهدات
              <input
                type="number"
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm font-bold tabular-nums outline-none ring-riwaq-caramel/25 focus:ring-2"
              />
            </label>
            <label className="block text-[11px] font-extrabold text-riwaq-muted">
              الإعجابات
              <input
                type="number"
                value={likes}
                onChange={(e) => setLikes(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm font-bold tabular-nums outline-none ring-riwaq-caramel/25 focus:ring-2"
              />
            </label>
            <label className="block text-[11px] font-extrabold text-riwaq-muted">
              التعليقات
              <input
                type="number"
                value={comments}
                onChange={(e) => setComments(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm font-bold tabular-nums outline-none ring-riwaq-caramel/25 focus:ring-2"
              />
            </label>
            <label className="block text-[11px] font-extrabold text-riwaq-muted">
              المشاركات
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2 text-sm font-bold tabular-nums outline-none ring-riwaq-caramel/25 focus:ring-2"
              />
            </label>
          </div>

          <button type="button" className="rounded-2xl bg-riwaq-green py-3 text-sm font-extrabold text-white shadow-lg">
            إرسال للمراجعة (وهمي)
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/95 bg-white/88 p-5 shadow-lg ring-1 ring-riwaq-beige/90">
        <h2 className="font-extrabold text-lg text-riwaq-brown">طلبات سابقة</h2>
        <div className="mt-4 space-y-4">
          {mockShareSubmissions.map((s) => (
            <article key={s.id} className="rounded-2xl bg-riwaq-cream/50 p-4 ring-1 ring-riwaq-beige/80">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-extrabold text-riwaq-brown">{s.id}</p>
                  <p className="mt-1 text-xs font-bold text-riwaq-muted">
                    {s.platform} · {s.contentType} · {s.linked}
                  </p>
                </div>
                <span
                  className={[
                    "rounded-full px-3 py-1 text-[11px] font-extrabold ring-1",
                    s.status === "تمت المكافأة"
                      ? "bg-riwaq-green/15 text-riwaq-green ring-riwaq-green/25"
                      : s.status === "مرفوض"
                        ? "bg-red-50 text-red-800 ring-red-100"
                        : s.status === "مقبول"
                          ? "bg-sky-50 text-sky-900 ring-sky-100"
                          : "bg-amber-50 text-amber-950 ring-amber-100",
                  ].join(" ")}
                >
                  {s.status}
                </span>
              </div>
              <p className="mt-3 text-[11px] font-bold text-riwaq-muted">
                مشاهدات {s.views.toLocaleString("ar-SA")} · إعجابات {s.likes.toLocaleString("ar-SA")} · تعليقات{" "}
                {s.comments.toLocaleString("ar-SA")} · مشاركات {s.shares.toLocaleString("ar-SA")}
              </p>
              <p className="mt-2 text-sm font-extrabold text-riwaq-caramel">مكافأة متوقعة: {s.rewardPreview}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-riwaq-caramel/30 bg-linear-to-br from-riwaq-caramel/12 via-white to-riwaq-green/8 p-5 shadow-lg ring-1 ring-riwaq-caramel/20">
        <h2 className="flex items-center gap-2 font-extrabold text-lg text-riwaq-brown">
          <Trophy className="h-6 w-6 text-riwaq-caramel" aria-hidden />
          لوحة المتصدرين — مسوّقو المحتوى
        </h2>
        <ul className="mt-5 space-y-3">
          {shareLeaderboardMock.map((row, idx) => (
            <li
              key={row.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-4 ring-1 ring-riwaq-beige"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-riwaq-brown text-sm font-extrabold text-white">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-extrabold text-riwaq-brown">{row.name}</p>
                  <p className="text-xs font-bold text-riwaq-muted">{row.platform}</p>
                </div>
              </div>
              <div className="text-end text-xs font-bold">
                <p className="text-riwaq-muted">مشاهدات</p>
                <p className="font-extrabold text-riwaq-brown">{row.views}</p>
                <p className="mt-2 text-riwaq-muted">مكافأة تراكمية</p>
                <p className="font-extrabold text-riwaq-green">{row.reward}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
