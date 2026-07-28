import Link from "next/link";
import {
  AlertTriangle,
  Users,
  GraduationCap,
  Layers,
  Trophy,
  ArrowRight,
  UserRoundPlus,
  UserPlus,
} from "lucide-react";
import { getSession } from "@/lib/api/cookies";
import { getInstituteDashboardOverviewAction } from "@/actions/dashboard/institute-dashboard";
import { Card } from "@/components/ui";
import { ProgressGauges } from "@/components/dashboard/shared/ProgressGauges";

export default async function InstitutePage() {
  const session = await getSession();
  const res = await getInstituteDashboardOverviewAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/15 text-error">
            <AlertTriangle className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-bold text-night-900">
              Couldn&rsquo;t load your dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{res.error}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/institute"
              className="inline-flex min-h-[44px] items-center rounded-full bg-gold-500 px-6 font-display font-semibold text-night-900 transition-transform hover:scale-[1.02]"
            >
              Try again
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const { counts, progress } = res.data;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-night-900 md:text-3xl">
          Welcome back, {session?.label ?? "Institute Administrator"}.
        </h1>
        <p className="mt-1 text-ink-soft">
          Institution-wide overview, stats, and real-time student progress.
        </p>
      </header>

      {/* Main Stats Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/institute/students" className="block">
          <Card interactive className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-ink-soft">
                Total Students
              </p>
              <p className="text-2xl font-bold text-night-900">
                {counts.students}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-quran-soft text-quran">
              <Users className="h-5 w-5" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/institute/teachers" className="block">
          <Card interactive className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-ink-soft">
                Total Teachers
              </p>
              <p className="text-2xl font-bold text-night-900">
                {counts.teachers}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-arabic-soft text-arabic">
              <GraduationCap className="h-5 w-5" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/institute/batches" className="block">
          <Card interactive className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-ink-soft">Batches</p>
              <p className="text-2xl font-bold text-night-900">
                {counts.activeBatches}{" "}
                <span className="text-xs font-normal text-ink-soft">
                  Active / {counts.batches} Total
                </span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-duas-soft text-duas">
              <Layers className="h-5 w-5" />
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/leaderboard" className="block">
          <Card interactive className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-ink-soft">Leaderboard</p>
              <p className="text-sm font-bold text-night-900">
                View Rankings &rarr;
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600">
              <Trophy className="h-5 w-5" />
            </div>
          </Card>
        </Link>
      </section>

      {/* Progress Gauges */}
      <ProgressGauges
        progress={progress}
        title="Institution-Wide Average Progress"
      />

      {/* Quick Actions */}
      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-night-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/dashboard/institute/students/new" className="block">
            <Card interactive className="flex h-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500/20 text-gold-600">
                <UserRoundPlus className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-night-900">
                  Add Student
                </p>
                <p className="truncate text-xs text-ink-soft">
                  Enrol child and link parent
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft" />
            </Card>
          </Link>

          <Link href="/dashboard/institute/teachers/new" className="block">
            <Card interactive className="flex h-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-arabic-soft text-arabic">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-night-900">
                  Add Teacher
                </p>
                <p className="truncate text-xs text-ink-soft">
                  Create teacher account
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft" />
            </Card>
          </Link>

          <Link href="/dashboard/institute/batches/new" className="block">
            <Card interactive className="flex h-full items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-duas-soft text-duas">
                <Layers className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-night-900">
                  Create Batch
                </p>
                <p className="truncate text-xs text-ink-soft">
                  Group students under teacher
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft" />
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
