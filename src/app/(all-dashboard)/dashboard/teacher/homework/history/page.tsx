import { getTeacherHomeworkHistory, getBatches } from "@/actions/homework";
import { Card, Button } from "@/components/ui";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Users,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatCalendarDate } from "@/lib/utils/date";

interface PageProps {
  searchParams: Promise<{
    batchId?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

export default async function HomeworkHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const batchId = params.batchId || "";
  const from = params.from || "";
  const to = params.to || "";
  const page = params.page ? parseInt(params.page, 10) : 1;

  const historyResult = await getTeacherHomeworkHistory({
    batchId: batchId || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: 10,
  });

  const batchesResult = await getBatches();

  const historyData = historyResult.ok ? historyResult.data : null;
  const batchesList = batchesResult.ok ? batchesResult.data : [];
  const meta = historyResult.ok ? (historyResult as any).meta : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/teacher/homework"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Homeworks</span>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-night-900">
            Timeline & History
          </h1>
          <p className="text-sm text-ink-soft">
            Review date-wise history and submission patterns across batches.
          </p>
        </div>
      </div>

      {/* Filters section */}
      <Card className="p-4 shadow-soft">
        <form method="GET" className="grid items-end gap-4 sm:grid-cols-4">
          {/* Batch filter */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-night-900 uppercase">
              Batch
            </label>
            <select
              name="batchId"
              defaultValue={batchId}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-ink transition-all outline-none focus:border-gold-500/50 focus:bg-white"
            >
              <option value="">All Batches</option>
              {batchesList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-night-900 uppercase">
              From Date
            </label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2 text-sm text-ink transition-all outline-none focus:border-gold-500/50 focus:bg-white"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-night-900 uppercase">
              To Date
            </label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2 text-sm text-ink transition-all outline-none focus:border-gold-500/50 focus:bg-white"
            />
          </div>

          {/* Filter Actions */}
          <div className="flex gap-2">
            <Button
              variant="night"
              type="submit"
              size="sm"
              className="flex-1 px-6"
            >
              Apply Filter
            </Button>
            {(batchId || from || to) && (
              <Link
                href="/dashboard/teacher/homework/history"
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-cream-200 bg-white px-4 py-2 font-display text-xs font-semibold text-night-900 transition-all hover:bg-cream-50"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </Card>

      {/* History Timeline */}
      {!historyData || historyData.days.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center shadow-soft">
          <BookOpen className="h-12 w-12 text-ink-soft/40" />
          <h3 className="mt-4 font-display text-lg font-bold text-night-900">
            No history found
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            There are no recorded homework events matching your filters in this
            range.
          </p>
        </Card>
      ) : (
        <div className="relative ml-4 space-y-8 border-l border-cream-200 pl-6">
          {(historyData.days || []).map((day) => (
            <div key={day.date} className="relative">
              {/* Timeline dot */}
              <div className="absolute top-1.5 -left-[31px] h-4.5 w-4.5 rounded-full border-4 border-white bg-gold-500 shadow-sm" />

              {/* Day Header */}
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-bold text-night-900">
                  {formatCalendarDate(day.date)}
                </h3>
                <span className="rounded border border-cream-200 bg-cream-50 px-2.5 py-1 text-xs font-semibold text-ink-soft">
                  {day.homeworkCount} Homework{day.homeworkCount > 1 ? "s" : ""}{" "}
                  • Average Rate: {day.submissionRate}%
                </span>
              </div>

              {/* Day's Homeworks list */}
              <div className="grid gap-4 sm:grid-cols-2">
                {(day.homeworks || []).map((hw) => (
                  <Card
                    key={hw.id}
                    className="flex flex-col justify-between border border-cream-200 p-4 shadow-soft transition-all hover:border-gold-500/50"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {hw.batch?.name && (
                          <span className="rounded bg-quran-soft px-2 py-0.5 text-[10px] font-bold tracking-wider text-quran uppercase">
                            {hw.batch.name}
                          </span>
                        )}
                      </div>
                      <h4 className="line-clamp-1 text-base font-bold text-night-900">
                        {hw.title || "Homework"}
                      </h4>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-cream-100 pt-3 text-xs text-ink-soft">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {hw.totalAssigned ?? 0}
                        </span>
                        <span className="flex items-center gap-1 text-success">
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          {hw.totalSubmitted ?? 0}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/teacher/homework/${hw.id}/submissions`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-gold-600 uppercase transition-colors hover:text-gold-500"
                      >
                        <span>View Roster</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
                pathname: "/dashboard/teacher/homework/history",
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
                pathname: "/dashboard/teacher/homework/history",
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
  );
}
