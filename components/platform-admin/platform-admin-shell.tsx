"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PlatformAdminHeader } from "@/components/platform-admin/platform-admin-header";
import { PlatformAdminSidebar } from "@/components/platform-admin/platform-admin-sidebar";

const titles: Record<string, { title: string; subtitle?: string }> = {
  "/platform-admin": { title: "نظرة عامة تنفيذية", subtitle: "Executive Platform Overview" },
  "/platform-admin/cafes": { title: "مركز إدارة الكافيهات", subtitle: "Cafe Management Center" },
  "/platform-admin/customers": { title: "ذكاء عملاء المنصة", subtitle: "Platform Customer Intelligence" },
  "/platform-admin/subscriptions": { title: "مركز التحكم بالاشتراكات", subtitle: "Subscription Control Center" },
  "/platform-admin/revenue": { title: "مركز إيرادات المنصة", subtitle: "Platform Revenue Center" },
  "/platform-admin/social-performance": {
    title: "إيراد المحتوى الاجتماعي",
    subtitle: "Social Content Revenue Center",
  },
  "/platform-admin/activity": { title: "سجل نشاط المنصة", subtitle: "Platform Activity Log" },
  "/platform-admin/reports": { title: "التقارير التنفيذية", subtitle: "Executive reports" },
  "/platform-admin/settings": { title: "إعدادات المنصة", subtitle: "Platform configuration" },
  "/platform-admin/map-overview": { title: "نظرة خريطة المنصة", subtitle: "Geographic overview" },
  "/platform-admin/community-moderation": { title: "مراقبة المجتمع", subtitle: "Community moderation" },
};

function titleForPath(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  const prefix = Object.keys(titles)
    .filter((k) => k !== "/platform-admin")
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname.startsWith(p));
  return prefix ? titles[prefix] : titles["/platform-admin"];
}

export function PlatformAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const header = useMemo(() => titleForPath(pathname), [pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-[#f3efe8] lg:pr-[19rem]">
      <button
        type="button"
        aria-label="إغلاق القائمة"
        className={[
          "fixed inset-0 z-30 bg-riwaq-brown/50 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setMobileNavOpen(false)}
      />

      <PlatformAdminSidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen flex-col">
        <PlatformAdminHeader
          title={header.title}
          subtitle={header.subtitle}
          onMenuOpen={() => setMobileNavOpen(true)}
        />
        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
