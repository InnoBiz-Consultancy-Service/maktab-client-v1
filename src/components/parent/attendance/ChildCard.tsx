import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MyChild } from "@/types/attendance";
import { PercentageRing } from "@/components/shared/attendance/PercentageRing";

interface ChildCardProps {
  child: MyChild;
}

export function ChildCard({ child }: ChildCardProps) {
  const { student, thisMonth } = child;

  return (
    <Link
      href={`/dashboard/parent/children/${student.id}`}
      className="flex items-center gap-4 rounded-lg bg-cream-50 p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98] sm:p-5"
    >
      {/* Avatar */}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-base font-bold text-quran">
        {student.name.charAt(0).toUpperCase()}
      </span>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold text-night-900">
          {student.name}
        </p>
        <p className="mt-0.5 truncate text-sm text-ink-soft">
          {student.class} · {student.studentCode}
        </p>

        {/* Month stats row */}
        <div className="mt-2 flex gap-4 text-xs text-ink-soft">
          <span>
            <span className="font-semibold text-success">
              {thisMonth.present}
            </span>{" "}
            present
          </span>
          {thisMonth.late > 0 && (
            <span>
              <span className="font-semibold text-warn">{thisMonth.late}</span>{" "}
              late
            </span>
          )}
          {thisMonth.absent > 0 && (
            <span>
              <span className="font-semibold text-error">
                {thisMonth.absent}
              </span>{" "}
              absent
            </span>
          )}
        </div>
      </div>

      {/* Percentage ring + arrow */}
      <div className="flex shrink-0 items-center gap-2">
        <PercentageRing value={thisMonth.percentage} size={48} stroke={4} />
        <ChevronRight className="h-4 w-4 text-cream-200" aria-hidden />
      </div>
    </Link>
  );
}
