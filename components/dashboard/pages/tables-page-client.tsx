"use client";

import { LayoutGrid } from "lucide-react";
import { useState } from "react";
import { TableManagementSection } from "@/components/dashboard/reservations/table-management-section";
import { TableFloorModal } from "@/components/dashboard/reservations/table-floor-modal";
import { seedManagedTables, type ManagedTable } from "@/lib/mock/reservations-center";

export function TablesPageClient() {
  const [tables, setTables] = useState<ManagedTable[]>(() => seedManagedTables(new Date()));
  const [floorOpen, setFloorOpen] = useState(false);

  return (
    <div className="space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-3xl border border-white/85 bg-white/65 p-5 shadow-lg shadow-riwaq-brown/5 backdrop-blur-md ring-1 ring-riwaq-beige/90">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-riwaq-muted">Table Experience Manager</p>
              <h2 className="mt-1 font-extrabold text-2xl text-riwaq-brown">إدارة الطاولات والخدمات</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-relaxed text-riwaq-muted">
                تحكم كامل بطابع كل طاولة، مدة الحجز، الحد الأدنى، الخدمات، والولاء المرتبط بالتوثيق والنشر — لا يوجد
                اتصال خادم، كل التعديلات محلية للعرض.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFloorOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-riwaq-brown px-4 py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105"
            >
              <LayoutGrid className="h-5 w-5" aria-hidden />
              مخطط الأرضية السريع
            </button>
          </div>
        </header>

        <TableManagementSection
          tables={tables}
          onTablesChange={setTables}
          onOpenFloorPlan={() => setFloorOpen(true)}
        />
      </div>

      <TableFloorModal
        open={floorOpen}
        tables={tables}
        title="مخطط الأرضية — إدارة الطاولات"
        onClose={() => setFloorOpen(false)}
      />
    </div>
  );
}
