import { Users, BookOpen, TrendingDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { InstituteOverview } from "@/types/attendance";

interface OverviewStatsProps {
  data: InstituteOverview;
}

const stats = [
  {
    key: "totalBatches" as const,
    label: "Batches",
    icon: BookOpen,
    color: "text-quran",
    bg: "bg-quran-soft",
  },
  {
    key: "totalStudents" as const,
    label: "Students",
    icon: Users,
    color: "text-gold-600",
    bg: "bg-gold-500/10",
  },
  {
    key: "instituteAverage" as const,
    label: "Average",
    icon: BarChart3,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    key: "totalLowStudents" as const,
    label: "Below threshold",
    icon: TrendingDown,
    color: "text-error",
    bg: "bg-error/10",
  },
];

export function OverviewStats({ data }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color, bg }) => {
        const raw = data[key];
        const value = key === "instituteAverage" ? `${raw}%` : raw;

        return (
          <div key={key} className="rounded-lg bg-cream-50 p-4 shadow-soft">
            <span
              className={cn(
                "mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full",
                bg,
              )}
            >
              <Icon className={cn("h-4 w-4", color)} aria-hidden />
            </span>
            <p className="font-display text-xl font-bold text-night-900">
              {value}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">{label}</p>
          </div>
        );
      })}
    </div>
  );
}
