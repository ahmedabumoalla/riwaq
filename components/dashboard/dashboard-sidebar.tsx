"use client";

import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  BarChart3,
  CalendarDays,
  Coffee,
  Gift,
  LayoutDashboard,
  MapPinned,
  Megaphone,
  Menu,
  MessagesSquare,
  Settings,
  ShoppingBag,
  Users,
  UserSquare2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/menu", label: "المنيو", icon: Menu },
  { href: "/dashboard/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/dashboard/reservations", label: "الحجوزات", icon: CalendarDays },
  { href: "/dashboard/tables", label: "الطاولات", icon: Armchair },
  { href: "/dashboard/loyalty", label: "الولاء", icon: Gift },
  { href: "/dashboard/campaigns", label: "الحملات", icon: Megaphone },
  { href: "/dashboard/community", label: "المجتمع", icon: MessagesSquare },
  { href: "/dashboard/map-insights", label: "رؤية الخريطة", icon: MapPinned },
  { href: "/dashboard/employees", label: "الموظفون", icon: Users },
  { href: "/dashboard/customers", label: "العملاء", icon: UserSquare2 },
  { href: "/dashboard/reports", label: "التقارير", icon: BarChart3 },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    [
      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition",
      active
        ? "bg-riwaq-brown text-white shadow-md shadow-riwaq-brown/20"
        : "text-riwaq-muted hover:bg-white/70 hover:text-riwaq-brown",
    ].join(" ");

  return (
    <aside
      className={[
        "fixed inset-y-0 right-0 z-40 flex w-[min(19rem,88vw)] flex-col border-l border-white/80 bg-white/78 shadow-xl shadow-riwaq-brown/10 backdrop-blur-xl transition-transform duration-200 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
      ].join(" ")}
      aria-label="قائمة لوحة الإدارة"
    >
      <div className="flex items-center justify-between gap-2 border-b border-riwaq-beige/80 px-4 py-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 font-extrabold text-lg text-riwaq-brown"
          onClick={onMobileClose}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-riwaq-caramel/25 to-riwaq-green/20 text-riwaq-caramel ring-1 ring-riwaq-beige">
            <Coffee className="h-5 w-5 shrink-0" aria-hidden />
          </span>
          رِواق
        </Link>
        <button
          type="button"
          className="rounded-xl p-2 text-riwaq-muted hover:bg-riwaq-beige/60 lg:hidden"
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

      <div className="border-t border-riwaq-beige/80 p-4">
        <p className="text-[11px] font-extrabold text-riwaq-muted">لوحة إدارة الكافيه</p>
        <p className="mt-1 text-xs font-bold text-riwaq-green">وضع تجريبي · بيانات وهمية</p>
      </div>
    </aside>
  );
}
