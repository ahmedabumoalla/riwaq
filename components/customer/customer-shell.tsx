"use client";

import { Bell, CalendarHeart, Coffee, Home, type LucideIcon, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CustomerSessionProvider } from "@/components/customer/customer-session-context";

export type CustomerShellUser = {
  fullName: string;
  initials: string;
  loyaltyPoints: number;
};

type NavDef = { href: string; label: string; icon: LucideIcon; match?: (p: string) => boolean };

const bottomNav: NavDef[] = [
  { href: "/customer", label: "الرئيسية", icon: Home, match: (p) => p === "/customer" },
  { href: "/customer/menu", label: "المنيو", icon: Coffee },
  { href: "/customer/reservations", label: "حجوزاتي", icon: CalendarHeart },
  { href: "/customer/loyalty", label: "نقاطي", icon: Sparkles },
  { href: "/customer/profile", label: "حسابي", icon: UserRound },
];

const desktopMore: { href: string; label: string }[] = [
  { href: "/customer/explore", label: "استكشف" },
  { href: "/customer/orders", label: "طلباتي" },
  { href: "/customer/rewards", label: "مكافآتي" },
  { href: "/customer/community", label: "المجتمع" },
  { href: "/customer/share", label: "شارك تجربتك" },
];

function navActive(pathname: string, item: NavDef) {
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function CustomerShell({ children, user }: { children: React.ReactNode; user: CustomerShellUser }) {
  const pathname = usePathname();

  return (
    <CustomerSessionProvider value={{ displayName: user.fullName, loyaltyPoints: user.loyaltyPoints }}>
      <div className="min-h-screen bg-linear-to-b from-riwaq-cream via-white to-riwaq-cream/90 pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-10">
        <header className="sticky top-0 z-40 border-b border-riwaq-beige/90 bg-white/92 backdrop-blur-lg">
          <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-4 lg:max-w-6xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-3 lg:justify-start lg:gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-riwaq-brown to-[#2d1a10] text-sm font-extrabold text-white shadow-lg shadow-riwaq-brown/25">
                  {user.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-riwaq-brown">{user.fullName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-extrabold">
                    <span className="rounded-full bg-riwaq-caramel/15 px-2.5 py-0.5 text-riwaq-caramel ring-1 ring-riwaq-caramel/25">
                      عميل
                    </span>
                    <span className="rounded-full bg-riwaq-green/12 px-2.5 py-0.5 text-riwaq-green ring-1 ring-riwaq-green/20">
                      {user.loyaltyPoints.toLocaleString("ar-SA")} نقطة
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <SignOutButton variant="light" label="خروج" className="inline-flex px-3" />
                <button
                  type="button"
                  className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-riwaq-beige bg-white text-riwaq-brown shadow-sm lg:hidden"
                  aria-label="الإشعارات"
                >
                  <Bell className="h-5 w-5" aria-hidden />
                  <span className="absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-extrabold text-white">
                    ٢
                  </span>
                </button>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-white text-riwaq-brown shadow-sm"
                aria-label="الإشعارات"
              >
                <Bell className="h-5 w-5" aria-hidden />
                <span className="absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-extrabold text-white">
                  ٢
                </span>
              </button>
            </div>
          </div>

          <nav
            className="mx-auto hidden max-w-6xl flex-wrap gap-2 border-t border-riwaq-beige/70 px-4 py-3 lg:flex"
            aria-label="تنقل سطح المكتب"
          >
            {desktopMore.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm font-extrabold transition",
                    active ? "bg-riwaq-brown text-white shadow-md" : "bg-riwaq-cream/70 text-riwaq-brown hover:bg-riwaq-beige/70",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-lg px-4 py-6 lg:max-w-6xl lg:px-8">{children}</main>

        <nav
          className="fixed bottom-0 inset-x-0 z-50 border-t border-riwaq-beige/90 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
          aria-label="التنقل السفلي"
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-between gap-1 px-2 pt-2">
            {bottomNav.map((item) => {
              const Icon = item.icon;
              const active = navActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-extrabold transition",
                    active ? "text-riwaq-brown" : "text-riwaq-muted",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-2xl transition",
                      active ? "bg-riwaq-caramel/15 text-riwaq-caramel shadow-inner" : "bg-riwaq-cream/60 text-riwaq-muted",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </CustomerSessionProvider>
  );
}
