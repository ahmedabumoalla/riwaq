"use client";

import { ImagePlus, Send, Video } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/community/post-card";
import { createCustomerCommunityPostAction } from "@/app/customer/community/actions";
import { postKindLabelsAr, type CommunityPost, type PostKind } from "@/lib/mock/community";

const kinds: PostKind[] = [
  "experience",
  "photo",
  "video",
  "tip",
  "recipe",
  "table_experience",
  "product_experience",
  "cafe_review",
  "product_suggestion",
  "visit_story",
];

export function CreatePostForm({ cafeOptions }: { cafeOptions: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [kind, setKind] = useState<PostKind>("experience");
  const [cafeId, setCafeId] = useState(cafeOptions[0]?.id ?? "");
  const [product, setProduct] = useState("");
  const [table, setTable] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("#رواق ");
  const [rewardLink, setRewardLink] = useState(false);
  const [media, setMedia] = useState<"none" | "image" | "video">("image");

  const previewCafeName = useMemo(() => cafeOptions.find((c) => c.id === cafeId)?.name ?? "الكوفي", [cafeId, cafeOptions]);

  const preview = useMemo((): CommunityPost => {
    return {
      id: "preview",
      authorName: "أنت",
      authorKind: "customer",
      authorAvatarInitials: "أن",
      cafeId: cafeId || "—",
      cafeName: previewCafeName,
      productName: product || undefined,
      tableLabel: table || undefined,
      postKind: kind,
      mediaType: media === "none" ? "none" : media,
      mediaPlaceholderLabel: media === "video" ? "معاينة فيديو" : media === "image" ? "معاينة صورة" : "",
      body: body || "اكتب تجربتك هنا…",
      hashtags: tags
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean),
      likes: 0,
      comments: [],
      shares: 0,
      saves: 0,
      views: 0,
      reviewStatus: "pending",
      reportsCount: 0,
      rewardEligible: rewardLink,
      rewardPointsPreview: rewardLink ? 120 : 0,
    };
  }, [kind, cafeId, product, table, body, tags, rewardLink, media, previewCafeName]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        className="space-y-4 rounded-3xl border border-white/90 bg-white/85 p-5 shadow-lg backdrop-blur-xl sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setFeedback(null);
          if (!cafeId) {
            setFeedback({ type: "err", text: "اختر كوفيًا." });
            return;
          }
          const hashtagList = tags
            .split(/\s+/)
            .map((t) => t.trim())
            .filter(Boolean);
          startTransition(async () => {
            const res = await createCustomerCommunityPostAction({
              cafeId,
              postKind: kind,
              body,
              hashtags: hashtagList,
              mediaType: media,
              productName: product.trim() || undefined,
              tableLabel: table.trim() || undefined,
              rewardEligible: rewardLink,
            });
            if (!res.ok) {
              setFeedback({ type: "err", text: res.message });
              return;
            }
            setFeedback({ type: "ok", text: "تم إرسال المنشور للمراجعة (pending)." });
            router.push("/customer/community");
            router.refresh();
          });
        }}
      >
        {feedback?.type === "err" ? (
          <p className="rounded-2xl border border-red-200 bg-red-50/90 px-3 py-2 text-sm font-bold text-red-800">{feedback.text}</p>
        ) : null}

        <div>
          <label className="text-xs font-extrabold text-riwaq-muted">نوع المنشور</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as PostKind)}
            className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white py-3 pr-3 text-sm font-bold text-riwaq-brown"
          >
            {kinds.map((k) => (
              <option key={k} value={k}>
                {postKindLabelsAr[k]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-extrabold text-riwaq-muted">الكوفي</label>
          <select
            value={cafeId}
            onChange={(e) => setCafeId(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white py-3 pr-3 text-sm font-bold"
          >
            {cafeOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-extrabold text-riwaq-muted">المنتج (اختياري)</label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-sm font-bold"
              placeholder="مثال: فلات وايت"
            />
          </div>
          <div>
            <label className="text-xs font-extrabold text-riwaq-muted">الطاولة (اختياري)</label>
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-sm font-bold"
              placeholder="مثال: رووف ٢"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-extrabold text-riwaq-muted">النص</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="mt-1 w-full resize-y rounded-2xl border border-riwaq-beige bg-white px-3 py-3 text-sm font-bold leading-relaxed"
            placeholder="اكتب تجربتك أو نصيحتك…"
          />
        </div>

        <div>
          <label className="text-xs font-extrabold text-riwaq-muted">الهاشتاقات</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-sm font-bold"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="text-xs font-extrabold text-riwaq-muted">وسائط</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMedia("image")}
              className={`inline-flex min-h-11 items-center gap-2 rounded-2xl border px-3 text-xs font-extrabold ${
                media === "image" ? "border-riwaq-caramel bg-riwaq-caramel/10 text-riwaq-brown" : "border-riwaq-beige"
              }`}
            >
              <ImagePlus className="h-4 w-4" /> صورة
            </button>
            <button
              type="button"
              onClick={() => setMedia("video")}
              className={`inline-flex min-h-11 items-center gap-2 rounded-2xl border px-3 text-xs font-extrabold ${
                media === "video" ? "border-riwaq-caramel bg-riwaq-caramel/10" : "border-riwaq-beige"
              }`}
            >
              <Video className="h-4 w-4" /> فيديو
            </button>
            <button
              type="button"
              onClick={() => setMedia("none")}
              className={`inline-flex min-h-11 rounded-2xl border px-3 text-xs font-extrabold ${
                media === "none" ? "border-riwaq-caramel bg-riwaq-caramel/10" : "border-riwaq-beige"
              }`}
            >
              بدون
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-riwaq-green/25 bg-riwaq-green/5 p-3">
          <input type="checkbox" checked={rewardLink} onChange={(e) => setRewardLink(e.target.checked)} className="mt-1" />
          <span className="text-sm font-bold text-riwaq-brown">ربط المنشور بحملة مكافآت المشاهدات (عند توفرها)</span>
        </label>

        <button
          type="submit"
          disabled={pending || !cafeOptions.length}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-riwaq-brown text-sm font-extrabold text-white shadow-lg hover:bg-riwaq-brown/90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {pending ? "جاري الإرسال…" : "إرسال للمراجعة"}
        </button>
      </form>

      <div>
        <h3 className="mb-3 text-sm font-extrabold text-riwaq-muted">معاينة مباشرة</h3>
        <PostCard post={preview} showFullComments={false} />
      </div>
    </div>
  );
}
