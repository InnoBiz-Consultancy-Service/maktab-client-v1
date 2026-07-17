import { cn } from "@/lib/utils/cn";

interface LowAttendanceFlagProps {
  percentage: number;
  threshold: number;
}

/** Small inline indicator shown when a student is below the threshold. */
export function LowAttendanceFlag({
  percentage,
  threshold,
}: LowAttendanceFlagProps) {
  if (percentage >= threshold) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-error/15 px-2 py-0.5 text-xs font-semibold text-error",
      )}
    >
      Low
    </span>
  );
}
