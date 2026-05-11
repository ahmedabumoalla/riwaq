"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Building2,
  Flag,
  LayoutDashboard,
  LineChart,
  MapPinned,
  Megaphone,
  Settings,
  Share2,
  Shield,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const navItems: NavItem[] = [
  { href: "/platform-admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/platform-admin/cafes", label: "الكافيهات", icon: Building2 },
  { href: "/platform-admin/customers", label: "العملاء", icon: Users },
  { href: "/platform-admin/subscriptions", label: "الاشتراكات", icon: Wallet },
  { href: "/platform-admin/revenue", label: "الإيرادات", icon: LineChart },
  { href: "/platform-admin/social-performance", label: "أداء المحتوى", icon: Share2 },
  { href: "/platform-admin/map-overview", label: "الخريطة", icon: MapPinned },
  { href: "/platform-admin/community-moderation", label: "مراقبة المجتمع", icon: Flag },
  { href: "/platform-admin/activity", label: "سجل النشاط", icon: Activity },
  { href: "/platform-admin/reports", label: "التقارير", icon: BarChart3 },
  { href: "/platform-admin/settings", label: "الإعدادات", icon: Settings },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type PlatformAdminSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function PlatformAdminSidebar({ mobileOpen, onMobileClose }: PlatformAdminSidebarProps) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    [
      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition",
      active
        ? "bg-white/12 text-white shadow-inner ring-1 ring-white/15"
        : "text-riwaq-beige/85 hover:bg-white/8 hover:text-white",
    ].join(" ");

  return (
    <aside
      className={[
        "fixed inset-y-0 right-0 z-40 flex w-[min(19rem,88vw)] flex-col border-l border-white/10 bg-linear-to-b from-riwaq-brown via-riwaq-brown to-[#2a1810] text-riwaq-cream shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-200 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
      ].join(" ")}
      aria-label="قائمة إدارة المنصة"
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-5">
        <Link
          href="/platform-admin"
          className="flex items-center gap-2.5 font-extrabold text-lg text-white"
          onClick={onMobileClose}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-riwaq-caramel/25 text-riwaq-caramel ring-1 ring-white/15">
            <Shield className="h-5 w-5 shrink-0" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span>رِواق</span>
            <span className="text-[10px] font-bold text-riwaq-caramel">إدارة المنصة</span>
          </span>
        </Link>
        <button
          type="button"
          className="rounded-xl p-2 text-riwaq-beige/80 hover:bg-white/10 lg:hidden"
          aria-label="إغلاق القائمة"
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="scrollbar-none flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={linkClass(active)}
              onClick={onMobileClose}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="flex items-center gap-2 text-[11px] font-extrabold text-riwaq-beige/70">
          <Megaphone className="h-3.5 w-3.5 text-riwaq-caramel" aria-hidden />
          تنفيذي · بيانات تجريبية
        </p>
        <p className="mt-1 text-xs font-bold text-white/90">الصلاحية: مسؤول المنصة فقط</p>
      </div>
    </aside>
  );
}
