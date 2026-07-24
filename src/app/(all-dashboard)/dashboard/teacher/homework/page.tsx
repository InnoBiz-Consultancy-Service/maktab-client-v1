import { getTeacherHomeworks, getBatches } from "@/actions/homework";
import { Button, Card } from "@/components/ui";
import { Plus, Search, Filter, BookOpen, Users, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { StatusChip } from "@/components/shared/homework/StatusChip";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    batchId?: string;
  }>;
}

export default async function TeacherHomeworkPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "";
  const batchId = params.batchId || "";

  const homeworksResult = await getTeacherHomeworks({ search, status, batchId });
  const batchesResult = await getBatches();

  const homeworkList = homeworksResult.ok ? homeworksResult.data : [];
  const batchesList = batchesResult.ok ? batchesResult.data : [];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">Homework Module</h1>
          <p className="text-sm text-ink-soft">Create, manage, and grade homework assignments for your batches.</p>
        </div>
        <Link
          href="/dashboard/teacher/homework/create"
          className="inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-gold-500 text-night-900 shadow-soft hover:shadow-[0_0_28px_rgba(245,184,51,0.4)] min-h-[44px] px-6 text-[15px]"
        >
          <Plus className="h-4 w-4" />
          <span>Create Homework</span>
        </Link>
      </div>

      {/* Filters section */}
      <Card className="p-4 shadow-soft">
        <form method="GET" className="grid gap-4 sm:grid-cols-4">
          {/* Search bar */}
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search homework by title..."
              className="w-full rounded-full border border-cream-200 bg-cream-50 py-2.5 pr-4 pl-10 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/60 focus:border-gold-500 focus:bg-white"
            />
          </div>

          {/* Batch filter */}
          <div>
            <select
              name="batchId"
              defaultValue={batchId}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-gold-500 focus:bg-white"
            >
              <option value="">All Batches</option>
              {batchesList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex gap-2">
            <select
              name="status"
              defaultValue={status}
              className="w-full rounded-full border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-gold-500 focus:bg-white"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <Button variant="night" type="submit" size="sm" className="px-5">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Homework Grid/List */}
      {homeworkList.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center shadow-soft">
          <BookOpen className="h-12 w-12 text-ink-soft/40" />
          <h3 className="mt-4 text-lg font-bold text-night-900">
            {search || status || batchId ? "No results found for this filter" : "No homework yet"}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {search || status || batchId
              ? "Try resetting the filters or modifying your search query."
              : "Get started by creating your very first assignment for students."}
          </p>
          {(search || status || batchId) && (
            <Link
              href="/dashboard/teacher/homework"
              className="mt-4 inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-transparent text-night-900 border border-cream-200 hover:bg-cream-50 min-h-[38px] px-4 text-sm"
            >
              Clear Filters
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeworkList.map((hw) => (
            <Card key={hw.id} interactive className="flex flex-col justify-between border border-cream-200 shadow-soft">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-cream-100 pb-3 mb-4">
                  <span className="text-xs font-semibold text-quran bg-quran-soft px-2 py-0.5 rounded">
                    {hw.batch.name}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      hw.status === "PUBLISHED" ? "text-success bg-success/10" : "text-ink-soft bg-cream-200"
                    }`}
                  >
                    {hw.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-night-900 line-clamp-2 mb-2">{hw.title}</h3>
                <p className="text-sm text-ink-soft line-clamp-3 mb-4">{hw.instruction}</p>
              </div>

              <div className="mt-auto space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-ink-soft border-t border-cream-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{hw.totalAssigned} Assigned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    <span>Max Score: {hw.maxScore !== null ? hw.maxScore : "Ungraded"}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due: {hw.dueDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-cream-100">
                  <Link
                    href={`/dashboard/teacher/homework/${hw.id}/submissions`}
                    className="flex-1 inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-night-900 text-cream-50 shadow-soft hover:bg-night-800 min-h-[38px] px-4 text-sm"
                  >
                    View Submissions
                  </Link>
                  <Link
                    href={`/dashboard/teacher/homework/${hw.id}`}
                    className="inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-transparent text-night-900 border border-cream-200 hover:bg-cream-50 min-h-[38px] px-3 text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
