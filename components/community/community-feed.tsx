"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/community/post-card";
import type { CommunityPost } from "@/lib/mock/community";

export function CommunityFeed({
  posts,
  showComposerCta = true,
  dense = false,
}: {
  posts: CommunityPost[];
  showComposerCta?: boolean;
  dense?: boolean;
}) {
  return (
    <div className="space-y-4">
      {showComposerCta ? (
        <div className="flex flex-col gap-3 rounded-3xl border border-riwaq-beige/90 bg-linear-to-l from-white to-riwaq-cream/60 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-riwaq-caramel/20 text-riwaq-caramel ring-1 ring-riwaq-caramel/30">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-extrabold text-riwaq-brown">شارك تجربتك واربح نقاطًا</p>
              <p className="mt-0.5 text-xs font-bold text-riwaq-muted">منشورات معتمدة من الكوفي تمنح مكافآت إضافية.</p>
            </div>
          </div>
          <Link
            href="/customer/community/create"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl bg-riwaq-brown px-5 text-sm font-extrabold text-white shadow-md hover:bg-riwaq-brown/90"
          >
            إنشاء منشور
          </Link>
        </div>
      ) : null}

      <div className="rounded-3xl border border-riwaq-green/25 bg-linear-to-l from-emerald-50/90 to-white p-4 text-sm font-bold leading-relaxed text-riwaq-brown shadow-sm ring-1 ring-riwaq-green/15 sm:p-5">
        <p className="font-extrabold text-riwaq-green">ربط المكافآت</p>
        <p className="mt-2 text-riwaq-muted">
          تجربة منشورة → نقاط أساسية. زيادة المشاهدات → نقاط إضافية. تفاعل عالٍ → شارة «ترند» أو «صانع محتوى». اعتماد
          الكوفي للمنشور → مكافأة نقدية أو نقاط (واجهة تجريبية).
        </p>
      </div>

      <div className={dense ? "space-y-3" : "space-y-6"}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} showFullComments={false} />
        ))}
      </div>
    </div>
  );
}
