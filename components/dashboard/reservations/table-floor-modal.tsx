"use client";

import { Armchair } from "lucide-react";
import type { CafeTable } from "@/lib/mock/reservations-center";
import { TABLE_CATEGORY_LABELS, TABLE_OPS_LABELS } from "@/lib/mock/reservations-center";

export function TableFloorModal({
  open,
  tables,
  title,
  onClose,
  onSelectTable,
  selectableIds,
}: {
  open: boolean;
  tables: CafeTable[];
  title: string;
  onClose: () => void;
  onSelectTable?: (table: CafeTable) => void;
  selectableIds?: string[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-riwaq-brown/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/90 bg-white shadow-2xl shadow-riwaq-brown/20"
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-riwaq-beige bg-white/95 px-6 py-4 backdrop-blur-md">
          <h2 className="font-extrabold text-lg text-riwaq-brown">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1 text-sm font-extrabold text-riwaq-muted hover:bg-riwaq-beige/70"
          >
            إغلاق
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm font-bold text-riwaq-muted">
            مخطط أرضية تجريبي — اسحب النظر السريع لمعرفة حالة كل مقعد (بيانات وهمية).
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables.map((t) => {
              const sel =
                selectableIds == null ||
                selectableIds.includes(t.id);
              const color =
                t.status === "available"
                  ? "border-emerald-200 bg-emerald-50/80 ring-emerald-100"
                  : t.status === "active_now"
                    ? "border-riwaq-brown bg-riwaq-brown/10 ring-riwaq-brown/20"
                    : t.status === "busy"
                      ? "border-orange-300 bg-orange-50/90 ring-orange-100"
                      : t.status === "reserved"
                        ? "border-riwaq-caramel bg-riwaq-caramel/10 ring-riwaq-caramel/20"
                        : t.status === "cleaning"
                          ? "border-sky-200 bg-sky-50 ring-sky-100"
                          : "border-zinc-300 bg-zinc-100 ring-zinc-200";

              const clickable = Boolean(onSelectTable) && sel;
              const body = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 shadow-inner ring-1 ring-white">
                      <Armchair className="h-5 w-5 text-riwaq-brown" aria-hidden />
                    </span>
                    <span className="font-extrabold text-riwaq-brown">طاولة {t.label}</span>
                  </div>
                  <p className="text-xs font-bold text-riwaq-muted">
                    سعة {t.capacity.toLocaleString("ar-SA")} · {TABLE_CATEGORY_LABELS[t.category]}
                  </p>
                  <span className="rounded-full bg-white/85 px-2 py-1 text-[11px] font-extrabold text-riwaq-brown ring-1 ring-white">
                    {TABLE_OPS_LABELS[t.status]}
                  </span>
                  {t.nextAvailableISO ? (
                    <p className="text-[10px] font-bold text-riwaq-muted">
                      أول فراغ تقريبي:{" "}
                      <span className="font-extrabold tabular-nums text-riwaq-brown">
                        {new Date(t.nextAvailableISO).toLocaleTimeString("ar-SA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                  ) : null}
                </>
              );

              const cls = `flex flex-col gap-2 rounded-3xl border p-4 text-right shadow-md shadow-riwaq-brown/5 ring-1 transition ${
                clickable ? "hover:-translate-y-0.5 hover:shadow-lg cursor-pointer" : ""
              } ${color}`;

              return clickable ? (
                <button key={t.id} type="button" className={cls} onClick={() => onSelectTable!(t)}>
                  {body}
                </button>
              ) : (
                <div key={t.id} className={cls}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
