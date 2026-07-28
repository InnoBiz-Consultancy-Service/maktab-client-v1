"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Card, Spinner } from "@/components/ui";
import { getLeaderboardAction, getFinalLeaderboardAction } from "@/actions/dashboard/leaderboard";
import type {
  LeaderboardData,
  LeaderboardQueryParams,
  FinalLeaderboardData,
} from "@/types/dashboard";

interface LeaderboardSectionProps {
  currentStudentId?: string;
  defaultBatchId?: string;
  batches?: { id: string; name: string }[];
  title?: string;
  showScopeSelector?: boolean;
}

export function LeaderboardSection({
  currentStudentId,
  defaultBatchId = "",
  batches = [],
  title = "Leaderboard & Standings",
  showScopeSelector = false,
}: LeaderboardSectionProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    defaultBatchId || batches[0]?.id || ""
  );
  const [scope, setScope] = useState<"batch" | "institute">("batch");
  const [activeTab, setActiveTab] = useState<"live" | "final">("live");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">("alltime");

  // Live leaderboard state
  const [liveData, setLiveData] = useState<LeaderboardData | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  // Final leaderboard state
  const [finalData, setFinalData] = useState<FinalLeaderboardData | null>(null);
  const [loadingFinal, setLoadingFinal] = useState(false);
  const [finalError, setFinalError] = useState<string | null>(null);

  // Auto select first batch if available and none selected
  useEffect(() => {
    if (!selectedBatchId && batches.length > 0) {
      setSelectedBatchId(batches[0].id);
    }
  }, [batches, selectedBatchId]);

  // Fetch Live Leaderboard: GET /leaderboard?scope=...&period=...&batchId=...
  useEffect(() => {
    if (activeTab !== "live") return;

    async function loadLiveLeaderboard() {
      if (!selectedBatchId) {
        setLiveError("No batch assigned or selected.");
        return;
      }

      setLoadingLive(true);
      setLiveError(null);

      const params: LeaderboardQueryParams = {
        scope: "batch",
        period,
        batchId: selectedBatchId,
      };

      const res = await getLeaderboardAction(params);
      if (res.ok) {
        setLiveData(res.data);
      } else {
        setLiveError(res.error || "Could not load live leaderboard");
      }
      setLoadingLive(false);
    }

    loadLiveLeaderboard();
  }, [activeTab, scope, selectedBatchId, period]);

  // Fetch Final Leaderboard: GET /batches/:id/final-leaderboard
  useEffect(() => {
    if (activeTab !== "final") return;

    async function loadFinalLeaderboard() {
      if (!selectedBatchId) {
        setFinalError("Please select a batch to view final standings.");
        return;
      }

      setLoadingFinal(true);
      setFinalError(null);

      const res = await getFinalLeaderboardAction(selectedBatchId);
      if (res.ok) {
        setFinalData(res.data);
      } else {
        setFinalError(res.error || "No final frozen leaderboard available for this batch yet.");
      }
      setLoadingFinal(false);
    }

    loadFinalLeaderboard();
  }, [activeTab, selectedBatchId]);

  const selectedBatchName =
    batches.find((b) => b.id === selectedBatchId)?.name || "Batch";

  const top3Live = liveData?.entries?.slice(0, 3) || [];

  return (
    <Card className="p-6 space-y-6 border border-cream-200 shadow-soft">
      {/* Header & Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cream-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold-500" />
            <h2 className="font-display text-xl font-bold text-night-900">
              {title}
            </h2>
          </div>
          <p className="text-xs text-ink-soft mt-0.5">
            Real-time rankings and frozen final batch standings.
          </p>
        </div>

        {/* Tab Switcher & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live vs Final Tab */}
          <div className="flex rounded-xl bg-cream-100 p-1 text-xs font-bold text-night-900">
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "live"
                  ? "bg-white text-night-900 shadow-sm font-extrabold"
                  : "text-ink-soft hover:text-night-900"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-gold-500" />
              <span>Live Leaderboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("final")}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "final"
                  ? "bg-white text-night-900 shadow-sm font-extrabold"
                  : "text-ink-soft hover:text-night-900"
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-gold-600" />
              <span>Final Standings</span>
            </button>
          </div>

          {/* Batches Selector */}
          {batches.length > 0 && (
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-xs font-semibold text-night-900 outline-none focus:border-gold-500"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          {/* Period Selector */}
          {activeTab === "live" && (
            <div className="flex rounded-lg bg-cream-100 p-1 text-xs font-semibold">
              {(["weekly", "monthly", "alltime"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    period === p
                      ? "bg-white text-night-900 shadow-sm font-bold"
                      : "text-ink-soft hover:text-night-900"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: LIVE LEADERBOARD */}
      {activeTab === "live" && (
        <div className="space-y-6">
          {loadingLive ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Spinner className="h-8 w-8 text-gold-500" />
              <p className="text-sm text-ink-soft">Loading live standings...</p>
            </div>
          ) : liveError ? (
            <div className="py-10 text-center text-sm text-error bg-error/5 rounded-xl border border-error/20 p-4">
              <AlertCircle className="mx-auto h-7 w-7 text-error mb-1.5" />
              <p className="font-semibold">{liveError}</p>
            </div>
          ) : !liveData || !liveData.entries || liveData.entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink-soft">
              No leaderboard entries found for this batch/period.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top 3 Podium (Side-by-Side Mobile Layout) */}
              {top3Live.length > 0 && (
                <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 pt-2 pb-1">
                  {/* Rank 2 (Silver) - Left */}
                  <div className="flex flex-col items-center justify-end rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 sm:p-4 text-center shadow-sm min-h-[130px] sm:min-h-[160px]">
                    <div className="relative mb-1.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-200 font-display font-bold text-slate-800 text-sm sm:text-base shadow-inner">
                      2
                    </div>
                    <h4 className="font-bold text-night-900 text-xs sm:text-base truncate max-w-full">
                      {top3Live[1]?.name || "—"}
                    </h4>
                    {(top3Live[1]?.isCurrentUser || top3Live[1]?.studentId === currentStudentId) && (
                      <span className="mt-0.5 rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] font-extrabold text-night-900">
                        You
                      </span>
                    )}
                    <p className="mt-1 font-extrabold text-slate-700 text-xs sm:text-lg">
                      {top3Live[1]?.points ?? 0} <span className="text-[10px] font-normal text-ink-soft">pts</span>
                    </p>
                  </div>

                  {/* Rank 1 (Gold) - Center */}
                  <div className="flex flex-col items-center justify-end rounded-xl border-2 border-gold-500/50 bg-gold-500/10 p-3 sm:p-5 text-center shadow-md transform -translate-y-1 sm:-translate-y-2 min-h-[145px] sm:min-h-[180px]">
                    <div className="relative mb-2 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gold-500 font-display font-black text-night-900 text-base sm:text-xl shadow-md">
                      1
                      <Trophy className="absolute -top-1.5 -right-1.5 h-5 w-5 sm:h-6 sm:w-6 text-amber-700 animate-bounce" />
                    </div>
                    <h4 className="font-display font-extrabold text-night-900 text-xs sm:text-lg truncate max-w-full">
                      {top3Live[0]?.name || "—"}
                    </h4>
                    {(top3Live[0]?.isCurrentUser || top3Live[0]?.studentId === currentStudentId) && (
                      <span className="mt-0.5 rounded-full bg-gold-500 px-2 py-0.5 text-[9px] font-extrabold text-night-900 shadow-sm">
                        You
                      </span>
                    )}
                    <p className="mt-1 font-black text-gold-700 text-sm sm:text-xl">
                      {top3Live[0]?.points ?? 0} <span className="text-[10px] font-normal text-ink-soft">pts</span>
                    </p>
                  </div>

                  {/* Rank 3 (Bronze) - Right */}
                  <div className="flex flex-col items-center justify-end rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 sm:p-4 text-center shadow-sm min-h-[130px] sm:min-h-[160px]">
                    <div className="relative mb-1.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amber-200 font-display font-bold text-amber-900 text-sm sm:text-base shadow-inner">
                      3
                    </div>
                    <h4 className="font-bold text-night-900 text-xs sm:text-base truncate max-w-full">
                      {top3Live[2]?.name || "—"}
                    </h4>
                    {(top3Live[2]?.isCurrentUser || top3Live[2]?.studentId === currentStudentId) && (
                      <span className="mt-0.5 rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] font-extrabold text-night-900">
                        You
                      </span>
                    )}
                    <p className="mt-1 font-extrabold text-amber-800 text-xs sm:text-lg">
                      {top3Live[2]?.points ?? 0} <span className="text-[10px] font-normal text-ink-soft">pts</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Full Live Table */}
              <div className="overflow-x-auto rounded-xl border border-cream-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cream-100 font-display text-xs font-semibold text-night-900">
                    <tr>
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3 text-center">Total Points</th>
                      <th className="px-4 py-3 text-center">Lessons</th>
                      <th className="px-4 py-3 text-center">On-Time Homework</th>
                      <th className="px-4 py-3 text-center">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    {liveData.entries.map((entry) => {
                      const isMe = entry.isCurrentUser || entry.studentId === currentStudentId;

                      return (
                        <tr
                          key={entry.studentId}
                          className={`transition-colors ${
                            isMe
                              ? "bg-gold-500/10 font-bold hover:bg-gold-500/15"
                              : entry.rank === 1
                              ? "bg-amber-50/30 hover:bg-cream-50"
                              : "hover:bg-cream-50"
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap font-bold">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${
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
                          <td className="px-4 py-3 font-semibold text-night-900">
                            <div className="flex items-center gap-2">
                              <span>{entry.name}</span>
                              {isMe && (
                                <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900 shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-night-900">
                            {entry.points}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-ink-soft">
                            {entry.tiebreak?.lessonsCompleted ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-ink-soft">
                            {entry.tiebreak?.homeworkOnTime ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-ink-soft">
                            {entry.tiebreak?.attendanceCount ?? 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FROZEN FINAL STANDINGS */}
      {activeTab === "final" && (
        <div className="space-y-6">
          {loadingFinal ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Spinner className="h-8 w-8 text-gold-500" />
              <p className="text-sm text-ink-soft">Loading frozen final standings...</p>
            </div>
          ) : finalError ? (
            <div className="py-12 text-center text-sm text-ink-soft bg-cream-50 rounded-xl border border-cream-200 p-6 space-y-2">
              <Lock className="mx-auto h-8 w-8 text-gold-600/50 mb-1" />
              <p className="font-semibold text-night-900">No Frozen Standings Yet</p>
              <p className="text-xs text-ink-soft max-w-md mx-auto">
                {finalError}
              </p>
            </div>
          ) : !finalData || !finalData.entries || finalData.entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink-soft">
              No final leaderboard records found for this batch.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Finalized Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
                <div className="flex items-center gap-2 text-night-900">
                  <Lock className="h-5 w-5 text-gold-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Permanent Frozen Standings</h4>
                    <p className="text-xs text-ink-soft">
                      Final snapshot for batch <strong className="text-night-900">{selectedBatchName}</strong>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-night-900 bg-white px-3 py-1 rounded-full border border-cream-200 shrink-0">
                  Finalized {new Date(finalData.finalizedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {/* Final Standings Table */}
              <div className="overflow-x-auto rounded-xl border border-cream-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cream-100 font-display text-xs font-semibold text-night-900">
                    <tr>
                      <th className="px-4 py-3">Final Rank</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3 text-center">Final Points</th>
                      <th className="px-4 py-3 text-center">Lessons</th>
                      <th className="px-4 py-3 text-center">On-Time Homework</th>
                      <th className="px-4 py-3 text-center">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    {finalData.entries.map((entry) => {
                      const isMe = entry.studentId === currentStudentId;

                      return (
                        <tr
                          key={entry.studentId}
                          className={`transition-colors ${
                            isMe
                              ? "bg-gold-500/10 font-bold hover:bg-gold-500/15"
                              : "hover:bg-cream-50"
                          }`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap font-bold">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${
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
                          <td className="px-4 py-3 font-semibold text-night-900">
                            <div className="flex items-center gap-2">
                              <span>{entry.name}</span>
                              {isMe && (
                                <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900 shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-night-900">
                            {entry.totalPoints}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-ink-soft">
                            {entry.lessonCount}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-ink-soft">
                            {entry.homeworkOnTime}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-ink-soft">
                            {entry.attendanceCount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
