import Link from "next/link";
import { Plus } from "lucide-react";
import { getTeacherLessonsAction } from "@/actions/teacher/lesson/get-lessons";
import { TeacherLessonList } from "@/components/teacher/lesson/TeacherLessonList";
import type { Paginated, TeacherLessonListItem } from "@/types/lesson";
import { getMyBatchesAction } from "@/actions/teacher/lesson/my-batches";

const EMPTY: Paginated<TeacherLessonListItem> = {
  items: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
};

export default async function TeacherLessonsPage() {
  const [lessonsRes, batchesRes] = await Promise.all([
    getTeacherLessonsAction(),
    getMyBatchesAction(),
  ]);

  const initial = lessonsRes.ok ? lessonsRes.data : EMPTY;
  const batches = batchesRes.ok
    ? batchesRes.data.map((b) => ({ id: b.id, name: b.name }))
    : [];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-night-900">
            Lessons
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Create lessons, track who has completed them, and edit your own.
          </p>
        </div>
        <Link
          href="/dashboard/teacher/create-lesson"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 shadow-soft transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Add lesson</span>
        </Link>
      </div>

      {!lessonsRes.ok ? (
        <div className="rounded-lg border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">
          {lessonsRes.error}
        </div>
      ) : (
        <TeacherLessonList initial={initial} batches={batches} />
      )}
    </div>
  );
}
