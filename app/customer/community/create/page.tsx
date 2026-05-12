import type { Metadata } from "next";
import Link from "next/link";
import { CreatePostForm } from "@/components/community/create-post-form";
import { DataEmptyState, DataErrorState } from "@/components/ui/data-state";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "إنشاء منشور",
};

export default async function CustomerCommunityCreatePage() {
  const supabase = await createClient();
  const { data: cafes, error } = await supabase.from("cafes").select("id, name").eq("is_active", true).order("name").limit(200);

  if (error) {
    return (
      <div className="min-w-0 space-y-6 px-1 py-8">
        <DataErrorState message={error.message} />
      </div>
    );
  }

  const cafeOptions = (cafes ?? []) as { id: string; name: string }[];

  if (!cafeOptions.length) {
    return (
      <div className="min-w-0 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-riwaq-brown">إنشاء منشور</h1>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">لا توجد كافيهات نشطة في النظام بعد.</p>
          </div>
          <Link
            href="/customer/community"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-white px-4 text-sm font-extrabold text-riwaq-brown shadow-sm hover:bg-riwaq-cream"
          >
            العودة للمجتمع
          </Link>
        </div>
        <DataEmptyState title="لا كافيهات للاختيار" description="أضف كافيهًا نشطًا في Supabase ليظهر في القائمة." />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-riwaq-brown">إنشاء منشور</h1>
          <p className="mt-1 text-sm font-bold text-riwaq-muted">يُحفظ كـ pending حتى مراجعة الكوفي أو إدارة المنصة.</p>
        </div>
        <Link
          href="/customer/community"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-white px-4 text-sm font-extrabold text-riwaq-brown shadow-sm hover:bg-riwaq-cream"
        >
          العودة للمجتمع
        </Link>
      </div>
      <CreatePostForm cafeOptions={cafeOptions} />
    </div>
  );
}
