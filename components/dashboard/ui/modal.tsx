"use client";

import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** عرض اللوحة — للنماذج الكبيرة مثل المنيو */
  panelClassName?: string;
};

export function Modal({ open, title, onClose, children, footer, panelClassName }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-riwaq-brown/45 backdrop-blur-sm"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={
          panelClassName ??
          "scrollbar-none relative z-10 max-h-[min(90dvh,720px)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-white/90 bg-white shadow-2xl shadow-riwaq-brown/20"
        }
      >
        <div className="flex items-start justify-between gap-3 border-b border-riwaq-beige/90 px-6 py-4">
          <h2 id="modal-title" className="font-extrabold text-lg text-riwaq-brown">
            {title}
          </h2>
          <button
            type="button"
            className="rounded-xl p-2 text-riwaq-muted hover:bg-riwaq-beige/60"
            aria-label="إغلاق النافذة"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex flex-wrap gap-2 border-t border-riwaq-beige/90 px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
