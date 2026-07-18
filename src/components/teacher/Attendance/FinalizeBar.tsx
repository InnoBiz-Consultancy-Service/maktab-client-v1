"use client";

import { Button } from "@/components/ui";

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
      <Button
        type="button"
        variant="ghost"
        size="lg"
        block
        className="flex-1 bg-cream-50"
        onClick={onSave}
        loading={saving}
        disabled={disabled}
      >
        Save draft
      </Button>

      <Button
        type="button"
        size="lg"
        block
        className="flex-1"
        onClick={onFinalize}
        loading={saving}
        disabled={disabled}
      >
        Finalize
      </Button>
    </div>
  );
}
