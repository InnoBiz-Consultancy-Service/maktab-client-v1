import { getStudentHomeworks } from "@/actions/homework";
import { Button, Card } from "@/components/ui";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import { BookOpen, Calendar, ChevronRight, Award } from "lucide-react";
import Link from "next/link";
import { formatCalendarDate } from "@/lib/utils/date";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    track?: string;
    page?: string;
  }>;
}

export default async function StudentHomeworkListPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const status = params.status || "";
  const track = params.track || "";
  const page = params.page ? parseInt(params.page, 10) : 1;

  const result = await getStudentHomeworks({
    status: status || undefined,
    track: track || undefined,
    page,
    limit: 10,
  });

  if (!result.ok) {
    const isSessionNotFound =
      result.error?.toLowerCase().includes("session not found") ||
      result.error?.toLowerCase().includes("not found");

    if (isSessionNotFound) {
      return (
        <div className="mx-auto mt-6 max-w-2xl">
          <Card className="flex flex-col items-center justify-center border border-cream-200 py-16 text-center shadow-soft">
            <BookOpen className="h-12 w-12 text-ink-soft/40" />
            <h3 className="mt-4 text-lg font-bold text-night-900">
              No homework assigned
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              You don't have any homework assigned to you right now. Take a
              break!
            </p>
          </Card>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load your homework assignments. {result.error}
        </Card>
      </div>
    );
  }

  const assignments = Array.isArray(result.data) ? result.data : [];
  const meta = (result as any).meta;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">
            My Homework
          </h1>
          <p className="text-sm text-ink-soft">
            View assignments, submit your work, and review grading feedback.
          </p>
        </div>
      </div>

      {/* Filters section */}
      <Card className="p-4 shadow-soft">
        <form method="GET" className="grid gap-4 sm:grid-cols-3">
          {/* Status filter */}
          <div>
            <select
              name="status"
              defaultValue={status}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-ink transition-all outline-none focus:border-gold-500/50 focus:bg-white"
            >
              <option value="">All Statuses</option>
              <option value="NOT_SUBMITTED">Not Submitted</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="GRADED">Graded</option>
            </select>
          </div>

          {/* Track filter */}
          <div className="col-span-2 flex gap-2">
            <select
              name="track"
              defaultValue={track}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-ink transition-all outline-none focus:border-gold-500/50 focus:bg-white"
            >
              <option value="">All Tracks</option>
              <option value="NOT_SUBMITTED">Not Submitted</option>
              <option value="ON_TIME">On Time</option>
            </select>
            <Button variant="night" type="submit" size="sm" className="px-5">
              Filter
            </Button>
            {(status || track) && (
              <Link
                href="/dashboard/student/homework"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-cream-200 bg-white px-4 py-2 font-display text-xs font-semibold text-night-900 transition-all hover:bg-cream-50"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </Card>

      {assignments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center shadow-soft">
          <BookOpen className="h-12 w-12 text-ink-soft/40" />
          <h3 className="mt-4 text-lg font-bold text-night-900">
            {status || track
              ? "Nothing matches this filter"
              : "No homework yet"}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {status || track
              ? "Try resetting the filters to view all assignments."
              : "You don't have any homework assigned to you right now. Take a break!"}
          </p>
        </Card>
      ) : (
        <div className="grid max-w-4xl gap-4">
          {assignments.map((asg) => {
            const hw = asg?.homework;
            const batchName = hw?.batch?.name;
            const href = hw?.id ? `/dashboard/student/homework/${hw.id}` : "#";

            return (
              <Link
                key={asg?.assignmentId || hw?.id}
                href={href}
                className="group block"
              >
                <Card className="flex flex-col justify-between gap-4 border border-cream-200 p-5 shadow-soft transition-all group-hover:border-gold-500/50 sm:flex-row sm:items-center">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {batchName && (
                        <span className="rounded bg-quran-soft px-2 py-0.5 text-xs font-semibold text-quran">
                          {batchName}
                        </span>
                      )}
                      <StatusChip chip={asg?.chip} />
                    </div>
                    <h3 className="text-lg font-bold text-night-900 transition-colors group-hover:text-gold-600">
                      {hw?.title || "Homework"}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-ink-soft">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Due:{" "}
                        {hw?.dueDate ? formatCalendarDate(hw.dueDate) : "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />{" "}
                        {hw?.maxScore !== null && hw?.maxScore !== undefined
                          ? `Score: ${hw.maxScore} max`
                          : "Ungraded / Completion"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    {asg?.status === "GRADED" &&
                      hw?.maxScore !== null &&
                      hw?.maxScore !== undefined && (
                        <div className="text-right">
                          <span className="block text-xs text-ink-soft">
                            Grade
                          </span>
                          <span className="text-base font-extrabold text-success">
                            {asg?.score} / {hw.maxScore}
                          </span>
                        </div>
                      )}
                    <ChevronRight className="h-5 w-5 text-ink-soft transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-cream-200 pt-4">
              <p className="text-xs text-ink-soft">
                Showing Page{" "}
                <strong className="text-night-900">{meta.page}</strong> of{" "}
                <strong className="text-night-900">{meta.totalPages}</strong> (
                {meta.total} total items)
              </p>
              <div className="flex gap-2">
                <Link
                  href={{
                    pathname: "/dashboard/student/homework",
                    query: { ...params, page: Math.max(1, meta.page - 1) },
                  }}
                  className={`inline-flex items-center justify-center rounded-full border border-cream-200 bg-white px-4 py-2 font-display text-xs font-semibold text-night-900 transition-all hover:bg-cream-50 ${
                    meta.page <= 1 ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  Previous
                </Link>
                <Link
                  href={{
                    pathname: "/dashboard/student/homework",
                    query: {
                      ...params,
                      page: Math.min(meta.totalPages, meta.page + 1),
                    },
                  }}
                  className={`inline-flex items-center justify-center rounded-full border border-cream-200 bg-white px-4 py-2 font-display text-xs font-semibold text-night-900 transition-all hover:bg-cream-50 ${
                    meta.page >= meta.totalPages
                      ? "pointer-events-none opacity-40"
                      : ""
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
