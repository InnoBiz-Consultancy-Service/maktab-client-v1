import { cn } from "@/lib/utils/cn";
import { AlertCircle, CheckCircle2, Clock, FileText, HelpCircle } from "lucide-react";

interface StatusChipProps {
  status: "NOT_SUBMITTED" | "SUBMITTED" | "GRADED";
  isLate: boolean;
  dueDate: string;
  className?: string;
}

export function StatusChip({ status, isLate, dueDate, className }: StatusChipProps) {
  const todayYMD = new Date().toISOString().split("T")[0];
  const isOverdue = status === "NOT_SUBMITTED" && todayYMD > dueDate;

  let config = {
    label: "Not submitted",
    color: "text-ink-soft bg-cream-200/60 border-cream-300/40",
    icon: HelpCircle,
  };

  if (isOverdue) {
    config = {
      label: "Overdue",
      color: "text-error bg-error/10 border-error/20",
      icon: AlertCircle,
    };
  } else if (status === "GRADED") {
    config = {
      label: "Graded",
      color: "text-success bg-success/10 border-success/20",
      icon: CheckCircle2,
    };
  } else if (status === "SUBMITTED") {
    if (isLate) {
      config = {
        label: "Submitted late",
        color: "text-warn bg-warn/10 border-warn/20",
        icon: Clock,
      };
    } else {
      config = {
        label: "Submitted",
        color: "text-arabic bg-arabic/10 border-arabic/20",
        icon: FileText,
      };
    }
  }

  const IconComponent = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold font-display shadow-sm",
        config.color,
        className
      )}
    >
      <IconComponent className="h-3.5 w-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}
