import Link from "next/link";
import { Users, Award, Trophy, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { getParentChildrenDashboardAction } from "@/actions/dashboard/parent-dashboard";
import { ProgressGauges } from "@/components/dashboard/shared/ProgressGauges";

export default async function ParentChildrenDashboardPage() {
  const res = await getParentChildrenDashboardAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const children = res.data || [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-night-900">
          My Children Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Overview of all your enrolled children, progress, points, and
          standings.
        </p>
      </header>

      {children.length === 0 ? (
        <Card className="py-12 text-center text-ink-soft">
          No children linked to your parent account.
        </Card>
      ) : (
        <div className="space-y-6">
          {children.map((child) => {
            const progressRates = {
              lessonCompletionRate: child.progress?.lessonRate ?? 0,
              homeworkSubmissionRate: child.progress?.homeworkRate ?? 0,
              attendanceRate: child.progress?.attendanceRate ?? 0,
            };

            return (
              <Card key={child.id} className="space-y-5 p-6">
                <div className="flex flex-col justify-between gap-4 border-b border-cream-200 pb-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-duas-soft font-display text-xl font-bold text-duas">
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-xl font-bold text-night-900">
                          {child.name}
                        </h2>
                        <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-night-900">
                          {child.studentCode}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {child.class} • Batch:{" "}
                        {child.batch?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Points & Rank */}
                    <div className="flex items-center gap-2 rounded-xl bg-gold-500/10 px-4 py-2">
                      <Trophy className="h-5 w-5 text-gold-600" />
                      <div>
                        <p className="text-[10px] font-medium text-ink-soft">
                          Rank #{child.rank?.rank ?? "-"}
                        </p>
                        <p className="font-display text-sm font-bold text-night-900">
                          {child.points} pts
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/parent/children/${child.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-gold-500 px-4 py-2 text-xs font-bold text-night-900 transition-transform hover:scale-105"
                    >
                      Full Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <ProgressGauges
                  progress={progressRates}
                  title={`${child.name}'s Progress`}
                />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
