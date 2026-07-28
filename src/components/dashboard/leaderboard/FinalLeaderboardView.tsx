"use client";

import { Award, Lock, ShieldCheck, Trophy } from "lucide-react";
import { Card } from "@/components/ui";
import type { FinalLeaderboardData } from "@/types/dashboard";

interface FinalLeaderboardViewProps {
  data: FinalLeaderboardData;
  batchName?: string;
}

export function FinalLeaderboardView({
  data,
  batchName,
}: FinalLeaderboardViewProps) {
  const formattedDate = data.finalizedAt
    ? new Date(data.finalizedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Completed";

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-700">
              <Lock className="h-3 w-3" /> Permanent Snapshot
            </span>
            {batchName && (
              <span className="text-sm font-medium text-ink-soft">
                {batchName}
              </span>
            )}
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-night-900">
            Final Leaderboard Standings
          </h2>
          <p className="text-xs text-ink-soft">
            Frozen on {formattedDate} — {data.entries.length} students ranked
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600">
          <Trophy className="h-6 w-6" />
        </div>
      </div>

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
            {data.entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No final leaderboard records found.
                </td>
              </tr>
            ) : (
              data.entries.map((entry) => {
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;

                return (
                  <tr
                    key={entry.studentId}
                    className={`transition-colors hover:bg-cream-50 ${
                      isTop1 ? "bg-amber-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-bold">
                      <div className="flex items-center gap-1.5">
                        {isTop1 && <Trophy className="h-4 w-4 text-gold-500" />}
                        {isTop2 && <Award className="h-4 w-4 text-slate-400" />}
                        {isTop3 && <Award className="h-4 w-4 text-amber-700" />}
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                            isTop1
                              ? "bg-gold-500 text-night-900"
                              : isTop2
                              ? "bg-slate-200 text-slate-800"
                              : isTop3
                              ? "bg-amber-100 text-amber-800"
                              : "bg-cream-100 text-ink-soft"
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-night-900">{entry.name}</p>
                        <p className="text-xs text-ink-soft">{entry.studentCode}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="font-bold text-night-900">
                        {entry.totalPoints} pts
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap text-ink-soft">
                      {entry.lessonCount}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap text-ink-soft">
                      {entry.homeworkOnTime}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap text-ink-soft">
                      {entry.attendanceCount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
