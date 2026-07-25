import { getTeacherHomeworkHistory, getBatches } from "@/actions/homework";
import { Card, Button } from "@/components/ui";
import { ArrowLeft, Calendar, BookOpen, Users, ClipboardCheck, ArrowRight } from "lucide-react";
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
          <h1 className="text-2xl font-bold text-night-900 font-display">Timeline & History</h1>
          <p className="text-sm text-ink-soft">Review date-wise history and submission patterns across batches.</p>
        </div>
      </div>

      {/* Filters section */}
      <Card className="p-4 shadow-soft">
        <form method="GET" className="grid gap-4 sm:grid-cols-4 items-end">
          {/* Batch filter */}
          <div>
            <label className="block text-xs font-bold text-night-900 uppercase tracking-wider mb-2">Batch</label>
            <select
              name="batchId"
              defaultValue={batchId}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-gold-500/50 focus:bg-white"
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
            <label className="block text-xs font-bold text-night-900 uppercase tracking-wider mb-2">From Date</label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2 text-sm text-ink outline-none transition-all focus:border-gold-500/50 focus:bg-white"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-bold text-night-900 uppercase tracking-wider mb-2">To Date</label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2 text-sm text-ink outline-none transition-all focus:border-gold-500/50 focus:bg-white"
            />
          </div>

          {/* Filter Actions */}
          <div className="flex gap-2">
            <Button variant="night" type="submit" size="sm" className="px-6 flex-1">
              Apply Filter
            </Button>
            {(batchId || from || to) && (
              <Link
                href="/dashboard/teacher/homework/history"
                className="inline-flex items-center justify-center font-display font-semibold rounded-full border border-cream-200 bg-white text-night-900 text-xs px-4 py-2 hover:bg-cream-50 transition-all shrink-0"
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
          <h3 className="mt-4 text-lg font-bold text-night-900 font-display">No history found</h3>
          <p className="mt-1 text-sm text-ink-soft">
            There are no recorded homework events matching your filters in this range.
          </p>
        </Card>
      ) : (
        <div className="relative border-l border-cream-200 ml-4 pl-6 space-y-8">
          {historyData.days.map((day) => (
            <div key={day.date} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] top-1.5 bg-gold-500 w-4.5 h-4.5 rounded-full border-4 border-white shadow-sm" />

              {/* Day Header */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 className="text-lg font-bold text-night-900 font-display">
                  {formatCalendarDate(day.date)}
                </h3>
                <span className="text-xs font-semibold text-ink-soft bg-cream-50 border border-cream-200 px-2.5 py-1 rounded">
                  {day.homeworkCount} Homework{day.homeworkCount > 1 ? "s" : ""} • Average Rate: {day.submissionRate}%
                </span>
              </div>

              {/* Day's Homeworks list */}
              <div className="grid gap-4 sm:grid-cols-2">
                {day.homeworks.map((hw) => (
                  <Card key={hw.id} className="border border-cream-200 shadow-soft p-4 flex flex-col justify-between hover:border-gold-500/50 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-quran bg-quran-soft px-2 py-0.5 rounded uppercase tracking-wider">
                          {hw.batch.name}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-night-900 line-clamp-1">{hw.title}</h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-ink-soft">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {hw.totalAssigned}
                        </span>
                        <span className="flex items-center gap-1 text-success">
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          {hw.totalSubmitted}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/teacher/homework/${hw.id}/submissions`}
                        className="inline-flex items-center gap-1 font-bold text-gold-600 hover:text-gold-500 transition-colors uppercase tracking-wider text-[10px]"
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
        <div className="flex items-center justify-between border-t border-cream-200 pt-4 mt-6">
          <p className="text-xs text-ink-soft">
            Showing Page <strong className="text-night-900">{meta.page}</strong> of <strong className="text-night-900">{meta.totalPages}</strong> ({meta.total} total items)
          </p>
          <div className="flex gap-2">
            <Link
              href={{
                pathname: "/dashboard/teacher/homework/history",
                query: { ...params, page: Math.max(1, meta.page - 1) },
              }}
              className={`inline-flex items-center justify-center font-display font-semibold rounded-full border border-cream-200 bg-white text-night-900 text-xs px-4 py-2 hover:bg-cream-50 transition-all ${
                meta.page <= 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Previous
            </Link>
            <Link
              href={{
                pathname: "/dashboard/teacher/homework/history",
                query: { ...params, page: Math.min(meta.totalPages, meta.page + 1) },
              }}
              className={`inline-flex items-center justify-center font-display font-semibold rounded-full border border-cream-200 bg-white text-night-900 text-xs px-4 py-2 hover:bg-cream-50 transition-all ${
                meta.page >= meta.totalPages ? "pointer-events-none opacity-40" : ""
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
