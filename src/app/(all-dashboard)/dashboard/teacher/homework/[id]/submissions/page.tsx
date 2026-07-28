import { getHomeworkSubmissions } from "@/actions/homework";
import { Button, Card } from "@/components/ui";
import { ArrowLeft, Calendar, ClipboardList, BookOpen } from "lucide-react";
import Link from "next/link";
import { SubmissionsRosterTable } from "@/components/teacher/homework/SubmissionsRosterTable";
import { formatCalendarDate } from "@/lib/utils/date";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    status?: string;
    track?: string;
    page?: string;
  }>;
}

export default async function SubmissionsRosterPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const filterParams = await searchParams;
  const status = filterParams.status || "";
  const track = filterParams.track || "";
  const page = filterParams.page ? parseInt(filterParams.page, 10) : 1;

  const result = await getHomeworkSubmissions(id, {
    status: status || undefined,
    track: track || undefined,
    page,
    limit: 50,
  });

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          href="/dashboard/teacher/homework"
          className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Homework</span>
        </Link>
        <Card className="py-12 text-center">
          <ClipboardList className="mx-auto mb-3 h-10 w-10 text-ink-soft/30" />
          <h3 className="mb-1 font-display font-semibold text-night-900">
            Submissions Unavailable
          </h3>
          <p className="mx-auto max-w-sm text-sm text-ink-soft">
            The submissions roster for this homework could not be loaded. This
            feature may not be available yet.
          </p>
        </Card>
      </div>
    );
  }

  const { homework, summary, results = [] } = result.data || {};
  const meta = (result as any).meta;
  const safeResults = results || [];

  // Percentage calculations with fallback computation from safeResults
  const totalAssigned =
    summary?.totalAssigned && summary.totalAssigned > 0
      ? summary.totalAssigned
      : safeResults.length;
  const submitted =
    summary?.submitted ??
    safeResults.filter(
      (r: any) =>
        r.submissionId || r.status === "SUBMITTED" || r.status === "GRADED",
    ).length;
  const graded =
    summary?.graded ??
    safeResults.filter((r: any) => r.status === "GRADED").length;
  const late =
    summary?.late ??
    safeResults.filter(
      (r: any) => r.chip === "SUBMITTED_LATE" || r.chip === "GRADED_LATE",
    ).length;
  const notSubmitted = summary?.notSubmitted ?? totalAssigned - submitted;
  const submissionRate =
    totalAssigned > 0 ? Math.round((submitted / totalAssigned) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/teacher/homework"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-night-900">
            Submission Roster
          </h1>
          <p className="text-sm text-ink-soft">
            Grade work and monitor progress for this homework assignment.
          </p>
        </div>
      </div>

      {/* Homework Info & Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Homework Info */}
        <Card className="space-y-3 border border-cream-200 p-6 shadow-soft md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="rounded bg-quran-soft px-2 py-0.5 text-xs font-semibold text-quran">
              Active Homework Detail
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-ink-soft">
              <Calendar className="h-3.5 w-3.5" />
              Due:{" "}
              {homework?.dueDate ? formatCalendarDate(homework.dueDate) : "—"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-night-900">
            {homework?.title || "Homework"}
          </h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {homework?.instruction || ""}
          </p>
        </Card>

        {/* Progress Chart */}
        <Card className="flex flex-col justify-between border border-cream-200 p-6 shadow-soft">
          <div>
            <h3 className="mb-2 text-sm font-bold text-night-900">
              Submission Progress
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-quran">
                {submissionRate}%
              </span>
              <span className="text-xs text-ink-soft">
                ({submitted}/{totalAssigned} submitted)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-2.5 rounded-full bg-quran transition-all duration-500"
                style={{ width: `${submissionRate}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-cream-100 pt-3 text-center text-xs">
            <div>
              <span className="block text-sm font-bold text-success">
                {graded}
              </span>
              <span className="text-[10px] text-ink-soft">Graded</span>
            </div>
            <div>
              <span className="block text-sm font-bold text-warn">{late}</span>
              <span className="text-[10px] text-ink-soft">Late</span>
            </div>
            <div>
              <span className="block text-sm font-bold text-ink-soft">
                {notSubmitted}
              </span>
              <span className="text-[10px] text-ink-soft">Pending</span>
            </div>
          </div>
        </Card>
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
                href={`/dashboard/teacher/homework/${id}/submissions`}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-cream-200 bg-white px-4 py-2 font-display text-xs font-semibold text-night-900 transition-all hover:bg-cream-50"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </Card>

      {/* Roster & Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <ClipboardList className="h-5 w-5 text-quran" />
          <h3 className="font-display font-bold text-night-900">
            Submissions Checklist
          </h3>
        </div>

        {!(results && results.length > 0) ? (
          <Card className="flex flex-col items-center justify-center border border-cream-200 py-16 text-center shadow-soft">
            <BookOpen className="h-12 w-12 text-ink-soft/40" />
            <h3 className="mt-4 text-lg font-bold text-night-900">
              {status || track
                ? "Nothing matches this filter"
                : "No homework yet"}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {status || track
                ? "Try resetting the filters or modifying your search query."
                : "No students have been assigned or submitted work for this assignment yet."}
            </p>
          </Card>
        ) : (
          <SubmissionsRosterTable
            homeworkId={id}
            homework={homework}
            results={results}
          />
        )}
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-cream-200 pt-4">
          <p className="text-xs text-ink-soft">
            Showing Page <strong className="text-night-900">{meta.page}</strong>{" "}
            of <strong className="text-night-900">{meta.totalPages}</strong> (
            {meta.total} total items)
          </p>
          <div className="flex gap-2">
            <Link
              href={{
                pathname: `/dashboard/teacher/homework/${id}/submissions`,
                query: { ...filterParams, page: Math.max(1, meta.page - 1) },
              }}
              className={`inline-flex items-center justify-center rounded-full border border-cream-200 bg-white px-4 py-2 font-display text-xs font-semibold text-night-900 transition-all hover:bg-cream-50 ${
                meta.page <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Previous
            </Link>
            <Link
              href={{
                pathname: `/dashboard/teacher/homework/${id}/submissions`,
                query: {
                  ...filterParams,
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
  );
}
