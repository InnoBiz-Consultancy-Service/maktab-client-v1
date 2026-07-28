import Link from "next/link";
import {
  Users,
  Layers,
  Trophy,
  BookOpen,
  FileText,
  CalendarCheck,
  ArrowRight,
  UserCheck,
  PlusCircle,
  Award,
} from "lucide-react";
import { getSession } from "@/lib/api/cookies";
import {
  getTeacherDashboardOverviewAction,
  getTeacherDashboardStudentsAction,
} from "@/actions/dashboard/teacher-dashboard";
import { Card } from "@/components/ui";
import { ProgressGauges } from "@/components/dashboard/shared/ProgressGauges";

export default async function TeacherPage() {
  const session = await getSession();

  const [overviewRes, studentsRes] = await Promise.all([
    getTeacherDashboardOverviewAction(),
    getTeacherDashboardStudentsAction({
      limit: 5,
      sortBy: "rank",
      sortOrder: "asc",
    }),
  ]);

  if (!overviewRes.ok) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {overviewRes.error}
        </Card>
      </div>
    );
  }

  const { counts, progress } = overviewRes.data;
  const recentStudents = studentsRes.ok ? studentsRes.data?.result || [] : [];

  const progressRates = {
    lessonCompletionRate: progress.lessonRate,
    homeworkSubmissionRate: progress.homeworkRate,
    attendanceRate: progress.attendanceRate,
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-night-900 md:text-3xl">
          Welcome back, {session?.label ?? "Ustadh"}.
        </h1>
        <p className="mt-1 text-ink-soft">
          Here is the overview for your assigned batches, student progress, and
          daily actions.
        </p>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-ink-soft">
              Assigned Batches
            </p>
            <p className="text-2xl font-bold text-night-900">
              {counts.batches}
            </p>
          </div>
        </Card>

        <Link href="/dashboard/teacher/students" className="block">
          <Card
            interactive
            className="flex h-full items-center justify-between p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-arabic-soft text-arabic">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-soft">My Students</p>
                <p className="text-2xl font-bold text-night-900">
                  {counts.students}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-soft" />
          </Card>
        </Link>

        <Link href="/dashboard/leaderboard?scope=batch" className="block">
          <Card
            interactive
            className="flex h-full items-center justify-between p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-quran-soft text-quran">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-soft">
                  Batch Leaderboard
                </p>
                <p className="text-sm font-bold text-night-900">
                  View Rankings &rarr;
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-soft" />
          </Card>
        </Link>
      </section>

      {/* Progress Gauges */}
      <ProgressGauges
        progress={progressRates}
        title="Teacher Batch Progress Summary"
      />

      {/* Quick Actions */}
      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-night-900">
          Teacher Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/teacher/attendance" className="block">
            <Card interactive className="flex h-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-quran-soft text-quran">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-night-900">
                  Attendance
                </p>
                <p className="truncate text-xs text-ink-soft">
                  Mark daily attendance
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/teacher/create-homework" className="block">
            <Card interactive className="flex h-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-arabic-soft text-arabic">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-night-900">
                  Assign Homework
                </p>
                <p className="truncate text-xs text-ink-soft">
                  Publish new assignment
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/teacher/create-lesson" className="block">
            <Card interactive className="flex h-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500/20 text-gold-600">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-night-900">
                  Create Lesson
                </p>
                <p className="truncate text-xs text-ink-soft">
                  Add video/quiz material
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/teacher/students" className="block">
            <Card interactive className="flex h-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-duas-soft text-duas">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-night-900">
                  Student Roster
                </p>
                <p className="truncate text-xs text-ink-soft">
                  View student records
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Top Students Preview */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-night-900">
            Top Performing Students
          </h2>
          <Link
            href="/dashboard/teacher/students"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline"
          >
            View all students <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Card className="overflow-hidden p-0">
          {recentStudents.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-soft">
              No student records loaded.
            </div>
          ) : (
            <ul className="divide-y divide-cream-200">
              {recentStudents.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-cream-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-arabic-soft font-display text-xs font-bold text-arabic">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <Link
                        href={`/dashboard/teacher/students/${s.id}`}
                        className="text-sm font-semibold text-night-900 hover:text-gold-600 hover:underline"
                      >
                        {s.name}
                      </Link>
                      <p className="text-xs text-ink-soft">{s.class}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-soft">
                      Lesson:{" "}
                      <strong>{s.progress?.lessonCompletionRate ?? 0}%</strong>
                    </span>
                    <div className="text-gold-700 flex items-center gap-1 rounded-full bg-gold-500/10 px-2.5 py-0.5 text-xs font-bold">
                      <Award className="h-3.5 w-3.5" />
                      <span>{s.points ?? 0} pts</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
