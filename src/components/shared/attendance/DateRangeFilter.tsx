"use client";

import { cn } from "@/lib/utils/cn";

export type DatePreset = "month" | "3months" | "6months" | "all";

interface DateRangeFilterProps {
  active: DatePreset;
  onChange: (preset: DatePreset) => void;
  className?: string;
}

const presets: Array<{ key: DatePreset; label: string }> = [
  { key: "month", label: "This month" },
  { key: "3months", label: "3 months" },
  { key: "6months", label: "6 months" },
  { key: "all", label: "All time" },
];

/**
 * Compute `from` and `to` strings (YYYY-MM-DD) for a preset.
 * "all" returns `{ preset: "all" }` instead.
 */
export function presetToParams(preset: DatePreset): {
  from?: string;
  to?: string;
  preset?: "all";
} {
  if (preset === "all") return { preset: "all" };

  const now = new Date();
  const to = now.toISOString().slice(0, 10);

  const monthsBack = preset === "3months" ? 3 : preset === "6months" ? 6 : 0;

  if (monthsBack === 0) {
    // Current month
    const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    return { from, to };
  }

  const d = new Date(now);
  d.setMonth(d.getMonth() - monthsBack);
  const from = d.toISOString().slice(0, 10);
  return { from, to };
}

/** Horizontal pill selector for date range presets. */
export function DateRangeFilter({
  active,
  onChange,
  className,
}: DateRangeFilterProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
        className,
      )}
      role="radiogroup"
      aria-label="Date range"
    >
      {presets.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={active === key}
          onClick={() => onChange(key)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95",
            active === key
              ? "bg-night-900 text-cream-50 shadow-soft"
              : "border border-cream-200 bg-cream-50 text-ink-soft hover:bg-cream-100",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
