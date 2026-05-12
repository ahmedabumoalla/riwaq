/** هيكل تحميل موحّد لمسارات لوحات التحكم — بدون تغيير ألوان التصميم */
export function DashboardRouteLoading() {
  return (
    <div className="mx-auto max-w-7xl min-w-0 space-y-6 py-4" aria-busy aria-label="جاري التحميل">
      <div className="h-10 w-48 animate-pulse rounded-2xl bg-riwaq-beige/60" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-3xl border border-riwaq-beige/90 bg-white/80 shadow-sm"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-3xl border border-riwaq-beige/90 bg-white/70 shadow-sm" />
    </div>
  );
}
