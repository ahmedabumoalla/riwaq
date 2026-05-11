"use client";

import { Bell, Mail, Phone, Settings } from "lucide-react";
import { useState } from "react";
import { PLATFORM_ROLE_LABELS_AR, type PlatformRole } from "@/lib/types/roles";

export type CustomerAccountSnapshot = {
  fullName: string;
  initials: string;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  role: PlatformRole;
  memberSince: string;
};

export function CustomerProfileView({ account }: { account: CustomerAccountSnapshot }) {
  const [ordersNotif, setOrdersNotif] = useState(true);
  const [resNotif, setResNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-linear-to-br from-riwaq-brown to-[#2d1a10] text-3xl font-extrabold text-white shadow-2xl ring-4 ring-white">
          {account.initials}
        </span>
        <h1 className="mt-4 font-extrabold text-2xl text-riwaq-brown">{account.fullName}</h1>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-riwaq-caramel/15 px-4 py-1.5 text-xs font-extrabold text-riwaq-caramel ring-1 ring-riwaq-caramel/25">
            {PLATFORM_ROLE_LABELS_AR[account.role]}
          </span>
          <span className="rounded-full bg-riwaq-green/12 px-4 py-1.5 text-xs font-extrabold text-riwaq-green ring-1 ring-riwaq-green/20">
            {account.loyaltyPoints.toLocaleString("ar-SA")} نقطة
          </span>
        </div>
        <p className="mt-2 text-xs font-bold text-riwaq-muted">عضو منذ {account.memberSince}</p>
      </div>

      <section className="rounded-3xl border border-white/95 bg-white/90 p-5 shadow-lg ring-1 ring-riwaq-beige/90">
        <h2 className="flex items-center gap-2 font-extrabold text-lg text-riwaq-brown">
          <Settings className="h-5 w-5 text-riwaq-muted" aria-hidden />
          بيانات التواصل
        </h2>
        <ul className="mt-5 space-y-4">
          <li className="flex items-center gap-3 rounded-2xl bg-riwaq-cream/60 px-4 py-4 ring-1 ring-riwaq-beige/80">
            <Phone className="h-5 w-5 shrink-0 text-riwaq-green" aria-hidden />
            <span className="font-bold tabular-nums text-riwaq-brown">{account.phone ?? "—"}</span>
          </li>
          <li className="flex items-center gap-3 rounded-2xl bg-riwaq-cream/60 px-4 py-4 ring-1 ring-riwaq-beige/80">
            <Mail className="h-5 w-5 shrink-0 text-riwaq-caramel" aria-hidden />
            <span className="break-all font-bold text-riwaq-brown">{account.email ?? "—"}</span>
          </li>
        </ul>
      </section>

      <section className="rounded-3xl border border-dashed border-riwaq-beige bg-riwaq-cream/40 px-5 py-4 text-center text-sm font-bold text-riwaq-muted">
        إحصائيات الطلبات والحجوزات والمكافآت تُعرض هنا بعد ربط الجداول التشغيلية بقاعدة البيانات.
      </section>

      <section className="rounded-3xl border border-white/95 bg-white/90 p-5 shadow-lg ring-1 ring-riwaq-beige/90">
        <h2 className="flex items-center gap-2 font-extrabold text-lg text-riwaq-brown">
          <Bell className="h-5 w-5 text-riwaq-muted" aria-hidden />
          تفضيلات الإشعارات
        </h2>
        <p className="mt-2 text-xs font-bold text-riwaq-muted">محلي في المتصفح — يُربط لاحقًا بالخادم</p>
        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-riwaq-cream/50 px-4 py-4 ring-1 ring-riwaq-beige/80">
            <span className="text-sm font-extrabold text-riwaq-brown">تنبيهات الطلبات</span>
            <input
              type="checkbox"
              checked={ordersNotif}
              onChange={(e) => setOrdersNotif(e.target.checked)}
              className="h-5 w-5 accent-riwaq-brown"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-riwaq-cream/50 px-4 py-4 ring-1 ring-riwaq-beige/80">
            <span className="text-sm font-extrabold text-riwaq-brown">تذكير الحجوزات</span>
            <input
              type="checkbox"
              checked={resNotif}
              onChange={(e) => setResNotif(e.target.checked)}
              className="h-5 w-5 accent-riwaq-brown"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-riwaq-cream/50 px-4 py-4 ring-1 ring-riwaq-beige/80">
            <span className="text-sm font-extrabold text-riwaq-brown">عروض وتسويق</span>
            <input
              type="checkbox"
              checked={promoNotif}
              onChange={(e) => setPromoNotif(e.target.checked)}
              className="h-5 w-5 accent-riwaq-brown"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
