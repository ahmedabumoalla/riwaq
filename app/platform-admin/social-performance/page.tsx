"use client";

import { ExternalLink } from "lucide-react";
import { SOCIAL_PLATFORM_LABELS_AR, socialPosts } from "@/lib/mock/platform-admin";

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

function act(m: string) {
  return () => window.alert(`تجريبي: ${m}`);
}

export default function PlatformAdminSocialPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <p className="text-sm font-bold text-riwaq-muted">مركز إيراد ومراجعة محتوى العملاء عبر المنصات.</p>

      <div className="overflow-x-auto rounded-3xl border border-riwaq-beige bg-white shadow-sm">
        <table className="w-full min-w-[1100px] text-right text-xs">
          <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-[10px] font-extrabold text-riwaq-muted">
            <tr>
              <th className="px-3 py-3">الكوفي</th>
              <th className="px-3 py-3">العميل</th>
              <th className="px-3 py-3">المنصة</th>
              <th className="px-3 py-3">مشاهدات</th>
              <th className="px-3 py-3">لايك</th>
              <th className="px-3 py-3">تعليق</th>
              <th className="px-3 py-3">مشاركة</th>
              <th className="px-3 py-3">تفاعل٪</th>
              <th className="px-3 py-3">مكافأة</th>
              <th className="px-3 py-3">مراجعة</th>
              <th className="px-3 py-3">صرف؟</th>
              <th className="px-3 py-3">إيراد المنصة</th>
              <th className="px-3 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {socialPosts.map((p) => (
              <tr key={p.id} className="border-b border-riwaq-beige/70 font-bold last:border-0 hover:bg-riwaq-cream/30">
                <td className="px-3 py-3">{p.cafeName}</td>
                <td className="px-3 py-3">{p.customerName}</td>
                <td className="px-3 py-3">{SOCIAL_PLATFORM_LABELS_AR[p.platform]}</td>
                <td className="px-3 py-3">{fmt(p.views)}</td>
                <td className="px-3 py-3">{fmt(p.likes)}</td>
                <td className="px-3 py-3">{fmt(p.comments)}</td>
                <td className="px-3 py-3">{fmt(p.shares)}</td>
                <td className="px-3 py-3">{p.engagementRate.toFixed(1)}</td>
                <td className="px-3 py-3">{fmt(p.rewardCalculated)}</td>
                <td className="px-3 py-3">{p.reviewStatus}</td>
                <td className="px-3 py-3">{p.rewardPaid ? "نعم" : "لا"}</td>
                <td className="px-3 py-3">{fmt(p.platformRevenueFromPost)}</td>
                <td className="px-2 py-2">
                  <div className="flex flex-wrap gap-1">
                    <button type="button" onClick={act("قبول")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      قبول
                    </button>
                    <button type="button" onClick={act("رفض")} className="rounded-lg border border-red-200 px-2 py-1 text-[10px] font-extrabold text-red-800 hover:bg-red-50">
                      رفض
                    </button>
                    <button type="button" onClick={act("صرف")} className="rounded-lg border border-riwaq-green/40 px-2 py-1 text-[10px] font-extrabold text-riwaq-green hover:bg-emerald-50">
                      صرف
                    </button>
                    <button type="button" onClick={act("مميز")} className="rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream">
                      مميز
                    </button>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-riwaq-beige px-2 py-1 text-[10px] font-extrabold hover:bg-riwaq-cream"
                    >
                      <ExternalLink className="h-3 w-3" /> رابط
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
