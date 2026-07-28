"use client";

import { useState, useEffect } from "react";
import { Trophy, Award, Sparkles, Lock, Zap, AlertCircle } from "lucide-react";
import { Card, Spinner } from "@/components/ui";
import {
  getLeaderboardAction,
  getFinalLeaderboardAction,
} from "@/actions/dashboard/leaderboard";
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
    defaultBatchId || batches[0]?.id || "",
  );
  const [scope, setScope] = useState<"batch" | "institute">("batch");
  const [activeTab, setActiveTab] = useState<"live" | "final">("live");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "alltime">(
    "alltime",
  );

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
        setFinalError(
          res.error ||
            "No final frozen leaderboard available for this batch yet.",
        );
      }
      setLoadingFinal(false);
    }

    loadFinalLeaderboard();
  }, [activeTab, selectedBatchId]);

  const selectedBatchName =
    batches.find((b) => b.id === selectedBatchId)?.name || "Batch";

  const top3Live = liveData?.entries?.slice(0, 3) || [];

  return (
    <Card className="space-y-6 border border-cream-200 p-6 shadow-soft">
      {/* Header & Control Bar */}
      <div className="flex flex-col gap-4 border-b border-cream-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold-500" />
            <h2 className="font-display text-xl font-bold text-night-900">
              {title}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-ink-soft">
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
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "live"
                  ? "bg-white font-extrabold text-night-900 shadow-sm"
                  : "text-ink-soft hover:text-night-900"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-gold-500" />
              <span>Live Leaderboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("final")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "final"
                  ? "bg-white font-extrabold text-night-900 shadow-sm"
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
          )}
        </div>
      </div>

      {/* TAB 1: LIVE LEADERBOARD */}
      {activeTab === "live" && (
        <div className="space-y-6">
          {loadingLive ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-16 text-center">
              <Spinner className="h-8 w-8 text-gold-500" />
              <p className="text-sm text-ink-soft">Loading live standings...</p>
            </div>
          ) : liveError ? (
            <div className="rounded-xl border border-error/20 bg-error/5 p-4 py-10 text-center text-sm text-error">
              <AlertCircle className="mx-auto mb-1.5 h-7 w-7 text-error" />
              <p className="font-semibold">{liveError}</p>
            </div>
          ) : !liveData ||
            !liveData.entries ||
            liveData.entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink-soft">
              No leaderboard entries found for this batch/period.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top 3 Podium (Side-by-Side Mobile Layout) */}
              {top3Live.length > 0 && (
                <div className="grid grid-cols-3 items-end gap-2 pt-2 pb-1 sm:gap-4">
                  {/* Rank 2 (Silver) - Left */}
                  <div className="flex min-h-[130px] flex-col items-center justify-end rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-center shadow-sm sm:min-h-[160px] sm:p-4">
                    <div className="relative mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-display text-sm font-bold text-slate-800 shadow-inner sm:h-12 sm:w-12 sm:text-base">
                      2
                    </div>
                    <h4 className="max-w-full truncate text-xs font-bold text-night-900 sm:text-base">
                      {top3Live[1]?.name || "—"}
                    </h4>
                    {(top3Live[1]?.isCurrentUser ||
                      top3Live[1]?.studentId === currentStudentId) && (
                      <span className="mt-0.5 rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] font-extrabold text-night-900">
                        You
                      </span>
                    )}
                    <p className="mt-1 text-xs font-extrabold text-slate-700 sm:text-lg">
                      {top3Live[1]?.points ?? 0}{" "}
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
                    <h4 className="max-w-full truncate font-display text-xs font-extrabold text-night-900 sm:text-lg">
                      {top3Live[0]?.name || "—"}
                    </h4>
                    {(top3Live[0]?.isCurrentUser ||
                      top3Live[0]?.studentId === currentStudentId) && (
                      <span className="mt-0.5 rounded-full bg-gold-500 px-2 py-0.5 text-[9px] font-extrabold text-night-900 shadow-sm">
                        You
                      </span>
                    )}
                    <p className="text-gold-700 mt-1 text-sm font-black sm:text-xl">
                      {top3Live[0]?.points ?? 0}{" "}
                      <span className="text-[10px] font-normal text-ink-soft">
                        pts
                      </span>
                    </p>
                  </div>

                  {/* Rank 3 (Bronze) - Right */}
                  <div className="flex min-h-[130px] flex-col items-center justify-end rounded-xl border border-amber-200 bg-amber-50/50 p-2.5 text-center shadow-sm sm:min-h-[160px] sm:p-4">
                    <div className="relative mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 font-display text-sm font-bold text-amber-900 shadow-inner sm:h-12 sm:w-12 sm:text-base">
                      3
                    </div>
                    <h4 className="max-w-full truncate text-xs font-bold text-night-900 sm:text-base">
                      {top3Live[2]?.name || "—"}
                    </h4>
                    {(top3Live[2]?.isCurrentUser ||
                      top3Live[2]?.studentId === currentStudentId) && (
                      <span className="mt-0.5 rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] font-extrabold text-night-900">
                        You
                      </span>
                    )}
                    <p className="mt-1 text-xs font-extrabold text-amber-800 sm:text-lg">
                      {top3Live[2]?.points ?? 0}{" "}
                      <span className="text-[10px] font-normal text-ink-soft">
                        pts
                      </span>
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
                      <th className="px-4 py-3 text-center">
                        On-Time Homework
                      </th>
                      <th className="px-4 py-3 text-center">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    {liveData.entries.map((entry) => {
                      const isMe =
                        entry.isCurrentUser ||
                        entry.studentId === currentStudentId;

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
                          <td className="px-4 py-3 font-bold whitespace-nowrap">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${
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
                          <td className="px-4 py-3 font-semibold text-night-900">
                            <div className="flex items-center gap-2">
                              <span>{entry.name}</span>
                              {isMe && (
                                <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
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
            <div className="flex flex-col items-center justify-center space-y-3 py-16 text-center">
              <Spinner className="h-8 w-8 text-gold-500" />
              <p className="text-sm text-ink-soft">
                Loading frozen final standings...
              </p>
            </div>
          ) : finalError ? (
            <div className="space-y-2 rounded-xl border border-cream-200 bg-cream-50 p-6 py-12 text-center text-sm text-ink-soft">
              <Lock className="mx-auto mb-1 h-8 w-8 text-gold-600/50" />
              <p className="font-semibold text-night-900">
                No Frozen Standings Yet
              </p>
              <p className="mx-auto max-w-md text-xs text-ink-soft">
                {finalError}
              </p>
            </div>
          ) : !finalData ||
            !finalData.entries ||
            finalData.entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink-soft">
              No final leaderboard records found for this batch.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Finalized Banner */}
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-gold-500/20 bg-gold-500/10 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-night-900">
                  <Lock className="h-5 w-5 shrink-0 text-gold-600" />
                  <div>
                    <h4 className="text-sm font-bold">
                      Permanent Frozen Standings
                    </h4>
                    <p className="text-xs text-ink-soft">
                      Final snapshot for batch{" "}
                      <strong className="text-night-900">
                        {selectedBatchName}
                      </strong>
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-cream-200 bg-white px-3 py-1 text-xs font-semibold text-night-900">
                  Finalized{" "}
                  {new Date(finalData.finalizedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
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
                      <th className="px-4 py-3 text-center">
                        On-Time Homework
                      </th>
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
                          <td className="px-4 py-3 font-bold whitespace-nowrap">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${
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
                          <td className="px-4 py-3 font-semibold text-night-900">
                            <div className="flex items-center gap-2">
                              <span>{entry.name}</span>
                              {isMe && (
                                <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
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
