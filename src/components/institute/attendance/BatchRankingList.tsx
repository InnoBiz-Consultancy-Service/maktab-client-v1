import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BookOpen } from "lucide-react";
import type { OverviewBatch } from "@/types/attendance";
import { EmptyState } from "@/components/shared/attendance/EmptyState";
import { PercentageRing } from "@/components/shared/attendance/PercentageRing";

interface BatchRankingListProps {
  batches: OverviewBatch[];
  lowThreshold: number;
}

export function BatchRankingList({
  batches,
  lowThreshold,
}: BatchRankingListProps) {
  if (batches.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No batches yet"
        description="Create batches and assign students to see attendance data here."
      />
    );
  }

  return (
    <div className="rounded-lg bg-cream-50 shadow-soft">
      <ul className="divide-y divide-cream-200">
        {batches.map((b) => (
          <li key={b.batch.id}>
            <Link
              href={`/dashboard/institute/attendance/batches/${b.batch.id}`}
              className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-cream-100 active:bg-cream-200 sm:px-5"
            >
              {/* Avg ring */}
              <PercentageRing value={b.average} size={44} stroke={4} />

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-night-900">
                  {b.batch.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {b.studentCount} students
                  {b.lowCount > 0 && (
                    <span className="text-error">
                      {" "}
                      · {b.lowCount} below {lowThreshold}%
                    </span>
                  )}
                </p>
              </div>

              <ChevronRight
                className="h-4 w-4 shrink-0 text-cream-200"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
