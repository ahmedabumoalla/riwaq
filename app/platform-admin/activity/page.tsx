import { ACTIVITY_TYPE_LABELS_AR, activityLog } from "@/lib/mock/platform-admin";

export default function PlatformAdminActivityPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <p className="text-sm font-bold text-riwaq-muted">سجل موحّد لحركات المنصة — حقول JSON قبل/بعد جاهزة للربط لاحقًا.</p>

      <div className="overflow-x-auto rounded-3xl border border-riwaq-beige bg-white shadow-sm">
        <table className="w-full min-w-[960px] text-right text-xs">
          <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-[10px] font-extrabold text-riwaq-muted">
            <tr>
              <th className="px-3 py-3">المنفّذ</th>
              <th className="px-3 py-3">نوع المستخدم</th>
              <th className="px-3 py-3">الكوفي</th>
              <th className="px-3 py-3">الفرع</th>
              <th className="px-3 py-3">العملية</th>
              <th className="px-3 py-3">قبل</th>
              <th className="px-3 py-3">بعد</th>
              <th className="px-3 py-3">التاريخ</th>
              <th className="px-3 py-3">IP</th>
              <th className="px-3 py-3">الجهاز</th>
            </tr>
          </thead>
          <tbody>
            {activityLog.map((l) => (
              <tr key={l.id} className="border-b border-riwaq-beige/70 font-bold last:border-0 hover:bg-riwaq-cream/30">
                <td className="px-3 py-3 whitespace-nowrap">{l.actorName}</td>
                <td className="px-3 py-3">{l.actorRole}</td>
                <td className="px-3 py-3">{l.cafeName ?? "—"}</td>
                <td className="px-3 py-3">{l.branchName ?? "—"}</td>
                <td className="px-3 py-3">{ACTIVITY_TYPE_LABELS_AR[l.activityType]}</td>
                <td className="max-w-[120px] truncate px-3 py-3 font-mono text-[10px] text-riwaq-muted">{l.beforeJson ?? "—"}</td>
                <td className="max-w-[120px] truncate px-3 py-3 font-mono text-[10px] text-riwaq-muted">{l.afterJson ?? "—"}</td>
                <td className="px-3 py-3 whitespace-nowrap text-[11px]">{l.occurredAt}</td>
                <td className="px-3 py-3 font-mono text-[10px] text-riwaq-muted">{l.ip}</td>
                <td className="px-3 py-3 text-[11px] text-riwaq-muted">{l.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
