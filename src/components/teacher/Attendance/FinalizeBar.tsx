"use client";

import { Loader2 } from "lucide-react";

interface FinalizeBarProps {
  saving: boolean;
  onSave: () => void;
  onFinalize: () => void;
  disabled?: boolean;
}

/**
 * Sticky bottom bar with Save Draft + Finalize buttons.
 * Bottom padding accounts for the mobile bottom nav.
 */
export function FinalizeBar({
  saving,
  onSave,
  onFinalize,
  disabled = false,
}: FinalizeBarProps) {
  return (
    <div className="sticky bottom-20 z-10 flex gap-3 lg:bottom-4">
      <button
        type="button"
        onClick={onSave}
        disabled={saving || disabled}
        className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full border border-cream-200 bg-cream-50 font-display text-sm font-semibold text-night-900 shadow-soft transition-all active:scale-95 hover:bg-cream-100 disabled:opacity-60 disabled:pointer-events-none"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : null}
        Save draft
      </button>

      <button
        type="button"
        onClick={onFinalize}
        disabled={saving || disabled}
        className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-full bg-gold-500 font-display text-sm font-semibold text-night-900 shadow-soft transition-all active:scale-95 hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : null}
        Finalize
      </button>
    </div>
  );
}
