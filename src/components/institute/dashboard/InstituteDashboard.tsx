import Link from "next/link";
import {
  GraduationCap,
  Users,
  Baby,
  UserPlus,
  UserRoundPlus,
  ArrowRight,
  Inbox,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui";

import type { InstituteOverview } from "@/actions/institute/overview";
import { StatCard } from "./StatCard";
import { AttendancePanel } from "./AttendancePanel";
import {
  dummyActivity,
  dummyAttendanceToday,
  dummyClasses,
} from "@/lib/dummy/instititue";
import { ActivityPanel } from "./ActivityPanel";

function EmptyPanel({
  message,
  cta,
}: {
  message: string;
  cta: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <Inbox className="h-8 w-8 text-cream-200" aria-hidden />
      <p className="text-sm text-ink-soft">{message}</p>
      {cta}
    </div>
  );
}

const goldPill =
  "inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95";

export function InstituteDashboard({
  name,
  overview,
}: {
  name: string;
  overview: InstituteOverview;
}) {
  const { counts, recentTeachers, recentStudents } = overview;

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Greeting */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900 md:text-3xl">
          Welcome back, {name}.
        </h1>
        <p className="mt-1 text-ink-soft">
          Here&rsquo;s how your maktab is doing today.
        </p>
      </header>

      {/* Stats — REAL data */}
      <section
        aria-label="Overview"
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Students"
          value={counts.students}
          icon={Baby}
          tone="bg-quran-soft text-quran"
          href="/dashboard/institute/students"
        />
        <StatCard
          label="Teachers"
          value={counts.teachers}
          icon={GraduationCap}
          tone="bg-arabic-soft text-arabic"
          href="/dashboard/institute/teachers"
        />
        <StatCard
          label="Parents"
          value={counts.parents}
          icon={Users}
          tone="bg-duas-soft text-duas"
          href="/dashboard/institute/parents"
        />
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions" className="mb-6">
        <h2 className="mb-3 font-display text-lg font-bold text-night-900">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/dashboard/institute/students/new" className="block">
            <Card interactive className="h-full">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold-500/20 text-gold-600">
                  <UserRoundPlus className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-night-900">Add a student</p>
                  <p className="truncate text-sm text-ink-soft">
                    Enrol a child and link a parent.
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-ink-soft"
                  aria-hidden
                />
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/institute/teachers/new" className="block">
            <Card interactive className="h-full">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-arabic-soft text-arabic">
                  <UserPlus className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-night-900">Add a teacher</p>
                  <p className="truncate text-sm text-ink-soft">
                    Create a teacher account.
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-ink-soft"
                  aria-hidden
                />
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Attendance + Classes — DUMMY (backend in progress) */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AttendancePanel data={dummyAttendanceToday} />

        <Card className="p-0">
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen
                className="h-4.5 w-4.5 text-ink-soft"
                aria-hidden
              />
              <h2 className="font-display font-bold text-night-900">Classes</h2>
            </div>
            <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-soft">
              Preview
            </span>
          </div>
          <ul className="divide-y divide-cream-200">
            {dummyClasses.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-night-900">
                    {c.name}
                  </p>
                  <p className="truncate text-sm text-ink-soft">{c.teacher}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-night-900">
                  {c.students}
                  <span className="ml-1 font-normal text-ink-soft">
                    students
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recent students + teachers — REAL data */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section aria-label="Recent students">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-night-900">
              Recent students
            </h2>
            {recentStudents.length > 0 && (
              <Link
                href="/dashboard/institute/students"
                className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:underline"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </div>
          <Card className="p-0">
            {recentStudents.length === 0 ? (
              <EmptyPanel
                message="No students yet."
                cta={
                  <Link
                    href="/dashboard/institute/students/new"
                    className={goldPill}
                  >
                    Add the first student
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-cream-200">
                {recentStudents.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-night-900">
                        {s.name}
                      </p>
                      <p className="truncate text-sm text-ink-soft">
                        {s.class} · {s.parentName}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-cream-100 px-2.5 py-1 font-display text-sm font-semibold tracking-wide text-night-900">
                      {s.studentCode}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <section aria-label="Recent teachers">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-night-900">
              Recent teachers
            </h2>
            {recentTeachers.length > 0 && (
              <Link
                href="/dashboard/institute/teachers"
                className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:underline"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </div>
          <Card className="p-0">
            {recentTeachers.length === 0 ? (
              <EmptyPanel
                message="No teachers yet."
                cta={
                  <Link
                    href="/dashboard/institute/teachers/new"
                    className={goldPill}
                  >
                    Add the first teacher
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-cream-200">
                {recentTeachers.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-arabic-soft font-display text-sm font-bold text-arabic">
                      {t.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-night-900">
                        {t.name}
                      </p>
                      <p className="truncate text-sm text-ink-soft">
                        {t.user?.email ?? t.phone}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>

      {/* Activity — DUMMY */}
      <section aria-label="Recent activity">
        <ActivityPanel entries={dummyActivity} />
      </section>
    </div>
  );
}
