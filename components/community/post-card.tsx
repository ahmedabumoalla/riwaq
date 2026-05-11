"use client";

import {
  Bookmark,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  Package,
  Share2,
  Store,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CommentList } from "@/components/community/comment-list";
import type { CommunityPost } from "@/lib/mock/community";
import { postKindLabelsAr, reviewStatusLabelsAr } from "@/lib/mock/community";

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

export function PostCard({ post, showFullComments }: { post: CommunityPost; showFullComments?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [localComments, setLocalComments] = useState(post.comments);

  const previewComments = useMemo(
    () => (showFullComments ? localComments : localComments.slice(0, 2)),
    [localComments, showFullComments]
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-white/90 bg-white/88 shadow-lg shadow-riwaq-brown/8 ring-1 ring-riwaq-beige/80 backdrop-blur-xl">
      <div className="flex items-start gap-3 border-b border-riwaq-beige/70 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-riwaq-brown to-[#2a1810] text-sm font-extrabold text-white shadow-md">
          {post.authorAvatarInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-extrabold text-riwaq-brown">{post.authorName}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-riwaq-cream px-2 py-0.5 text-[10px] font-extrabold text-riwaq-muted ring-1 ring-riwaq-beige">
              {post.authorKind === "cafe" ? (
                <>
                  <Store className="h-3.5 w-3.5 text-riwaq-caramel" /> كوفي
                </>
              ) : (
                <>
                  <User className="h-3.5 w-3.5" /> عميل
                </>
              )}
            </span>
            {post.engagementBadge === "trending" ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">ترند</span>
            ) : null}
            {post.engagementBadge === "top_creator" ? (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-extrabold text-violet-900">صانع محتوى</span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-bold text-riwaq-muted">
            {postKindLabelsAr[post.postKind]} ·{" "}
            <Link href={`/customer/cafes/${post.cafeId}`} className="text-riwaq-caramel hover:underline">
              {post.cafeName}
            </Link>
            {post.productName ? ` · ${post.productName}` : ""}
            {post.tableLabel ? ` · ${post.tableLabel}` : ""}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-riwaq-cream px-2 py-1 text-[10px] font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
          {reviewStatusLabelsAr[post.reviewStatus]}
        </span>
      </div>

      {post.mediaType !== "none" ? (
        <div className="relative aspect-[16/10] w-full bg-linear-to-br from-riwaq-beige/80 via-riwaq-cream to-riwaq-caramel/20">
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-sm font-extrabold text-riwaq-brown/80">{post.mediaPlaceholderLabel}</p>
            <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2 py-1 text-[10px] font-extrabold text-white">
              {post.mediaType === "video" ? "فيديو" : "صورة"} · Placeholder
            </span>
          </div>
        </div>
      ) : null}

      <div className="space-y-2 p-4">
        <p className="text-sm font-bold leading-relaxed text-riwaq-brown">{post.body}</p>
        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((h) => (
            <span key={h} className="rounded-full bg-riwaq-caramel/12 px-2.5 py-1 text-[11px] font-extrabold text-riwaq-caramel ring-1 ring-riwaq-caramel/25">
              {h}
            </span>
          ))}
        </div>
        {post.rewardEligible ? (
          <p className="rounded-2xl border border-riwaq-green/25 bg-riwaq-green/8 px-3 py-2 text-xs font-extrabold text-riwaq-green">
            +{post.rewardPointsPreview.toLocaleString("ar-SA")} نقطة محتملة عند اعتماد التجربة · مشاهدات {fmt(post.views)}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-1 border-t border-riwaq-beige/70 px-2 py-2">
        <button
          type="button"
          onClick={() => {
            setLiked((v) => {
              setLikes((n) => n + (v ? -1 : 1));
              return !v;
            });
          }}
          className={`inline-flex min-h-11 min-w-11 flex-1 items-center justify-center gap-1.5 rounded-2xl text-xs font-extrabold transition sm:flex-none sm:px-4 ${
            liked ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "text-riwaq-muted hover:bg-riwaq-cream"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} aria-hidden />
          {fmt(likes)}
        </button>
        <span className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-2xl text-xs font-extrabold text-riwaq-muted sm:flex-none sm:px-3">
          <MessageCircle className="h-4 w-4" aria-hidden />
          {fmt(localComments.length)}
        </span>
        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl text-xs font-extrabold transition sm:px-3 ${
            saved ? "bg-riwaq-caramel/15 text-riwaq-caramel" : "text-riwaq-muted hover:bg-riwaq-cream"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} aria-hidden />
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl text-xs font-extrabold text-riwaq-muted hover:bg-riwaq-cream sm:px-3"
          onClick={() => window.alert("مشاركة — واجهة فقط")}
        >
          <Share2 className="h-4 w-4" aria-hidden />
        </button>
        <span className="inline-flex min-h-11 items-center justify-center gap-1 rounded-2xl px-2 text-[11px] font-extrabold text-riwaq-muted">
          <Eye className="h-4 w-4" aria-hidden />
          {fmt(post.views)}
        </span>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl text-riwaq-muted hover:bg-red-50 hover:text-red-700 sm:px-2"
          onClick={() => window.alert("تم تسجيل البلاغ (وهمي)")}
        >
          <Flag className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="border-t border-riwaq-beige/70 p-4">
        <CommentList
          comments={previewComments}
          onAddComment={
            showFullComments
              ? (text) => {
                  setLocalComments((prev) => [
                    ...prev,
                    {
                      id: `local-${Date.now()}`,
                      author: "أنت",
                      authorKind: "customer",
                      text,
                      createdAt: new Date().toISOString(),
                    },
                  ]);
                }
              : undefined
          }
        />
        {!showFullComments && post.comments.length > 2 ? (
          <Link href="/customer/community" className="mt-2 inline-block text-xs font-extrabold text-riwaq-caramel hover:underline">
            عرض كل التعليقات
          </Link>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-riwaq-beige/70 bg-riwaq-cream/30 p-3">
        <button
          type="button"
          onClick={() => setFollowing((f) => !f)}
          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-2xl border px-3 text-xs font-extrabold transition sm:flex-none ${
            following ? "border-riwaq-caramel bg-riwaq-caramel/15 text-riwaq-brown" : "border-riwaq-beige bg-white text-riwaq-brown hover:bg-riwaq-cream"
          }`}
        >
          <UserPlus className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {following ? "متابَع" : "متابعة الكوفي"}
        </button>
        <Link
          href={`/customer/cafes/${post.cafeId}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-riwaq-beige bg-white px-3 text-xs font-extrabold text-riwaq-brown shadow-sm hover:bg-riwaq-cream sm:flex-none"
        >
          عرض الكوفي
        </Link>
        {post.productName ? (
          <Link
            href="/customer/menu"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-2xl border border-riwaq-caramel/40 bg-white px-3 text-xs font-extrabold text-riwaq-caramel hover:bg-riwaq-caramel/10 sm:flex-none"
          >
            <Package className="h-3.5 w-3.5 shrink-0" aria-hidden />
            عرض المنتج
          </Link>
        ) : null}
        <Link
          href="/customer/reservations"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-riwaq-brown px-3 text-xs font-extrabold text-white shadow-sm hover:bg-riwaq-brown/90 sm:flex-none"
        >
          حجز طاولة
        </Link>
        <Link
          href="/customer/menu"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-riwaq-green/40 bg-white px-3 text-xs font-extrabold text-riwaq-green hover:bg-emerald-50 sm:flex-none"
        >
          المنيو
        </Link>
      </div>
    </article>
  );
}
