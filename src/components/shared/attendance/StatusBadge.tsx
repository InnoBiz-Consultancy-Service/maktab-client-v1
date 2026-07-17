import { cn } from "@/lib/utils/cn";
import type { AttendanceStatus } from "@/types/attendance";

const styles: Record<AttendanceStatus, string> = {
  PRESENT: "bg-success/15 text-success",
  ABSENT: "bg-error/15 text-error",
  LATE: "bg-warn/15 text-warn",
};

const labels: Record<AttendanceStatus, string> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
};

interface StatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

/** Compact colored badge showing attendance status. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
