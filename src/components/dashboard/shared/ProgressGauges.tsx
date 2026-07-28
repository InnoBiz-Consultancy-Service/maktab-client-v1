"use client";

import { BookOpen, FileText, CalendarCheck } from "lucide-react";
import { Card } from "@/components/ui";
import type { ProgressRates } from "@/types/dashboard";

interface ProgressGaugesProps {
  progress: ProgressRates;
  title?: string;
  compact?: boolean;
}

export function ProgressGauges({
  progress,
  title = "Average Student Progress",
  compact = false,
}: ProgressGaugesProps) {
  const items = [
    {
      label: "Lesson Completion",
      rate: Math.min(
        100,
        Math.max(0, Math.round(progress.lessonCompletionRate ?? 0)),
      ),
      icon: BookOpen,
      color: "bg-gold-500",
      bgLight: "bg-gold-500/10 text-gold-700",
    },
    {
      label: "Homework Submission",
      rate: Math.min(
        100,
        Math.max(0, Math.round(progress.homeworkSubmissionRate ?? 0)),
      ),
      icon: FileText,
      color: "bg-arabic",
      bgLight: "bg-arabic-soft text-arabic",
    },
    {
      label: "Attendance Rate",
      rate: Math.min(
        100,
        Math.max(0, Math.round(progress.attendanceRate ?? 0)),
      ),
      icon: CalendarCheck,
      color: "bg-quran",
      bgLight: "bg-quran-soft text-quran",
    },
  ];

  const content = (
    <div>
      {title && !compact && (
        <h2 className="mb-4 font-display text-lg font-bold text-night-900">
          {title}
        </h2>
      )}
      <div
        className={`grid grid-cols-1 gap-3 ${compact ? "grid-cols-1 sm:grid-cols-3" : "md:grid-cols-3"}`}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`hover:border-cream-300 flex flex-col justify-between rounded-xl border border-cream-200 bg-cream-50/50 transition-all ${
                compact ? "p-3" : "p-4"
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={`leading-snug font-semibold text-night-900 ${compact ? "max-w-[calc(100%-2rem)] text-xs" : "text-sm"}`}
                >
                  {item.label}
                </span>
                <div
                  className={`flex shrink-0 items-center justify-center rounded-lg ${item.bgLight} ${
                    compact ? "h-6 w-6" : "h-8 w-8"
                  }`}
                >
                  <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-1">
                  <span
                    className={`font-bold tracking-tight text-night-900 ${compact ? "text-base" : "text-2xl"}`}
                  >
                    {item.rate}%
                  </span>
                  <span className="shrink-0 text-[10px] font-medium text-ink-soft sm:text-xs">
                    Target 100%
                  </span>
                </div>
                <div
                  className={`w-full overflow-hidden rounded-full bg-cream-200 ${compact ? "h-1.5" : "h-2"}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (compact) {
    return content;
  }

  return <Card className="p-5">{content}</Card>;
}
