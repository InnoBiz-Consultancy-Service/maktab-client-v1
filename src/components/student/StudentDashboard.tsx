import Link from "next/link";
import { Play, ArrowRight, Target, Sparkles, Trophy } from "lucide-react";
import { Card } from "@/components/ui";
import { subjects } from "@/lib/dummy/student";
import type { StudentOverview } from "@/actions/student/overview";
import type { StudentOverviewResponse } from "@/types/shared/homework";
import { formatCalendarDate } from "@/lib/utils/date";
import { XpRing } from "./animation/XpRing";
import { StreakFlame } from "./animation/StreakFlame";
import { BadgeGrid } from "./BadgeGrid/BadgeGrid";

export function StudentDashboard({
  overview,
  homeworkOverview,
}: {
  overview: StudentOverview;
  homeworkOverview?: StudentOverviewResponse;
}) {
  const { profile, rank, badges, nextLesson, counts } = overview;
  const goalPct = Math.min(
    100,
    Math.round((profile.todayDone / profile.dailyGoal) * 100),
  );
  const goalMet = profile.todayDone >= profile.dailyGoal;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Hero — night sky, the "welcome to the game" moment */}
      <section className="relative mb-6 overflow-hidden rounded-lg bg-night-900 p-5 text-cream-50 sm:p-6">
        <Sparkles
          className="animate-twinkle absolute top-4 right-4 h-5 w-5 text-gold-300"
          aria-hidden
        />
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-cream-100/70">Assalamu alaikum</p>
            <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">
              {profile.name}
            </h1>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-sm font-semibold text-gold-300">
              {rank.current.title}
            </p>
          </div>
          <div className="shrink-0">
            <XpRing progress={rank.progress} xp={profile.xp} />
          </div>
        </div>

        {rank.next && (
          <p className="mt-4 text-sm text-cream-100/70">
            {rank.next.minXp - profile.xp} XP to reach{" "}
            <span className="font-semibold text-cream-50">
              {rank.next.title}
            </span>
          </p>
        )}
      </section>

      {/* Leaderboard & Standings Shortcut Card */}
      <Link href="/dashboard/leaderboard" className="group mb-6 block">
        <div className="relative overflow-hidden rounded-xl border border-gold-500/40 bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-cream-50/80 p-4 transition-all duration-300 hover:scale-[1.01] hover:border-gold-500 hover:shadow-[0_0_24px_rgba(245,184,51,0.25)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-night-900 shadow-md transition-transform group-hover:scale-110">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="group-hover:text-gold-700 font-display text-base font-bold text-night-900 transition-colors">
                    Leaderboard & Standings
                  </h2>
                  <span className="text-gold-800 inline-flex items-center gap-1 rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-extrabold">
                    <Sparkles className="h-3 w-3 text-gold-600" /> Live Rankings
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-soft">
                  View your class position, live points ranking & frozen final
                  batch standings.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-gold-500 px-3.5 py-2 text-xs font-extrabold text-night-900 shadow-sm transition-colors group-hover:bg-gold-400">
              <span>View Leaderboard</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Streak + daily goal */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display font-bold text-night-900">
              Your streak
            </h2>
            <StreakFlame days={profile.streak} />
          </div>
          <p className="text-sm text-ink-soft">
            {profile.streak > 0
              ? `Come back tomorrow to keep it going!`
              : `Finish a lesson today to start a streak.`}
          </p>
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-[18px] w-[18px] text-ink-soft" aria-hidden />
            <h2 className="font-display font-bold text-night-900">
              Today&rsquo;s goal
            </h2>
          </div>
          <p className="mb-2 font-display text-2xl font-bold text-night-900">
            {profile.todayDone}
            <span className="text-base font-medium text-ink-soft">
              {" "}
              / {profile.dailyGoal} lessons
            </span>
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
            <div
              className={`h-full rounded-full transition-all ${goalMet ? "bg-success" : "bg-gold-500"}`}
              style={{ width: `${goalPct}%` }}
            />
          </div>
          {goalMet && (
            <p className="mt-2 text-sm font-medium text-success">
              Goal complete — masha&rsquo;Allah!
            </p>
          )}
        </Card>
      </div>

      {/* Continue learning — the primary action */}
      {nextLesson && (
        <section className="mb-6">
          <h2 className="mb-3 font-display text-lg font-bold text-night-900">
            Continue learning
          </h2>
          <Link
            href={`/dashboard/student/learn/${nextLesson.id}`}
            className="block"
          >
            <Card interactive className={subjects[nextLesson.subject].soft}>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500 text-night-900 shadow-[0_0_24px_rgba(245,184,51,0.45)]">
                  <Play className="ml-1 h-6 w-6 fill-current" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${subjects[nextLesson.subject].accent}`}
                  >
                    {subjects[nextLesson.subject].label}
                  </p>
                  <p className="truncate font-display text-lg font-bold text-night-900">
                    {nextLesson.title}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {nextLesson.duration} min · +{nextLesson.xp} XP
                  </p>
                </div>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-night-900"
                  aria-hidden
                />
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Badges */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-night-900">
            Badges
          </h2>
          <span className="text-sm text-ink-soft">
            {counts.badgesEarned} of {badges.length}
          </span>
        </div>
        <Card>
          <BadgeGrid badges={badges} />
        </Card>
      </section>

      {/* Homework Overview Section */}
      {homeworkOverview && (
        <section className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-night-900">
              Homework Progress ({homeworkOverview.month || ""})
            </h2>
            <Link
              href="/dashboard/student/homework"
              className="text-xs font-bold text-gold-600 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="border border-cream-200 p-3.5 text-center shadow-sm">
              <span className="block text-[10px] font-semibold tracking-wider text-ink-soft uppercase">
                Assigned
              </span>
              <span className="mt-1 block text-xl font-bold text-night-900">
                {homeworkOverview.summary?.assigned ?? 0}
              </span>
            </Card>
            <Card className="border border-cream-200 p-3.5 text-center shadow-sm">
              <span className="block text-[10px] font-semibold tracking-wider text-ink-soft uppercase">
                Submitted
              </span>
              <span className="mt-1 block text-xl font-bold text-night-900">
                {homeworkOverview.summary?.submitted ?? 0}
              </span>
            </Card>
            <Card className="border border-cream-200 p-3.5 text-center shadow-sm">
              <span className="block text-[10px] font-semibold tracking-wider text-ink-soft uppercase">
                Submission Rate
              </span>
              <span className="mt-1 block text-xl font-bold text-quran">
                {homeworkOverview.summary?.submissionRate ?? 0}%
              </span>
            </Card>
            <Card className="border border-cream-200 p-3.5 text-center shadow-sm">
              <span className="block text-[10px] font-semibold tracking-wider text-ink-soft uppercase">
                Overdue
              </span>
              <span
                className={`mt-1 block text-xl font-bold ${(homeworkOverview.summary?.overdue ?? 0) > 0 ? "animate-pulse font-extrabold text-error" : "text-night-900"}`}
              >
                {homeworkOverview.summary?.overdue ?? 0}
              </span>
            </Card>
          </div>

          {/* Upcoming assignments */}
          {(homeworkOverview.upcoming || []).length > 0 && (
            <Card className="overflow-hidden border border-cream-200 p-0 shadow-sm">
              <div className="border-b border-cream-100 bg-cream-50/50 px-4 py-3">
                <h3 className="text-sm font-bold text-night-900">
                  Upcoming Homework Tasks
                </h3>
              </div>
              <ul className="divide-y divide-cream-100">
                {(homeworkOverview.upcoming || []).map((item) => (
                  <li
                    key={item.assignmentId}
                    className="transition-all hover:bg-cream-50/30"
                  >
                    <Link
                      href={`/dashboard/student/homework/${item.homework?.id}`}
                      className="flex items-center justify-between px-4 py-3.5 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-night-900">
                          {item.homework?.title || "Homework"}
                        </p>
                        <p className="mt-0.5 text-[10px] text-ink-soft">
                          Due: {formatCalendarDate(item.homework?.dueDate)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded bg-gold-500/10 px-2.5 py-1 text-[10px] font-bold text-gold-600">
                        {item.daysLeft} day{item.daysLeft !== 1 ? "s" : ""} left
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
