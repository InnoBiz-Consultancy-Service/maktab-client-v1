import { cn } from "@/lib/utils/cn";
import type { ResultRowStatus } from "@/types/lesson";

export const STATUS_META: Record<
  ResultRowStatus,
  { label: string; cls: string }
> = {
  COMPLETED: { label: "Completed", cls: "bg-success/12 text-success" },
  PASSED: { label: "Passed", cls: "bg-quran-soft text-quran" },
  IN_PROGRESS: { label: "In progress", cls: "bg-gold-300/50 text-gold-600" },
  FAILED: { label: "Failed", cls: "bg-error/12 text-error" },
  NOT_STARTED: { label: "Not started", cls: "bg-cream-200 text-ink-soft" },
};

export function StatusPill({ status }: { status: ResultRowStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.NOT_STARTED;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.cls,
      )}
    >
      {meta.label}
    </span>
  );
}
