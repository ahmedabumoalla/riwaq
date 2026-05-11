"use client";

import { Bell, ChevronDown, Menu, Plus, Search, Zap } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";

type DashboardHeaderProps = {
  title: string;
  subtitle?: string;
  onMenuOpen: () => void;
};

export function DashboardHeader({ title, subtitle, onMenuOpen }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-riwaq-beige/90 bg-riwaq-cream/92 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-4 py-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-riwaq-beige bg-white/85 text-riwaq-brown shadow-sm lg:hidden"
              aria-label="فتح القائمة"
              onClick={onMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-extrabold text-xl text-riwaq-brown sm:text-2xl">{title}</h1>
              {subtitle ? (
                <p className="truncate text-sm font-bold text-riwaq-muted">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <div className="relative hidden min-w-[11rem] flex-1 md:flex md:max-w-xs lg:max-w-md">
              <Search
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-riwaq-muted"
                aria-hidden
              />
              <input
                type="search"
                placeholder="بحث في الطلبات، العملاء، الحجوزات..."
                readOnly
                className="w-full rounded-2xl border border-riwaq-beige bg-white/85 py-2.5 pr-10 pl-3 text-sm font-bold text-riwaq-brown placeholder:text-riwaq-muted/70 shadow-sm outline-none ring-riwaq-caramel/30 focus:ring-2"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="hidden items-center gap-2 rounded-2xl border border-riwaq-beige bg-white/85 px-3 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm transition hover:border-riwaq-caramel/35 lg:inline-flex"
              >
                رِواق القابضة
                <ChevronDown className="h-4 w-4 text-riwaq-muted" aria-hidden />
              </button>
              <button
                type="button"
                className="hidden items-center gap-2 rounded-2xl border border-riwaq-beige bg-white/85 px-3 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm transition hover:border-riwaq-caramel/35 sm:inline-flex"
              >
                فرع الواجهة البحرية
                <ChevronDown className="h-4 w-4 text-riwaq-muted" aria-hidden />
              </button>

              <Link
                href="/dashboard/orders"
                className="inline-flex items-center gap-1 rounded-2xl bg-riwaq-green px-3 py-2 text-xs font-extrabold text-white shadow-md shadow-riwaq-green/20 transition hover:brightness-105"
              >
                <Plus className="h-4 w-4" aria-hidden />
                طلب يدوي
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-2xl border border-riwaq-beige bg-white/85 px-3 py-2 text-xs font-extrabold text-riwaq-brown shadow-sm transition hover:border-riwaq-caramel/35"
              >
                <Zap className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                إجراءات
              </button>

              <button
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-white/85 text-riwaq-brown shadow-sm transition hover:border-riwaq-caramel/40"
                aria-label="الإشعارات"
              >
                <Bell className="h-5 w-5" aria-hidden />
                <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white shadow">
                  ٣
                </span>
              </button>

              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-2xl border border-riwaq-beige bg-white/85 px-2 py-1 pe-3 shadow-sm transition hover:border-riwaq-caramel/35"
                aria-label="الملف الشخصي"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-riwaq-brown to-[#2d1a10] text-xs font-extrabold text-white">
                  مف
                </span>
                <span className="hidden text-xs font-extrabold text-riwaq-brown sm:block">مدير الفرع</span>
                <ChevronDown className="hidden h-4 w-4 text-riwaq-muted sm:block" aria-hidden />
              </button>
              <SignOutButton className="inline-flex" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
