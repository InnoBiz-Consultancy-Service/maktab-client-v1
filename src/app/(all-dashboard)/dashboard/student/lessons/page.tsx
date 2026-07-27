import { getStudentLessonsAction } from "@/actions/student/lesson/get-lessons";
import { StudentLessonList } from "@/components/student/lessons/StudentLessonList";
import type { Paginated, StudentLessonListItem } from "@/types/lesson";

const EMPTY: Paginated<StudentLessonListItem> = {
  items: [],
  meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
};

export default async function StudentLessonsPage() {
  const res = await getStudentLessonsAction();
  const initial = res.ok ? res.data : EMPTY;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-night-900">
          My lessons
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Work through them in order — finish one to unlock the next.
        </p>
      </div>

      {!res.ok ? (
        <div className="rounded-lg border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">
          {res.error}
        </div>
      ) : (
        <StudentLessonList initial={initial} />
      )}
    </div>
  );
}
