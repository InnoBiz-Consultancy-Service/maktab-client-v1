import Link from "next/link";
import { Play, ArrowRight, Target, Sparkles } from "lucide-react";
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
          className="absolute right-4 top-4 h-5 w-5 animate-twinkle text-gold-300"
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
            <h2 className="font-display text-lg font-bold text-night-900">Homework Progress ({homeworkOverview.month})</h2>
            <Link href="/dashboard/student/homework" className="text-xs font-bold text-gold-600 hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="p-3.5 border border-cream-200 text-center shadow-sm">
              <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Assigned</span>
              <span className="text-xl font-bold text-night-900 block mt-1">{homeworkOverview.summary.assigned}</span>
            </Card>
            <Card className="p-3.5 border border-cream-200 text-center shadow-sm">
              <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Submitted</span>
              <span className="text-xl font-bold text-night-900 block mt-1">{homeworkOverview.summary.submitted}</span>
            </Card>
            <Card className="p-3.5 border border-cream-200 text-center shadow-sm">
              <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Submission Rate</span>
              <span className="text-xl font-bold text-quran block mt-1">{homeworkOverview.summary.submissionRate}%</span>
            </Card>
            <Card className="p-3.5 border border-cream-200 text-center shadow-sm">
              <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Overdue</span>
              <span className={`text-xl font-bold block mt-1 ${homeworkOverview.summary.overdue > 0 ? 'text-error animate-pulse font-extrabold' : 'text-night-900'}`}>
                {homeworkOverview.summary.overdue}
              </span>
            </Card>
          </div>

          {/* Upcoming assignments */}
          {homeworkOverview.upcoming.length > 0 && (
            <Card className="p-0 border border-cream-200 overflow-hidden shadow-sm">
              <div className="border-b border-cream-100 bg-cream-50/50 px-4 py-3">
                <h3 className="text-sm font-bold text-night-900">Upcoming Homework Tasks</h3>
              </div>
              <ul className="divide-y divide-cream-100">
                {homeworkOverview.upcoming.map((item) => (
                  <li key={item.assignmentId} className="hover:bg-cream-50/30 transition-all">
                    <Link href={`/dashboard/student/homework/${item.homework.id}`} className="flex items-center justify-between px-4 py-3.5 text-xs">
                      <div>
                        <p className="font-semibold text-night-900">{item.homework.title}</p>
                        <p className="text-[10px] text-ink-soft mt-0.5">Due: {formatCalendarDate(item.homework.dueDate)}</p>
                      </div>
                      <span className="shrink-0 bg-gold-500/10 text-gold-600 font-bold px-2.5 py-1 rounded text-[10px]">
                        {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''} left
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
