"use client";

import { useState, useEffect, useCallback } from "react";
import { getStudentSummaryAction } from "@/actions/attendance/get-student-summary";
import { Skeleton } from "@/components/ui";
import type { StudentSummary } from "@/types/attendance";
import {
  DatePreset,
  DateRangeFilter,
  presetToParams,
} from "@/components/shared/attendance/DateRangeFilter";
import { PercentageRing } from "@/components/shared/attendance/PercentageRing";

interface AttendanceSummaryProps {
  studentId: string;
  /** Initial data from the server (current month). */
  initial: StudentSummary;
}

export function AttendanceSummary({
  studentId,
  initial,
}: AttendanceSummaryProps) {
  const [preset, setPreset] = useState<DatePreset>("month");
  const [data, setData] = useState<StudentSummary>(initial);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(
    async (p: DatePreset) => {
      setLoading(true);
      const params = presetToParams(p);
      const res = await getStudentSummaryAction(studentId, params);
      if (res.ok) setData(res.data);
      setLoading(false);
    },
    [studentId],
  );

  useEffect(() => {
    if (preset !== "month") {
      fetchSummary(preset);
    } else {
      setData(initial);
    }
  }, [preset, fetchSummary, initial]);

  function handlePresetChange(p: DatePreset) {
    setPreset(p);
  }

  return (
    <div>
      <DateRangeFilter
        active={preset}
        onChange={handlePresetChange}
        className="mb-5"
      />

      {loading ? (
        <div className="rounded-lg bg-cream-50 p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-center py-6">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-cream-50 p-5 shadow-soft sm:p-6">
          {/* Big percentage */}
          <div className="flex flex-col items-center py-2">
            <PercentageRing value={data.percentage} size={88} stroke={7} />
            <p className="mt-3 text-sm text-ink-soft">
              {data.range.from} — {data.range.to}
            </p>
          </div>

          {/* Stat grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBlock
              label="Class days"
              value={data.totalClassDays}
              color="text-night-900"
            />
            <StatBlock
              label="Present"
              value={data.present}
              color="text-success"
            />
            <StatBlock label="Late" value={data.late} color="text-warn" />
            <StatBlock label="Absent" value={data.absent} color="text-error" />
          </div>

          {/* Not marked */}
          {data.notMarked > 0 && (
            <p className="mt-4 rounded-lg border border-cream-200 bg-cream-100 px-4 py-2.5 text-center text-xs text-ink-soft">
              {data.notMarked} day(s) not marked by teacher — these are not
              counted as absent
            </p>
          )}

          {/* Late dates */}
          {data.lateDates.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-ink-soft">
                Late dates
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.lateDates.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-warn/15 px-2.5 py-1 text-xs font-medium text-warn"
                  >
                    {new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBlock({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-cream-100 px-3 py-3 text-center">
      <p className={`font-display text-xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{label}</p>
    </div>
  );
}
