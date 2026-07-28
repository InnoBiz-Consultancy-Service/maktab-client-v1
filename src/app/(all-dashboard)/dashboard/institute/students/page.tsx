import Link from "next/link";
import { UserRoundPlus, Inbox, ArrowRight, Award } from "lucide-react";
import { Card } from "@/components/ui";
import { getInstituteDashboardStudentsAction } from "@/actions/dashboard/institute-dashboard";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    batchId?: string;
    class?: string;
    sortBy?: "name" | "class" | "createdAt" | "joinDate" | "rank";
    sortOrder?: "asc" | "desc";
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const res = await getInstituteDashboardStudentsAction({
    search: params.search,
    batchId: params.batchId,
    class: params.class,
    sortBy: params.sortBy || "rank",
    sortOrder: params.sortOrder || "asc",
    page: params.page ? parseInt(params.page, 10) : 1,
  });

  const students = res.ok ? res.data?.result || [] : [];
  const meta = res.ok ? res.data?.meta : null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-night-900">Students Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {meta ? `${meta.total} enrolled students` : "Enrolled students with progress & point totals."}
          </p>
        </div>
        <Link
          href="/dashboard/institute/students/new"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02]"
        >
          <UserRoundPlus className="h-4 w-4" aria-hidden />
          <span>Add student</span>
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        {students.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <Inbox className="h-8 w-8 text-cream-200" aria-hidden />
            <p className="text-sm text-ink-soft">No students found.</p>
            <Link
              href="/dashboard/institute/students/new"
              className="inline-flex min-h-[40px] items-center rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900"
            >
              Add student
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-cream-200">
            {students.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-sm font-bold text-quran">
                    {s.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/institute/students/${s.id}`}
                        className="truncate font-semibold text-night-900 hover:text-gold-600 hover:underline"
                      >
                        {s.name}
                      </Link>
                      <span className="shrink-0 rounded-full bg-cream-100 px-2 py-0.5 text-xs font-semibold text-night-900">
                        {s.studentCode}
                      </span>
                    </div>
                    <p className="truncate text-xs text-ink-soft">
                      {s.class} {s.parent?.name ? `· Parent: ${s.parent.name}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  {/* Progress Rates */}
                  <div className="flex items-center gap-3 text-xs text-ink-soft">
                    <span title="Lesson Completion Rate">
                      Lesson: <strong>{s.progress?.lessonCompletionRate ?? 0}%</strong>
                    </span>
                    <span>•</span>
                    <span title="Homework Submission Rate">
                      HW: <strong>{s.progress?.homeworkSubmissionRate ?? 0}%</strong>
                    </span>
                  </div>

                  {/* Points */}
                  <div className="flex items-center gap-1.5 rounded-full bg-gold-500/10 px-3 py-1 text-gold-700">
                    <Award className="h-3.5 w-3.5" />
                    <span className="font-bold text-xs">{s.points ?? 0} pts</span>
                  </div>

                  <Link
                    href={`/dashboard/institute/students/${s.id}`}
                    className="text-ink-soft hover:text-night-900"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
