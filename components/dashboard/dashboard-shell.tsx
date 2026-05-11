"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

const titles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "الرئيسية", subtitle: "لوحة التشغيل التنفيذية" },
  "/dashboard/menu": { title: "المنيو", subtitle: "إدارة الأصناف والتصنيفات" },
  "/dashboard/orders": { title: "الطلبات", subtitle: "مركز العمليات" },
  "/dashboard/reservations": { title: "الحجوزات", subtitle: "مركز إدارة الحجوزات" },
  "/dashboard/tables": { title: "الطاولات", subtitle: "Table Experience Manager" },
  "/dashboard/loyalty": { title: "الولاء", subtitle: "ذكاء الولاء والعملاء المتكررين" },
  "/dashboard/campaigns": { title: "الحملات", subtitle: "التسويق والمسوّقون" },
  "/dashboard/employees": { title: "الموظفون", subtitle: "العمليات والشِفتات" },
  "/dashboard/customers": { title: "العملاء", subtitle: "Customer Intelligence Center" },
  "/dashboard/reports": { title: "التقارير", subtitle: "تحليلات تشغيلية" },
  "/dashboard/settings": { title: "الإعدادات", subtitle: "الفرع والمتجر" },
  "/dashboard/community": { title: "مجتمع الكوفي", subtitle: "منشورات وولاء وتفاعل" },
  "/dashboard/map-insights": { title: "رؤية الخريطة", subtitle: "موقعك مقابل السوق" },
};

function titleForPath(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  const prefix = Object.keys(titles)
    .filter((k) => k !== "/dashboard")
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname.startsWith(p));
  return prefix ? titles[prefix] : titles["/dashboard"];
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen min-w-0 overflow-x-clip bg-riwaq-cream lg:pr-[19rem]">
      <button
        type="button"
        aria-label="إغلاق القائمة"
        className={[
          "fixed inset-0 z-30 bg-riwaq-brown/40 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setMobileNavOpen(false)}
      />

      <DashboardSidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          title={header.title}
          subtitle={header.subtitle}
          onMenuOpen={() => setMobileNavOpen(true)}
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
