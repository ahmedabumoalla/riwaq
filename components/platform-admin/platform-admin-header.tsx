"use client";

import { Bell, Menu, Search } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

type PlatformAdminHeaderProps = {
  title: string;
  subtitle?: string;
  onMenuOpen: () => void;
};

const periods = ["7 أيام", "30 يومًا", "90 يومًا", "سنة"];

export function PlatformAdminHeader({ title, subtitle, onMenuOpen }: PlatformAdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-riwaq-beige/80 bg-white/85 shadow-sm shadow-riwaq-brown/5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            type="button"
            className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-riwaq-beige bg-white text-riwaq-brown shadow-sm lg:hidden"
            aria-label="فتح القائمة"
            onClick={onMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold text-riwaq-brown sm:text-2xl">{title}</h1>
            {subtitle ? (
              <p className="mt-0.5 text-sm font-bold text-riwaq-muted">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="scrollbar-none flex w-full min-w-0 flex-col gap-3 overflow-x-auto sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
          <div className="relative min-w-[12rem] flex-1 sm:max-w-xs lg:max-w-[14rem]">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-riwaq-muted" />
            <input
              type="search"
              placeholder="بحث شامل…"
              className="w-full rounded-2xl border border-riwaq-beige bg-white py-2.5 pr-10 pl-3 text-sm font-bold text-riwaq-brown placeholder:text-riwaq-muted/80 focus:border-riwaq-caramel focus:outline-none focus:ring-2 focus:ring-riwaq-caramel/25"
              aria-label="بحث شامل"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="pa-period">
              فترة زمنية
            </label>
            <select
              id="pa-period"
              className="rounded-2xl border border-riwaq-beige bg-white px-3 py-2.5 text-xs font-extrabold text-riwaq-brown focus:border-riwaq-caramel focus:outline-none focus:ring-2 focus:ring-riwaq-caramel/25"
              defaultValue={periods[1]}
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-riwaq-beige bg-white text-riwaq-brown shadow-sm transition hover:bg-riwaq-cream"
              aria-label="الإشعارات"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-riwaq-caramel ring-2 ring-white" />
            </button>

            <div className="hidden h-9 w-px bg-riwaq-beige sm:block" aria-hidden />

            <div className="flex items-center gap-2 rounded-2xl border border-riwaq-beige bg-riwaq-cream/60 px-3 py-1.5">
              <div className="text-start">
                <p className="text-[10px] font-extrabold text-riwaq-muted">حساب الأدمن</p>
                <p className="text-xs font-extrabold text-riwaq-brown">مسؤول المنصة</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-riwaq-brown text-[11px] font-extrabold text-white">
                م.م
              </span>
            </div>

            <SignOutButton label="خروج" variant="light" className="shrink-0 text-xs" />
          </div>
        </div>
      </div>
    </header>
  );
}
