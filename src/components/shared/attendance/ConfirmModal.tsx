"use client";

import { X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Simple confirm/cancel dialog.
 * Used for finalize confirmation, off-day overwrite warnings, etc.
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-night-900/40"
        onClick={onCancel}
        aria-hidden
      />

      <div
        className="relative w-full max-w-sm rounded-t-2xl bg-cream-50 p-5 shadow-lift sm:rounded-2xl sm:p-6"
        role="alertdialog"
        aria-label={title}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-display text-lg font-bold text-night-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-200"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-ink-soft">
          {description}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-cream-200 bg-cream-50 font-display text-sm font-semibold text-night-900 transition-all active:scale-95 hover:bg-cream-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full font-display text-sm font-semibold shadow-soft transition-all active:scale-95 hover:scale-[1.02] ${
              destructive
                ? "bg-error text-cream-50"
                : "bg-gold-500 text-night-900"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
