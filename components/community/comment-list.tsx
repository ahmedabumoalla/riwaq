"use client";

import { BadgeCheck } from "lucide-react";
import type { CommunityComment } from "@/lib/mock/community";

export function CommentList({
  comments,
  onAddComment,
}: {
  comments: CommunityComment[];
  onAddComment?: (text: string) => void;
}) {
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="rounded-2xl border border-riwaq-beige/80 bg-riwaq-cream/35 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-riwaq-brown">{c.author}</span>
              {c.isVip ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-extrabold text-violet-800">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                  عميل مميز
                </span>
              ) : null}
              <span className="text-[10px] font-bold text-riwaq-muted">{c.createdAt.slice(0, 10)}</span>
            </div>
            <p className="mt-1 text-sm font-bold leading-relaxed text-riwaq-muted">{c.text}</p>
            {c.replies?.length ? (
              <ul className="mt-2 space-y-1 border-r-2 border-riwaq-caramel/40 pr-3">
                {c.replies.map((r) => (
                  <li key={r.id} className="text-xs font-bold text-riwaq-brown">
                    <span className="text-riwaq-caramel">{r.author}:</span> {r.text}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
      {onAddComment ? (
        <AddCommentForm onSubmit={onAddComment} />
      ) : null}
    </div>
  );
}

function AddCommentForm({ onSubmit }: { onSubmit: (t: string) => void }) {
  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const t = String(fd.get("c") ?? "").trim();
        if (!t) return;
        onSubmit(t);
        e.currentTarget.reset();
      }}
    >
      <input
        name="c"
        placeholder="أضف تعليقًا…"
        className="min-w-0 flex-1 rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-sm font-bold text-riwaq-brown placeholder:text-riwaq-muted/70"
      />
      <button
        type="submit"
        className="touch-target shrink-0 rounded-2xl bg-riwaq-brown px-4 text-xs font-extrabold text-white hover:bg-riwaq-brown/90"
      >
        إرسال
      </button>
    </form>
  );
}
