"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface OffDayModalProps {
  batchId: string;
  batchName: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    batchId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => Promise<void>;
}

export function OffDayModal({
  batchId,
  batchName,
  open,
  onClose,
  onSubmit,
}: OffDayModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    if (!reason.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ batchId, startDate, endDate, reason: reason.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-night-900/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-t-2xl bg-cream-50 p-5 shadow-lift sm:rounded-2xl sm:p-6",
        )}
        role="dialog"
        aria-label={`Mark off day for ${batchName}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-night-900">
            Mark off day
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-200"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <p className="mb-4 text-sm text-ink-soft">{batchName}</p>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink-soft">
              Start date
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-cream-200 bg-cream-50 px-3 text-sm text-night-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-ink-soft">
              End date
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="min-h-[44px] w-full rounded-lg border border-cream-200 bg-cream-50 px-3 text-sm text-night-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
            />
          </label>
        </div>

        <label className="mb-5 block">
          <span className="mb-1 block text-xs font-semibold text-ink-soft">
            Reason
          </span>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Eid holiday"
            className="min-h-[44px] w-full rounded-lg border border-cream-200 bg-cream-50 px-3 text-sm text-night-900 outline-none placeholder:text-ink-soft/50 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !reason.trim()}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-night-900 font-display text-sm font-semibold text-cream-50 shadow-soft transition-all active:scale-95 hover:bg-night-800 disabled:opacity-60 disabled:pointer-events-none"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Confirm off day"
          )}
        </button>
      </div>
    </div>
  );
}
