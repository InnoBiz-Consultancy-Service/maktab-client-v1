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
import {
  getLeaderboardAction,
  getFinalLeaderboardAction,
} from "@/actions/dashboard/leaderboard";
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
        .map((c) => [c.batch.id, c.batch]),
    ).values(),
  );

  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    availableBatches[0]?.id || "",
  );
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
    availableBatches.find((b) => b.id === selectedBatchId)?.name || "Batch";

  const top3Live = liveData?.entries?.slice(0, 3) || [];
  const restLive = liveData?.entries?.slice(3) || [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-night-900 via-night-800 to-night-900 p-6 text-cream-50 shadow-soft sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Parent Dashboard</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Academic Standings & Leaderboard
          </h1>
          <p className="text-sm leading-relaxed text-cream-100/70">
            Monitor real-time progress, live batch rankings, and frozen final
            standings for your children.
          </p>
        </div>

        {/* Decorative backdrop elements */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-gold-500/10 blur-2xl" />
      </div>

      {/* Children Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-night-900">
            <Users className="h-5 w-5 text-gold-600" />
            <span>Enrolled Children ({childrenData.length})</span>
          </h2>
          <Link
            href="/dashboard/parent/children"
            className="hover:text-gold-700 flex items-center gap-1 text-xs font-bold text-gold-600 transition-colors"
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
                  className={`flex flex-col justify-between space-y-3 border p-4 transition-all ${
                    isSelected
                      ? "border-gold-500/60 bg-gold-500/5 shadow-sm ring-1 ring-gold-500/20"
                      : "hover:border-cream-300 border-cream-200 bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-duas-soft font-display text-base font-bold text-duas shadow-inner">
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-sm font-bold text-night-900">
                          {child.name}
                        </h3>
                        <p className="truncate text-[11px] text-ink-soft">
                          {child.studentCode} • Class {child.class}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold-500/10 px-2 py-0.5 text-xs font-extrabold text-night-900">
                      <Trophy className="h-3 w-3 text-gold-600" />
                      <span>#{child.rank?.rank ?? "-"}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-b border-cream-100/70 py-2 text-xs">
                    <span className="truncate text-ink-soft">
                      Batch:{" "}
                      <strong className="text-night-900">
                        {child.batch?.name || "Unassigned"}
                      </strong>
                    </span>
                    <span className="shrink-0 font-extrabold text-night-900">
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
                            ? "font-extrabold text-gold-600"
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
                      className="inline-flex items-center gap-0.5 rounded-md bg-cream-100 px-2.5 py-1 text-xs font-bold text-night-900 transition-colors hover:bg-gold-500 hover:text-night-900"
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
      <Card className="space-y-6 border border-cream-200 p-6 shadow-soft">
        {/* Navigation Tabs & Controls */}
        <div className="flex flex-col gap-4 border-b border-cream-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab Switcher */}
          <div className="flex w-full rounded-xl bg-cream-100 p-1 text-xs font-bold text-night-900 sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 transition-all sm:flex-none ${
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
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 transition-all sm:flex-none ${
                activeTab === "final"
                  ? "bg-white font-extrabold text-night-900 shadow-sm"
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
                <span className="hidden text-xs font-semibold text-ink-soft sm:inline">
                  Batch:
                </span>
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
                    className={`rounded-md px-3 py-1 capitalize transition-all ${
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

        {/* TAB 1: LIVE LEADERBOARD VIEW */}
        {activeTab === "live" && (
          <div className="space-y-6">
            {loadingLive ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-16 text-center">
                <Spinner className="h-8 w-8 text-gold-500" />
                <p className="text-sm text-ink-soft">
                  Loading live leaderboard data...
                </p>
              </div>
            ) : liveError ? (
              <div className="rounded-xl border border-error/20 bg-error/5 p-4 py-12 text-center text-sm text-error">
                <AlertCircle className="mx-auto mb-2 h-8 w-8 text-error" />
                <p className="font-semibold">{liveError}</p>
              </div>
            ) : !liveData ||
              !liveData.entries ||
              liveData.entries.length === 0 ? (
              <div className="py-12 text-center text-sm text-ink-soft">
                No leaderboard entries found for this batch and period.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top 3 Podium (when entries available) */}
                {top3Live.length > 0 && (
                  <div className="grid gap-4 pt-2 sm:grid-cols-3">
                    {/* Rank 2 - Silver */}
                    {top3Live[1] && (
                      <div className="relative order-2 flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center shadow-sm sm:order-1">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-800">
                          #2
                        </div>
                        <h4 className="max-w-full truncate text-sm font-bold text-night-900">
                          {top3Live[1].name}
                        </h4>
                        {parentChildIds.has(top3Live[1].studentId) && (
                          <span className="mt-1 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
                            Your Child
                          </span>
                        )}
                        <p className="mt-2 text-lg font-extrabold text-night-900">
                          {top3Live[1].points}{" "}
                          <span className="text-xs font-normal text-ink-soft">
                            pts
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Rank 1 - Gold */}
                    {top3Live[0] && (
                      <div className="relative order-1 flex flex-col items-center overflow-hidden rounded-xl border-2 border-gold-500/40 bg-gold-500/10 p-5 text-center shadow-md sm:order-2">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-lg font-extrabold text-night-900 shadow">
                          #1
                        </div>
                        <h4 className="max-w-full truncate text-base font-extrabold text-night-900">
                          {top3Live[0].name}
                        </h4>
                        {parentChildIds.has(top3Live[0].studentId) && (
                          <span className="mt-1 rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-extrabold text-night-900 shadow-sm">
                            Your Child
                          </span>
                        )}
                        <p className="text-gold-700 mt-2 text-xl font-black">
                          {top3Live[0].points}{" "}
                          <span className="text-xs font-normal text-ink-soft">
                            pts
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Rank 3 - Bronze */}
                    {top3Live[2] && (
                      <div className="relative order-3 flex flex-col items-center overflow-hidden rounded-xl border border-amber-200 bg-amber-50/40 p-4 text-center shadow-sm">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800">
                          #3
                        </div>
                        <h4 className="max-w-full truncate text-sm font-bold text-night-900">
                          {top3Live[2].name}
                        </h4>
                        {parentChildIds.has(top3Live[2].studentId) && (
                          <span className="mt-1 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
                            Your Child
                          </span>
                        )}
                        <p className="mt-2 text-lg font-extrabold text-night-900">
                          {top3Live[2].points}{" "}
                          <span className="text-xs font-normal text-ink-soft">
                            pts
                          </span>
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
                        <th className="px-4 py-3 text-center">
                          On-Time Homework
                        </th>
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
                                {isChild && (
                                  <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
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
                    {new Date(finalData.finalizedAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
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
                                {isChild && (
                                  <span className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-extrabold text-night-900">
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
