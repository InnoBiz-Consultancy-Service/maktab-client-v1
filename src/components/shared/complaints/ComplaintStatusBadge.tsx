import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Clock } from "lucide-react";
import type { ComplaintStatus } from "@/types/shared/complaint";

interface ComplaintStatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

const config: Record<
  ComplaintStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  PENDING: {
    label: "Pending",
    color: "text-warn bg-warn/10 border-warn/20",
    icon: Clock,
  },
  RESOLVED: {
    label: "Resolved",
    color: "text-success bg-success/10 border-success/20",
    icon: CheckCircle2,
  },
};

export function ComplaintStatusBadge({
  status,
  className,
}: ComplaintStatusBadgeProps) {
  const { label, color, icon: Icon } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-xs font-semibold shadow-sm",
        color,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
