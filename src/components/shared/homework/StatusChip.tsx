import { cn } from "@/lib/utils/cn";
import { AlertCircle, CheckCircle2, Clock, FileText, HelpCircle } from "lucide-react";

interface StatusChipProps {
  chip?: "NOT_SUBMITTED" | "OVERDUE" | "SUBMITTED" | "SUBMITTED_LATE" | "GRADED" | "GRADED_LATE" | string;
  // Fallbacks for backward compatibility
  status?: "NOT_SUBMITTED" | "SUBMITTED" | "GRADED";
  isLate?: boolean;
  dueDate?: string;
  className?: string;
}

export function StatusChip({ chip, status, isLate, dueDate, className }: StatusChipProps) {
  let resolvedChip = chip;

  // Fallback conversion logic
  if (!resolvedChip && status) {
    if (status === "GRADED") {
      resolvedChip = isLate ? "GRADED_LATE" : "GRADED";
    } else if (status === "SUBMITTED") {
      resolvedChip = isLate ? "SUBMITTED_LATE" : "SUBMITTED";
    } else if (status === "NOT_SUBMITTED") {
      const todayYMD = new Date().toISOString().split("T")[0];
      const isOverdue = dueDate ? todayYMD > dueDate : false;
      resolvedChip = isOverdue ? "OVERDUE" : "NOT_SUBMITTED";
    }
  }

  let config = {
    label: "Not submitted",
    color: "text-ink-soft bg-cream-200/60 border-cream-300/40",
    icon: HelpCircle,
    showLateBadge: false,
  };

  switch (resolvedChip) {
    case "OVERDUE":
      config = {
        label: "Overdue",
        color: "text-error bg-error/10 border-error/20",
        icon: AlertCircle,
        showLateBadge: false,
      };
      break;
    case "SUBMITTED":
      config = {
        label: "Submitted",
        color: "text-arabic bg-arabic/10 border-arabic/20",
        icon: FileText,
        showLateBadge: false,
      };
      break;
    case "SUBMITTED_LATE":
      config = {
        label: "Submitted late",
        color: "text-warn bg-warn/10 border-warn/20",
        icon: Clock,
        showLateBadge: false,
      };
      break;
    case "GRADED":
      config = {
        label: "Graded",
        color: "text-success bg-success/10 border-success/20",
        icon: CheckCircle2,
        showLateBadge: false,
      };
      break;
    case "GRADED_LATE":
      config = {
        label: "Graded",
        color: "text-success bg-success/10 border-success/20",
        icon: CheckCircle2,
        showLateBadge: true,
      };
      break;
    case "NOT_SUBMITTED":
    default:
      config = {
        label: "Not submitted",
        color: "text-ink-soft bg-cream-200/60 border-cream-300/40",
        icon: HelpCircle,
        showLateBadge: false,
      };
      break;
  }

  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-1.5">
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
      {config.showLateBadge && (
        <span className="inline-flex items-center rounded-full bg-warn/10 border border-warn/20 px-2 py-0.5 text-[10px] font-bold text-warn uppercase">
          Late
        </span>
      )}
    </div>
  );
}
