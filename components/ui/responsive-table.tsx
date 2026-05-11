"use client";

import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
};

type ResponsiveTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** بطاقة الجوال — عنوان رئيسي لكل صف */
  cardTitle: (row: T) => ReactNode;
  empty?: ReactNode;
};

/**
 * جدول من `md` فما فوق، وبطاقات تحت ذلك — يمنع overflow الأفقي على الجوال.
 */
export function ResponsiveTable<T>({
  columns,
  rows,
  rowKey,
  cardTitle,
  empty,
}: ResponsiveTableProps<T>) {
  if (rows.length === 0) {
    return (
      empty ?? (
        <div className="rounded-3xl border border-white/80 bg-white/80 p-8 text-center text-sm font-bold text-riwaq-muted shadow-md backdrop-blur-xl">
          لا توجد بيانات
        </div>
      )
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <div className="scrollbar-none overflow-x-auto rounded-3xl border border-riwaq-beige/90 bg-white/90 shadow-md shadow-riwaq-brown/5">
          <table className="w-full min-w-0 text-right text-sm">
            <thead className="border-b border-riwaq-beige bg-riwaq-cream/60 text-xs font-extrabold text-riwaq-muted">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={`px-3 py-3 ${col.className ?? ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-riwaq-beige/50 font-bold text-riwaq-brown last:border-0 hover:bg-riwaq-cream/40"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-3 py-3 align-top ${col.className ?? ""}`}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            className="rounded-3xl border border-white/90 bg-white/85 p-4 shadow-md shadow-riwaq-brown/5 backdrop-blur-xl"
          >
            <div className="border-b border-riwaq-beige/80 pb-3 text-base font-extrabold text-riwaq-brown">{cardTitle(row)}</div>
            <dl className="mt-3 space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex flex-col gap-0.5 rounded-2xl bg-riwaq-cream/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-[11px] font-extrabold text-riwaq-muted">{col.header}</dt>
                  <dd className="text-sm font-bold text-riwaq-brown">{col.cell(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
