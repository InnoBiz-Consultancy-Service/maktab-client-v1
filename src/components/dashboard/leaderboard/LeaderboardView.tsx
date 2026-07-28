"use client";

import { useState, useEffect } from "react";
import { Award, Trophy, Sparkles, BookOpen, FileCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, Spinner } from "@/components/ui";
import { getLeaderboardAction } from "@/actions/dashboard/leaderboard";
import type { LeaderboardData, LeaderboardQueryParams } from "@/types/dashboard";

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
    userRole === "PARENT" || userRole === "STUDENT" ? "batch" : "institute"
  );
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("alltime");
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    defaultBatchId || batches[0]?.id || ""
  );

  const [data, setData] = useState<LeaderboardData | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSelectInstitute = userRole === "INSTITUTE" || userRole === "TEACHER" || userRole === "ADMIN";

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
          setError("No batch assigned to your account yet. Standings will be available once you are assigned to a batch.");
          return;
        }
      }

      setLoading(true);
      setError(null);

      const effectiveScope = (scope === "batch" && !selectedBatchId && !isRestrictedRole) ? "institute" : scope;

      const params: LeaderboardQueryParams = {
        scope: effectiveScope,
        period,
        ...(effectiveScope === "batch" && selectedBatchId ? { batchId: selectedBatchId } : {}),
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
              <Sparkles className="h-5 w-5 text-gold-500 shrink-0" />
              <h1 className="font-display text-xl sm:text-2xl font-bold text-night-900">
                Live Leaderboard
              </h1>
            </div>
            <p className="mt-1 text-xs text-ink-soft leading-relaxed">
              Real-time point rankings. Tiebreak chain: Points &rarr; Lessons &rarr; On-time Homework &rarr; Attendance.
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
                      ? "bg-white text-night-900 shadow-sm font-bold"
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
                      ? "bg-white text-night-900 shadow-sm font-bold"
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
                      ? "bg-white text-night-900 shadow-sm font-bold"
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
        <div className="flex py-16 justify-center">
          <Spinner />
        </div>
      ) : error ? (
        <Card className="py-12 text-center text-sm text-ink-soft flex flex-col items-center gap-2">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <p className="font-semibold text-night-900 max-w-sm">{error}</p>
        </Card>
      ) : !data || !data.entries || data.entries.length === 0 ? (
        <Card className="py-12 text-center text-ink-soft text-sm">
          No leaderboard entries found for this batch/period.
        </Card>
      ) : (
        <>
          {/* Top 3 Podium (Optimized for Mobile Side-by-Side) */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 pt-2 pb-1">
              {/* Rank 2 (Silver) - Left */}
              <div className="flex flex-col items-center justify-end rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 sm:p-4 text-center shadow-sm min-h-[130px] sm:min-h-[160px]">
                <div className="relative mb-1.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-200 font-display font-bold text-slate-800 text-sm sm:text-base shadow-inner">
                  2
                  <Award className="absolute -top-1 -right-1 h-4 w-4 text-slate-500" />
                </div>
                <h3 className="font-display font-bold text-night-900 text-xs sm:text-base truncate max-w-full">
                  {top3[1]?.name || "—"}
                </h3>
                <p className="mt-0.5 font-extrabold text-slate-700 text-xs sm:text-lg">
                  {top3[1]?.points ?? 0} <span className="text-[10px] font-normal text-ink-soft">pts</span>
                </p>
              </div>

              {/* Rank 1 (Gold) - Center */}
              <div className="flex flex-col items-center justify-end rounded-xl border-2 border-gold-500/50 bg-gold-500/10 p-3 sm:p-5 text-center shadow-md transform -translate-y-1 sm:-translate-y-2 min-h-[145px] sm:min-h-[180px]">
                <div className="relative mb-2 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gold-500 font-display font-black text-night-900 text-base sm:text-xl shadow-md">
                  1
                  <Trophy className="absolute -top-1.5 -right-1.5 h-5 w-5 sm:h-6 sm:w-6 text-amber-700 animate-bounce" />
                </div>
                <h3 className="font-display font-extrabold text-night-900 text-xs sm:text-lg truncate max-w-full">
                  {top3[0]?.name || "—"}
                </h3>
                <p className="mt-0.5 font-black text-gold-700 text-sm sm:text-xl">
                  {top3[0]?.points ?? 0} <span className="text-[10px] font-normal text-ink-soft">pts</span>
                </p>
              </div>

              {/* Rank 3 (Bronze) - Right */}
              <div className="flex flex-col items-center justify-end rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 sm:p-4 text-center shadow-sm min-h-[130px] sm:min-h-[160px]">
                <div className="relative mb-1.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amber-200 font-display font-bold text-amber-900 text-sm sm:text-base shadow-inner">
                  3
                  <Award className="absolute -top-1 -right-1 h-4 w-4 text-amber-700" />
                </div>
                <h3 className="font-display font-bold text-night-900 text-xs sm:text-base truncate max-w-full">
                  {top3[2]?.name || "—"}
                </h3>
                <p className="mt-0.5 font-extrabold text-amber-800 text-xs sm:text-lg">
                  {top3[2]?.points ?? 0} <span className="text-[10px] font-normal text-ink-soft">pts</span>
                </p>
              </div>
            </div>
          )}

          {/* Full Rankings Table */}
          <Card className="p-0 overflow-hidden border border-cream-200 shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-cream-100 font-display text-[11px] sm:text-xs font-semibold text-night-900">
                  <tr>
                    <th className="px-3 sm:px-4 py-3">Rank</th>
                    <th className="px-3 sm:px-4 py-3">Student</th>
                    <th className="px-3 sm:px-4 py-3 text-center">Points</th>
                    <th className="px-3 sm:px-4 py-3 text-center">Breakdown</th>
                    <th className="px-3 sm:px-4 py-3 text-center hidden sm:table-cell">Tiebreaks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 bg-white">
                  {data.entries.map((entry) => (
                    <tr
                      key={entry.studentId}
                      className={`transition-colors hover:bg-cream-50 ${
                        entry.isCurrentUser
                          ? "bg-gold-500/15 font-bold"
                          : ""
                      }`}
                    >
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap font-bold">
                        <span
                          className={`inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[11px] sm:text-xs ${
                            entry.rank === 1
                              ? "bg-gold-500 text-night-900 font-black"
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
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-night-900">
                            {entry.name}
                          </span>
                          {entry.isCurrentUser && (
                            <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-night-900">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap">
                        <span className="font-extrabold text-night-900 text-sm sm:text-base">
                          {entry.points}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap text-[11px] text-ink-soft">
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <span title="Lesson Points" className="flex items-center gap-0.5 text-gold-700 font-medium">
                            <BookOpen className="h-3 w-3" />
                            {entry.breakdown?.lessonPoints ?? 0}
                          </span>
                          <span title="Homework Points" className="flex items-center gap-0.5 text-arabic font-medium">
                            <FileCheck className="h-3 w-3" />
                            {entry.breakdown?.homeworkPoints ?? 0}
                          </span>
                          <span title="Attendance Points" className="flex items-center gap-0.5 text-quran font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            {entry.breakdown?.attendancePoints ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-center whitespace-nowrap text-xs text-ink-soft hidden sm:table-cell">
                        <span>
                          Lessons: {entry.tiebreak?.lessonsCompleted ?? 0} | HW: {entry.tiebreak?.homeworkOnTime ?? 0} | Att: {entry.tiebreak?.attendanceCount ?? 0}
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
