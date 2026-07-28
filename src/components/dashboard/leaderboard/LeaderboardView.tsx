"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Trophy,
  Sparkles,
  BookOpen,
  FileCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, Spinner } from "@/components/ui";
import { getLeaderboardAction } from "@/actions/dashboard/leaderboard";
import type {
  LeaderboardData,
  LeaderboardQueryParams,
} from "@/types/dashboard";

interface LeaderboardViewProps {
  initialData?: LeaderboardData;
  batches?: { id: string; name: string }[];
  userRole?: string;
  defaultBatchId?: string;
}

export function LeaderboardView({
  initialData,
  batches = [],
  userRole,
  defaultBatchId,
}: LeaderboardViewProps) {
  const [scope, setScope] = useState<"batch" | "institute">(
    userRole === "PARENT" || userRole === "STUDENT" ? "batch" : "institute",
  );
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">(
    "alltime",
  );
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    defaultBatchId || batches[0]?.id || "",
  );

  const [data, setData] = useState<LeaderboardData | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSelectInstitute =
    userRole === "INSTITUTE" || userRole === "TEACHER" || userRole === "ADMIN";

  // When switching to batch scope, auto-select first batch if none selected
  useEffect(() => {
    if (scope === "batch" && !selectedBatchId && batches.length > 0) {
      setSelectedBatchId(batches[0].id);
    }
  }, [scope, batches, selectedBatchId]);

  // Fetch leaderboard data when scope, period, or selectedBatchId changes
  useEffect(() => {
    async function loadLeaderboard() {
      const isRestrictedRole = userRole === "STUDENT" || userRole === "PARENT";

      if (scope === "batch" && !selectedBatchId) {
        if (batches.length > 0) {
          return;
        }
        if (isRestrictedRole) {
          setData(undefined);
          setError(
            "No batch assigned to your account yet. Standings will be available once you are assigned to a batch.",
          );
          return;
        }
      }

      setLoading(true);
      setError(null);

      const effectiveScope =
        scope === "batch" && !selectedBatchId && !isRestrictedRole
          ? "institute"
          : scope;

      const params: LeaderboardQueryParams = {
        scope: effectiveScope,
        period,
        ...(effectiveScope === "batch" && selectedBatchId
          ? { batchId: selectedBatchId }
          : {}),
      };

      const res = await getLeaderboardAction(params);
      if (res.ok) {
        setData(res.data);
      } else {
        setError(res.error || "Failed to load leaderboard");
      }
      setLoading(false);
    }

    loadLeaderboard();
  }, [scope, period, selectedBatchId, userRole]);

  const top3 = data?.entries?.slice(0, 3) || [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 sm:space-y-6">
      {/* Header & Controls */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 shrink-0 text-gold-500" />
              <h1 className="font-display text-xl font-bold text-night-900 sm:text-2xl">
                Live Leaderboard
              </h1>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Real-time point rankings. Tiebreak chain: Points &rarr; Lessons
              &rarr; On-time Homework &rarr; Attendance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Scope selection */}
            {canSelectInstitute && (
              <div className="flex rounded-lg bg-cream-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setScope("institute")}
                  className={`rounded-md px-2.5 py-1 transition-all ${
                    scope === "institute"
                      ? "bg-white font-bold text-night-900 shadow-sm"
                      : "text-ink-soft hover:text-night-900"
                  }`}
                >
                  Institute-wise
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScope("batch");
                    if (!selectedBatchId && batches.length > 0) {
                      setSelectedBatchId(batches[0].id);
                    }
                  }}
                  className={`rounded-md px-2.5 py-1 transition-all ${
                    scope === "batch"
                      ? "bg-white font-bold text-night-900 shadow-sm"
                      : "text-ink-soft hover:text-night-900"
                  }`}
                >
                  Batch-wise
                </button>
              </div>
            )}

            {/* Batch selector dropdown */}
            {scope === "batch" && batches.length > 0 && (
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="h-8 rounded-lg border border-cream-200 bg-white px-2.5 text-xs font-semibold text-night-900 shadow-sm focus:outline-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}

            {/* Period selector */}
            <div className="flex rounded-lg bg-cream-100 p-1 text-xs font-semibold">
              {(["weekly", "monthly", "alltime"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-md px-2.5 py-1 capitalize transition-all ${
                    period === p
                      ? "bg-white font-bold text-night-900 shadow-sm"
                      : "text-ink-soft hover:text-night-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center gap-2 py-12 text-center text-sm text-ink-soft">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <p className="max-w-sm font-semibold text-night-900">{error}</p>
        </Card>
      ) : !data || !data.entries || data.entries.length === 0 ? (
        <Card className="py-12 text-center text-sm text-ink-soft">
          No leaderboard entries found for this batch/period.
        </Card>
      ) : (
        <>
          {/* Top 3 Podium (Optimized for Mobile Side-by-Side) */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 items-end gap-2 pt-2 pb-1 sm:gap-4">
              {/* Rank 2 (Silver) - Left */}
              <div className="flex min-h-[130px] flex-col items-center justify-end rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-center shadow-sm sm:min-h-[160px] sm:p-4">
                <div className="relative mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-display text-sm font-bold text-slate-800 shadow-inner sm:h-12 sm:w-12 sm:text-base">
                  2
                  <Award className="absolute -top-1 -right-1 h-4 w-4 text-slate-500" />
                </div>
                <h3 className="max-w-full truncate font-display text-xs font-bold text-night-900 sm:text-base">
                  {top3[1]?.name || "—"}
                </h3>
                <p className="mt-0.5 text-xs font-extrabold text-slate-700 sm:text-lg">
                  {top3[1]?.points ?? 0}{" "}
                  <span className="text-[10px] font-normal text-ink-soft">
                    pts
                  </span>
                </p>
              </div>

              {/* Rank 1 (Gold) - Center */}
              <div className="flex min-h-[145px] -translate-y-1 transform flex-col items-center justify-end rounded-xl border-2 border-gold-500/50 bg-gold-500/10 p-3 text-center shadow-md sm:min-h-[180px] sm:-translate-y-2 sm:p-5">
                <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 font-display text-base font-black text-night-900 shadow-md sm:h-16 sm:w-16 sm:text-xl">
                  1
                  <Trophy className="absolute -top-1.5 -right-1.5 h-5 w-5 animate-bounce text-amber-700 sm:h-6 sm:w-6" />
                </div>
                <h3 className="max-w-full truncate font-display text-xs font-extrabold text-night-900 sm:text-lg">
                  {top3[0]?.name || "—"}
                </h3>
                <p className="text-gold-700 mt-0.5 text-sm font-black sm:text-xl">
                  {top3[0]?.points ?? 0}{" "}
                  <span className="text-[10px] font-normal text-ink-soft">
                    pts
                  </span>
                </p>
              </div>

              {/* Rank 3 (Bronze) - Right */}
              <div className="flex min-h-[130px] flex-col items-center justify-end rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 text-center shadow-sm sm:min-h-[160px] sm:p-4">
                <div className="relative mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 font-display text-sm font-bold text-amber-900 shadow-inner sm:h-12 sm:w-12 sm:text-base">
                  3
                  <Award className="absolute -top-1 -right-1 h-4 w-4 text-amber-700" />
                </div>
                <h3 className="max-w-full truncate font-display text-xs font-bold text-night-900 sm:text-base">
                  {top3[2]?.name || "—"}
                </h3>
                <p className="mt-0.5 text-xs font-extrabold text-amber-800 sm:text-lg">
                  {top3[2]?.points ?? 0}{" "}
                  <span className="text-[10px] font-normal text-ink-soft">
                    pts
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Full Rankings Table */}
          <Card className="overflow-hidden border border-cream-200 p-0 shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-cream-100 font-display text-[11px] font-semibold text-night-900 sm:text-xs">
                  <tr>
                    <th className="px-3 py-3 sm:px-4">Rank</th>
                    <th className="px-3 py-3 sm:px-4">Student</th>
                    <th className="px-3 py-3 text-center sm:px-4">Points</th>
                    <th className="px-3 py-3 text-center sm:px-4">Breakdown</th>
                    <th className="hidden px-3 py-3 text-center sm:table-cell sm:px-4">
                      Tiebreaks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white">
                  {data.entries.map((entry) => (
                    <tr
                      key={entry.studentId}
                      className={`transition-colors hover:bg-cream-50 ${
                        entry.isCurrentUser ? "bg-gold-500/15 font-bold" : ""
                      }`}
                    >
                      <td className="px-3 py-3 font-bold whitespace-nowrap sm:px-4">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] sm:h-7 sm:w-7 sm:text-xs ${
                            entry.rank === 1
                              ? "bg-gold-500 font-black text-night-900"
                              : entry.rank === 2
                                ? "bg-slate-200 text-slate-800"
                                : entry.rank === 3
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-cream-100 text-ink-soft"
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-night-900">
                            {entry.name}
                          </span>
                          {entry.isCurrentUser && (
                            <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] font-extrabold text-night-900 sm:text-[10px]">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap sm:px-4">
                        <span className="text-sm font-extrabold text-night-900 sm:text-base">
                          {entry.points}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-[11px] whitespace-nowrap text-ink-soft sm:px-4">
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <span
                            title="Lesson Points"
                            className="text-gold-700 flex items-center gap-0.5 font-medium"
                          >
                            <BookOpen className="h-3 w-3" />
                            {entry.breakdown?.lessonPoints ?? 0}
                          </span>
                          <span
                            title="Homework Points"
                            className="flex items-center gap-0.5 font-medium text-arabic"
                          >
                            <FileCheck className="h-3 w-3" />
                            {entry.breakdown?.homeworkPoints ?? 0}
                          </span>
                          <span
                            title="Attendance Points"
                            className="flex items-center gap-0.5 font-medium text-quran"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {entry.breakdown?.attendancePoints ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-3 py-3 text-center text-xs whitespace-nowrap text-ink-soft sm:table-cell sm:px-4">
                        <span>
                          Lessons: {entry.tiebreak?.lessonsCompleted ?? 0} | HW:{" "}
                          {entry.tiebreak?.homeworkOnTime ?? 0} | Att:{" "}
                          {entry.tiebreak?.attendanceCount ?? 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
