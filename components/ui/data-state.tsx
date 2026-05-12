"use client";

import { AlertCircle, Inbox } from "lucide-react";

export function DataErrorState({
  title = "تعذر تحميل البيانات",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-red-200/90 bg-linear-to-br from-red-50/95 to-white p-8 text-center shadow-lg ring-1 ring-red-100">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertCircle className="h-8 w-8" aria-hidden />
      </div>
      <h2 className="mt-5 text-lg font-extrabold text-riwaq-brown">{title}</h2>
      <p className="mt-2 text-sm font-bold leading-relaxed text-riwaq-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-riwaq-brown px-6 text-sm font-extrabold text-white shadow-md hover:bg-riwaq-brown/90"
        >
          إعادة المحاولة
        </button>
      ) : null}
    </div>
  );
}

export function DataEmptyState({
  title = "لا توجد بيانات بعد",
  description = "عندما تُضاف بيانات في Supabase ستظهر هنا تلقائيًا.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-riwaq-beige/90 bg-linear-to-br from-riwaq-cream/80 to-white p-8 text-center shadow-sm ring-1 ring-riwaq-beige/60">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-riwaq-cream text-riwaq-caramel">
        <Inbox className="h-8 w-8" aria-hidden />
      </div>
      <h2 className="mt-5 text-lg font-extrabold text-riwaq-brown">{title}</h2>
      <p className="mt-2 text-sm font-bold leading-relaxed text-riwaq-muted">{description}</p>
    </div>
  );
}
