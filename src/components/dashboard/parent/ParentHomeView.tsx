"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  Users,
  ChevronRight,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
} from "lucide-react";
import { Card, Button, Spinner } from "@/components/ui";
import { getLeaderboardAction, getFinalLeaderboardAction } from "@/actions/dashboard/leaderboard";
import type {
  ParentChildOverviewItem,
  LeaderboardData,
  LeaderboardQueryParams,
  FinalLeaderboardData,
} from "@/types/dashboard";

interface ParentHomeViewProps {
  childrenData: ParentChildOverviewItem[];
}

export function ParentHomeView({ childrenData }: ParentHomeViewProps) {
  // Extract unique batches from children
  const availableBatches = Array.from(
    new Map(
      childrenData
        .filter((c) => c.batch?.id && c.batch?.name)
        .map((c) => [c.batch.id, c.batch])
    ).values()
  );

  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    availableBatches[0]?.id || ""
  );
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

  // Parent children IDs for highlighting
  const parentChildIds = new Set(childrenData.map((c) => c.id));
  const parentChildCodes = new Set(childrenData.map((c) => c.studentCode));

  // Fetch Live Leaderboard: GET /leaderboard?scope=batch&period=...&batchId=...
  useEffect(() => {
    if (activeTab !== "live") return;

    async function loadLiveLeaderboard() {
      if (!selectedBatchId && availableBatches.length > 0) {
        setSelectedBatchId(availableBatches[0].id);
        return;
      }

      setLoadingLive(true);
      setLiveError(null);

      const params: LeaderboardQueryParams = {
        scope: "batch",
        period,
        ...(selectedBatchId ? { batchId: selectedBatchId } : {}),
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
  }, [activeTab, selectedBatchId, period]);

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
    availableBatches.find((b) => b.id === selectedBatchId)?.name || "Batch";

  const top3Live = liveData?.entries?.slice(0, 3) || [];
  const restLive = liveData?.entries?.slice(3) || [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-night-900 via-night-800 to-night-900 p-6 sm:p-8 text-cream-50 shadow-soft">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-500/20 border border-gold-500/30 px-3 py-1 text-xs font-semibold text-gold-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Parent Dashboard</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Standings & Leaderboard
          </h1>
          <p className="text-sm text-cream-100/70 leading-relaxed">
            Monitor real-time progress, live batch rankings, and frozen final standings for your children.
          </p>
        </div>

        {/* Decorative backdrop elements */}
        <div className="absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-gold-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Children Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-night-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-gold-600" />
            <span>Enrolled Children ({childrenData.length})</span>
          </h2>
          <Link
            href="/dashboard/parent/children"
            className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 transition-colors"
          >
            Manage All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {childrenData.length === 0 ? (
          <Card className="py-10 text-center text-sm text-ink-soft">
            No children are currently linked to your parent account.
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {childrenData.map((child) => {
              const isSelected = child.batch?.id === selectedBatchId;

              return (
                <Card
                  key={child.id}
                  className={`p-4 transition-all border flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "border-gold-500/60 bg-gold-500/5 shadow-sm ring-1 ring-gold-500/20"
                      : "border-cream-200 bg-white hover:border-cream-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-duas-soft font-display text-base font-bold text-duas shadow-inner">
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-night-900 text-sm truncate">
                          {child.name}
                        </h3>
                        <p className="text-[11px] text-ink-soft truncate">
                          {child.studentCode} • Class {child.class}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/10 px-2 py-0.5 text-xs font-extrabold text-night-900 shrink-0">
                      <Trophy className="h-3 w-3 text-gold-600" />
                      <span>#{child.rank?.rank ?? "-"}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-b border-cream-100/70 py-2">
                    <span className="text-ink-soft truncate">
                      Batch: <strong className="text-night-900">{child.batch?.name || "Unassigned"}</strong>
                    </span>
                    <span className="font-extrabold text-night-900 shrink-0">
                      {child.points} Pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {child.batch?.id ? (
                      <button
                        type="button"
                        onClick={() => setSelectedBatchId(child.batch.id)}
                        className={`text-[11px] font-bold transition-colors ${
                          isSelected
                            ? "text-gold-600 font-extrabold"
                            : "text-ink-soft hover:text-night-900 hover:underline"
                        }`}
                      >
                        {isSelected ? "Viewing Standings" : "Select Standings"}
                      </button>
                    ) : (
                      <span />
                    )}

                    <Link
                      href={`/dashboard/parent/children/${child.id}`}
                      className="inline-flex items-center gap-0.5 rounded-md bg-cream-100 px-2.5 py-1 text-xs font-bold text-night-900 hover:bg-gold-500 hover:text-night-900 transition-colors"
                    >
                      Details <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Leaderboard Main Section */}
      <Card className="p-6 space-y-6 border border-cream-200 shadow-soft">
        {/* Navigation Tabs & Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cream-100 pb-5">
          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-cream-100 p-1 text-xs font-bold text-night-900 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
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
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                activeTab === "final"
                  ? "bg-white text-night-900 shadow-sm font-extrabold"
                  : "text-ink-soft hover:text-night-900"
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-gold-600" />
              <span>Final Standings</span>
            </button>
          </div>

          {/* Controls: Batch & Period Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {availableBatches.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-ink-soft hidden sm:inline">Batch:</span>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-xs font-semibold text-night-900 outline-none focus:border-gold-500"
                >
                  {availableBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "live" && (
              <div className="flex rounded-lg bg-cream-100 p-1 text-xs font-semibold">
                {(["weekly", "monthly", "alltime"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-md capitalize transition-all ${
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

        {/* TAB 1: LIVE LEADERBOARD VIEW */}
        {activeTab === "live" && (
          <div className="space-y-6">
            {loadingLive ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <Spinner className="h-8 w-8 text-gold-500" />
                <p className="text-sm text-ink-soft">Loading live leaderboard data...</p>
              </div>
            ) : liveError ? (
              <div className="py-12 text-center text-sm text-error bg-error/5 rounded-xl border border-error/20 p-4">
                <AlertCircle className="mx-auto h-8 w-8 text-error mb-2" />
                <p className="font-semibold">{liveError}</p>
              </div>
            ) : !liveData || !liveData.entries || liveData.entries.length === 0 ? (
              <div className="py-12 text-center text-sm text-ink-soft">
                No leaderboard entries found for this batch and period.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top 3 Podium (when entries available) */}
                {top3Live.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-3 pt-2">
                    {/* Rank 2 - Silver */}
                    {top3Live[1] && (
                      <div className="order-2 sm:order-1 flex flex-col items-center p-4 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm text-center relative overflow-hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-bold mb-2">
                          #2
                        </div>
                        <h4 className="font-bold text-night-900 text-sm truncate max-w-full">
                          {top3Live[1].name}
                        </h4>
                        {parentChildIds.has(top3Live[1].studentId) && (
                          <span className="mt-1 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
                            Your Child
                          </span>
                        )}
                        <p className="mt-2 text-lg font-extrabold text-night-900">
                          {top3Live[1].points} <span className="text-xs text-ink-soft font-normal">pts</span>
                        </p>
                      </div>
                    )}

                    {/* Rank 1 - Gold */}
                    {top3Live[0] && (
                      <div className="order-1 sm:order-2 flex flex-col items-center p-5 rounded-xl border-2 border-gold-500/40 bg-gold-500/10 shadow-md text-center relative overflow-hidden">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-night-900 font-extrabold text-lg mb-2 shadow">
                          #1
                        </div>
                        <h4 className="font-extrabold text-night-900 text-base truncate max-w-full">
                          {top3Live[0].name}
                        </h4>
                        {parentChildIds.has(top3Live[0].studentId) && (
                          <span className="mt-1 rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-extrabold text-night-900 shadow-sm">
                            Your Child
                          </span>
                        )}
                        <p className="mt-2 text-xl font-black text-gold-700">
                          {top3Live[0].points} <span className="text-xs text-ink-soft font-normal">pts</span>
                        </p>
                      </div>
                    )}

                    {/* Rank 3 - Bronze */}
                    {top3Live[2] && (
                      <div className="order-3 flex flex-col items-center p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm text-center relative overflow-hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold mb-2">
                          #3
                        </div>
                        <h4 className="font-bold text-night-900 text-sm truncate max-w-full">
                          {top3Live[2].name}
                        </h4>
                        {parentChildIds.has(top3Live[2].studentId) && (
                          <span className="mt-1 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
                            Your Child
                          </span>
                        )}
                        <p className="mt-2 text-lg font-extrabold text-night-900">
                          {top3Live[2].points} <span className="text-xs text-ink-soft font-normal">pts</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Full Live Table */}
                <div className="overflow-x-auto rounded-xl border border-cream-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-cream-100 font-display text-xs font-semibold text-night-900">
                      <tr>
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3 text-center">Total Points</th>
                        <th className="px-4 py-3 text-center">Lessons</th>
                        <th className="px-4 py-3 text-center">On-Time Homework</th>
                        <th className="px-4 py-3 text-center">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200 bg-white">
                      {liveData.entries.map((entry) => {
                        const isChild = parentChildIds.has(entry.studentId);
                        const isTop1 = entry.rank === 1;

                        return (
                          <tr
                            key={entry.studentId}
                            className={`transition-colors ${
                              isChild
                                ? "bg-gold-500/10 font-bold hover:bg-gold-500/15"
                                : isTop1
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
                                {isChild && (
                                  <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900 shrink-0">
                                    Your Child
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

        {/* TAB 2: FROZEN FINAL STANDINGS VIEW */}
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
                        const isChild =
                          parentChildIds.has(entry.studentId) ||
                          parentChildCodes.has(entry.studentCode);

                        return (
                          <tr
                            key={entry.studentId}
                            className={`transition-colors ${
                              isChild
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
                                {isChild && (
                                  <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900 shrink-0">
                                    Your Child
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
    </div>
  );
}
