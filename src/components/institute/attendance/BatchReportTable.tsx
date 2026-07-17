"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { LowAttendanceFlag } from "./LowAttendanceFlag";
import { Users } from "lucide-react";
import { getBatchReportAction } from "@/actions/attendance/get-batch-report";
import { Skeleton } from "@/components/ui";
import type { BatchReport } from "@/types/attendance";
import {
  DatePreset,
  DateRangeFilter,
  presetToParams,
} from "@/components/shared/attendance/DateRangeFilter";
import { PercentageRing } from "@/components/shared/attendance/PercentageRing";
import { EmptyState } from "@/components/shared/attendance/EmptyState";

interface BatchReportTableProps {
  batchId: string;
  initial: BatchReport;
  /** Base path for student drill-down links. */
  studentBasePath: string;
}

export function BatchReportTable({
  batchId,
  initial,
  studentBasePath,
}: BatchReportTableProps) {
  const [preset, setPreset] = useState<DatePreset>("month");
  const [data, setData] = useState<BatchReport>(initial);
  const [loading, setLoading] = useState(false);

  async function handlePresetChange(p: DatePreset) {
    setPreset(p);
    if (p === "month") {
      setData(initial);
      return;
    }
    setLoading(true);
    const params = presetToParams(p);
    const res = await getBatchReportAction(batchId, params);
    if (res.ok) setData(res.data);
    setLoading(false);
  }

  return (
    <div>
      <DateRangeFilter
        active={preset}
        onChange={handlePresetChange}
        className="mb-4"
      />

      {/* Batch average */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-cream-50 px-4 py-3 shadow-soft sm:px-5">
        <PercentageRing value={data.batchAverage} size={44} stroke={4} />
        <div>
          <p className="font-display text-base font-bold text-night-900">
            Batch average
          </p>
          <p className="text-xs text-ink-soft">{data.totalStudents} students</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-cream-50 shadow-soft">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-cream-200 px-5 py-4 last:border-0"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-28" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          ))}
        </div>
      ) : data.students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students"
          description="No students have been added to this batch yet."
        />
      ) : (
        <div className="rounded-lg bg-cream-50 shadow-soft">
          {/* Header — desktop only */}
          <div className="hidden border-b border-cream-200 px-5 py-3 sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto_auto] sm:gap-4">
            <span className="text-xs font-semibold text-ink-soft">Student</span>
            <span className="w-14 text-center text-xs font-semibold text-ink-soft">
              P
            </span>
            <span className="w-14 text-center text-xs font-semibold text-ink-soft">
              L
            </span>
            <span className="w-14 text-center text-xs font-semibold text-ink-soft">
              A
            </span>
            <span className="w-14 text-center text-xs font-semibold text-ink-soft">
              N/M
            </span>
            <span className="w-14 text-center text-xs font-semibold text-ink-soft">
              %
            </span>
          </div>

          <ul className="divide-y divide-cream-200">
            {data.students.map((row) => (
              <li key={row.student.id}>
                <Link
                  href={`${studentBasePath}/${row.student.id}`}
                  className="block px-4 py-3.5 transition-colors hover:bg-cream-100 active:bg-cream-200 sm:px-5"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-night-900">
                          {row.student.name}
                        </p>
                        <p className="text-xs text-ink-soft">
                          {row.student.studentCode}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <LowAttendanceFlag
                          percentage={row.percentage}
                          threshold={75}
                        />
                        <PercentageRing
                          value={row.percentage}
                          size={40}
                          stroke={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-ink-soft">
                      <span>
                        <span className="font-semibold text-success">
                          {row.present}
                        </span>{" "}
                        P
                      </span>
                      <span>
                        <span className="font-semibold text-warn">
                          {row.late}
                        </span>{" "}
                        L
                      </span>
                      <span>
                        <span className="font-semibold text-error">
                          {row.absent}
                        </span>{" "}
                        A
                      </span>
                      {row.notMarked > 0 && (
                        <span>
                          <span className="font-semibold text-ink-soft">
                            {row.notMarked}
                          </span>{" "}
                          N/M
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto_auto] sm:items-center sm:gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-night-900">
                        {row.student.name}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {row.student.studentCode}
                      </p>
                    </div>
                    <span className="w-14 text-center text-sm font-semibold text-success">
                      {row.present}
                    </span>
                    <span className="w-14 text-center text-sm font-semibold text-warn">
                      {row.late}
                    </span>
                    <span className="w-14 text-center text-sm font-semibold text-error">
                      {row.absent}
                    </span>
                    <span
                      className={cn(
                        "w-14 text-center text-sm font-semibold",
                        row.notMarked > 0 ? "text-ink-soft" : "text-cream-200",
                      )}
                    >
                      {row.notMarked}
                    </span>
                    <div className="flex w-14 items-center justify-center gap-1">
                      <LowAttendanceFlag
                        percentage={row.percentage}
                        threshold={75}
                      />
                      <PercentageRing
                        value={row.percentage}
                        size={36}
                        stroke={3}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
