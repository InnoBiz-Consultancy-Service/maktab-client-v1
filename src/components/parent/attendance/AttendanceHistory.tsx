"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui";
import { getStudentHistoryAction } from "@/actions/attendance/get-student-history";
import type { StudentHistoryEntry, AttendanceStatus } from "@/types/attendance";
import { EmptyState } from "@/components/shared/attendance/EmptyState";
import { StatusBadge } from "@/components/shared/attendance/StatusBadge";

type FilterStatus = "ALL" | AttendanceStatus;

const filters: Array<{ key: FilterStatus; label: string }> = [
  { key: "ALL", label: "All" },
  { key: "ABSENT", label: "Absent" },
  { key: "LATE", label: "Late" },
  { key: "PRESENT", label: "Present" },
];

interface AttendanceHistoryProps {
  studentId: string;
  initial: StudentHistoryEntry[];
}

export function AttendanceHistory({
  studentId,
  initial,
}: AttendanceHistoryProps) {
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [entries, setEntries] = useState<StudentHistoryEntry[]>(initial);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(
    async (status: FilterStatus) => {
      setLoading(true);
      const params = status === "ALL" ? undefined : { status };
      const res = await getStudentHistoryAction(studentId, params);
      if (res.ok) setEntries(res.data);
      setLoading(false);
    },
    [studentId],
  );

  useEffect(() => {
    if (filter === "ALL") {
      setEntries(initial);
    } else {
      fetchHistory(filter);
    }
  }, [filter, fetchHistory, initial]);

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95",
              filter === key
                ? "bg-night-900 text-cream-50 shadow-soft"
                : "border border-cream-200 bg-cream-50 text-ink-soft hover:bg-cream-100",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No records found"
          description={
            filter === "ALL"
              ? "No attendance history available yet."
              : `No ${filter.toLowerCase()} records found.`
          }
        />
      ) : (
        <div className="rounded-lg bg-cream-50 shadow-soft">
          <ul className="divide-y divide-cream-200">
            {entries.map((entry) => (
              <li
                key={entry.date}
                className="flex items-center justify-between px-4 py-3.5 sm:px-5"
              >
                <div>
                  <p className="text-sm font-medium text-night-900">
                    {new Date(entry.date + "T00:00:00").toLocaleDateString(
                      "en-GB",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Marked by {entry.markedBy}
                  </p>
                </div>
                <StatusBadge status={entry.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
