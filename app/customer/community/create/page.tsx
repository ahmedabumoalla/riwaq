import type { Metadata } from "next";
import Link from "next/link";
import { CreatePostForm } from "@/components/community/create-post-form";

export const metadata: Metadata = {
  title: "إنشاء منشور",
};

export default function CustomerCommunityCreatePage() {
  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-riwaq-brown">إنشاء منشور</h1>
          <p className="mt-1 text-sm font-bold text-riwaq-muted">معاينة مباشرة قبل النشر — الربط بالخادم لاحقًا.</p>
        </div>
        <Link
          href="/customer/community"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-white px-4 text-sm font-extrabold text-riwaq-brown shadow-sm hover:bg-riwaq-cream"
        >
          العودة للمجتمع
        </Link>
      </div>
      <CreatePostForm />
    </div>
  );
}
