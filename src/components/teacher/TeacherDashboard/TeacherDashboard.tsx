import Link from "next/link";
import {
  Baby,
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  ArrowRight,
  Clock,
  Check,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui";
import type { TeacherOverview } from "@/actions/teacher/overview";
import type { TeacherOverviewResponse } from "@/types/shared/homework";
import { PreviewBanner } from "../PreviewBanner/PreviewBanner";
import { StatCard } from "@/components/institute/dashboard/StatCard";

export function TeacherDashboard({
  name,
  overview,
  homeworkOverview,
}: {
  name: string;
  overview: TeacherOverview;
  homeworkOverview?: TeacherOverviewResponse;
}) {
  const { counts, todayBatches, recentMarks, exams } = overview;
  const scheduledExams = exams.filter((e) => e.status === "scheduled");

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900 md:text-3xl">
          Assalamu alaikum, {name}.
        </h1>
        <p className="mt-1 text-ink-soft">Here&rsquo;s your day at a glance.</p>
      </header>

      {/* <PreviewBanner what="The teacher area" /> */}

      {/* Stats */}
      <section
        aria-label="Overview"
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="My students"
          value={counts.students}
          icon={Baby}
          tone="bg-quran-soft text-quran"
          href="/dashboard/teacher/students"
        />
        <StatCard
          label="Attendance to take"
          value={counts.attendancePending}
          icon={CalendarCheck}
          tone="bg-gold-500/20 text-gold-600"
          href="/dashboard/teacher/attendance"
          note={
            counts.attendancePending > 0
              ? "Sessions still pending"
              : "All done today"
          }
        />
        <StatCard
          label="Class average"
          value={`${counts.classAverage}%`}
          icon={TrendingUp}
          tone="bg-arabic-soft text-arabic"
          href="/dashboard/teacher/marks"
        />
      </section>

      {/* Today's batches — the main call to action */}
      <section aria-label="Today" className="mb-6">
        <h2 className="mb-3 font-display text-lg font-bold text-night-900">
          Today&rsquo;s batches
        </h2>
        <Card className="p-0">
          <ul className="divide-y divide-cream-200">
            {todayBatches.map((b) => (
              <li
                key={b.batch.id}
                className="flex items-center gap-3 px-5 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-100 text-ink-soft">
                  <Clock className="h-4.5 w-4.5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-night-900">
                    {b.batch.name}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {b.totalStudents} students
                    {b.state === "IN_PROGRESS" && b.progress
                      ? ` · ${b.progress.marked}/${b.progress.total} marked`
                      : ""}
                    {b.state === "OFF_DAY" && b.reason ? ` · ${b.reason}` : ""}
                  </p>
                </div>

                {b.state === "DONE" ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    Taken
                  </span>
                ) : b.state === "OFF_DAY" ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-ink-soft">
                    Off day
                  </span>
                ) : b.state === "IN_PROGRESS" && b.canEdit === false ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-ink-soft">
                    {b.takenBy?.name} is taking it
                  </span>
                ) : (
                  <Link
                    href="/dashboard/teacher/attendance"
                    className="inline-flex min-h-9.5 shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-4 text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    {b.state === "IN_PROGRESS" ? "Continue" : "Take"}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent marks */}
        <section aria-label="Recent marks">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-night-900">
              Recent marks
            </h2>
            <Link
              href="/dashboard/teacher/marks"
              className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <Card className="p-0">
            <ul className="divide-y divide-cream-200">
              {recentMarks.slice(0, 4).map((m) => {
                const pct = Math.round((m.score / m.outOf) * 100);
                return (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-arabic-soft text-arabic">
                      <ClipboardList className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-night-900">
                        {m.studentName}
                      </p>
                      <p className="truncate text-xs text-ink-soft">
                        {m.title} · {m.date}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 font-display text-sm font-bold ${
                        pct >= 70
                          ? "text-success"
                          : pct >= 50
                            ? "text-warn"
                            : "text-error"
                      }`}
                    >
                      {m.score}/{m.outOf}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>

        {/* Upcoming exams */}
        <section aria-label="Upcoming exams">
          <h2 className="mb-3 font-display text-lg font-bold text-night-900">
            Upcoming exams
          </h2>
          <Card className="p-0">
            {scheduledExams.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <AlertCircle className="h-7 w-7 text-cream-200" aria-hidden />
                <p className="text-sm text-ink-soft">Nothing scheduled.</p>
              </div>
            ) : (
              <ul className="divide-y divide-cream-200">
                {scheduledExams.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-night-900">
                        {e.title}
                      </p>
                      <p className="truncate text-xs text-ink-soft">
                        {e.class} · {e.studentCount} students
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold-500/20 px-2.5 py-1 text-xs font-semibold text-gold-600">
                      {e.date}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      {/* Homework Overview Section */}
      {homeworkOverview && (
        <section aria-label="Homework Insights" className="mt-8 space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-2">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-bold text-night-900">
              <Calendar className="h-5 w-5 text-gold-500" />
              <span>Homework Insights ({homeworkOverview.month})</span>
            </h2>
            <Link
              href="/dashboard/teacher/homework"
              className="text-xs font-bold text-gold-600 hover:underline"
            >
              Manage Homeworks &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="flex flex-col justify-between border border-cream-200 p-4 shadow-sm">
              <span className="block text-xs font-medium text-ink-soft">
                Total Homeworks
              </span>
              <span className="mt-1 text-2xl font-bold text-night-900">
                {homeworkOverview.summary.totalHomeworks}
              </span>
              <span className="mt-1 block text-[10px] text-ink-soft">
                ({homeworkOverview.summary.publishedHomeworks} published,{" "}
                {homeworkOverview.summary.draftHomeworks} drafts)
              </span>
            </Card>
            <Card className="flex flex-col justify-between border border-cream-200 p-4 shadow-sm">
              <span className="block text-xs font-medium text-ink-soft">
                Assigned Rows
              </span>
              <span className="mt-1 text-2xl font-bold text-night-900">
                {homeworkOverview.summary.totalAssigned}
              </span>
              <span className="mt-1 block text-[10px] text-ink-soft">
                Total active student records
              </span>
            </Card>
            <Card className="flex flex-col justify-between border border-cream-200 p-4 shadow-sm">
              <span className="block text-xs font-medium text-ink-soft">
                Submission Rate
              </span>
              <span className="mt-1 text-2xl font-bold text-quran">
                {homeworkOverview.summary.submissionRate}%
              </span>
              <span className="mt-1 block text-[10px] text-ink-soft">
                ({homeworkOverview.summary.totalSubmitted} submitted)
              </span>
            </Card>
            <Card className="flex flex-col justify-between border border-cream-200 p-4 shadow-sm">
              <span className="block text-xs font-medium text-ink-soft">
                Punctuality Rate
              </span>
              <span className="mt-1 text-2xl font-bold text-arabic">
                {homeworkOverview.summary.punctualityRate}%
              </span>
              <span className="mt-1 block text-[10px] text-ink-soft">
                ({homeworkOverview.summary.totalLate} late submissions)
              </span>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Top Students */}
            <Card className="overflow-hidden border border-cream-200 p-0 shadow-sm">
              <div className="flex items-center justify-between border-b border-cream-100 bg-cream-50/50 px-4 py-3">
                <h3 className="text-sm font-bold text-night-900">
                  Top Students
                </h3>
                <span className="rounded bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success uppercase">
                  High Submission Rate
                </span>
              </div>
              {homeworkOverview.topStudents.length === 0 ? (
                <div className="p-6 text-center text-xs text-ink-soft">
                  Everyone is doing great!
                </div>
              ) : (
                <ul className="divide-y divide-cream-100">
                  {homeworkOverview.topStudents.map((item) => (
                    <li
                      key={item.student.id}
                      className="flex items-center justify-between px-4 py-3.5 text-xs transition-all hover:bg-cream-50/30"
                    >
                      <div>
                        <p className="font-semibold text-night-900">
                          {item.student.name}
                        </p>
                        <p className="text-[10px] text-ink-soft">
                          {item.student.studentCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">
                          {item.submissionRate}% Submissions
                        </p>
                        <p className="text-[9px] text-ink-soft">
                          {item.submitted}/{item.assigned} completed
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Needs Attention */}
            <Card className="overflow-hidden border border-cream-200 p-0 shadow-sm">
              <div className="flex items-center justify-between border-b border-cream-100 bg-cream-50/50 px-4 py-3">
                <h3 className="text-sm font-bold text-night-900">
                  Needs Attention
                </h3>
                <span className="rounded bg-error/15 px-2 py-0.5 text-[10px] font-bold text-error uppercase">
                  Missing Homeworks
                </span>
              </div>
              {homeworkOverview.needsAttention.length === 0 ? (
                <div className="p-6 text-center text-xs text-ink-soft">
                  Nobody needs attention right now!
                </div>
              ) : (
                <ul className="divide-y divide-cream-100">
                  {homeworkOverview.needsAttention.map((item) => (
                    <li
                      key={item.student.id}
                      className="flex items-center justify-between px-4 py-3.5 text-xs transition-all hover:bg-cream-50/30"
                    >
                      <div>
                        <p className="font-semibold text-night-900">
                          {item.student.name}
                        </p>
                        <p className="text-[10px] text-ink-soft">
                          {item.student.studentCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-error">
                          {item.notSubmitted} Missing
                        </p>
                        <p className="text-[9px] text-ink-soft">
                          {item.submitted}/{item.assigned} completed
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
