"use client";

import { useState } from "react";
import { X, Loader2, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { AttendanceStatus } from "@/types/attendance";

const statusOptions: Array<{
  value: AttendanceStatus;
  label: string;
  icon: typeof Check;
  active: string;
}> = [
  {
    value: "PRESENT",
    label: "Present",
    icon: Check,
    active: "bg-success text-cream-50",
  },
  {
    value: "ABSENT",
    label: "Absent",
    icon: X,
    active: "bg-error text-cream-50",
  },
  {
    value: "LATE",
    label: "Late",
    icon: Clock,
    active: "bg-warn text-night-900",
  },
];

interface EditRecordModalProps {
  open: boolean;
  studentName: string;
  currentStatus: AttendanceStatus;
  onClose: () => void;
  onSubmit: (status: AttendanceStatus, reason: string) => Promise<void>;
}

export function EditRecordModal({
  open,
  studentName,
  currentStatus,
  onClose,
  onSubmit,
}: EditRecordModalProps) {
  const [status, setStatus] = useState<AttendanceStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    setSaving(true);
    try {
      await onSubmit(status, reason.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-night-900/40"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="relative w-full max-w-md rounded-t-2xl bg-cream-50 p-5 shadow-lift sm:rounded-2xl sm:p-6"
        role="dialog"
        aria-label={`Edit attendance for ${studentName}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-night-900">
            Edit record
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

        <p className="mb-4 text-sm text-ink-soft">{studentName}</p>

        <div
          role="radiogroup"
          aria-label="New status"
          className="mb-4 grid grid-cols-3 gap-2"
        >
          {statusOptions.map((o) => {
            const Icon = o.icon;
            const isActive = status === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setStatus(o.value)}
                className={cn(
                  "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-all active:scale-95",
                  isActive
                    ? o.active
                    : "border border-cream-200 bg-cream-50 text-ink-soft hover:bg-cream-100",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {o.label}
              </button>
            );
          })}
        </div>

        <label className="mb-5 block">
          <span className="mb-1 block text-xs font-semibold text-ink-soft">
            Reason (optional)
          </span>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Came late but attended"
            className="min-h-[44px] w-full rounded-lg border border-cream-200 bg-cream-50 px-3 text-sm text-night-900 outline-none placeholder:text-ink-soft/50 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || status === currentStatus}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gold-500 font-display text-sm font-semibold text-night-900 shadow-soft transition-all active:scale-95 hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Updating…
            </>
          ) : (
            "Update record"
          )}
        </button>
      </div>
    </div>
  );
}
