import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { StudentLessonView } from "@/components/student/lessons/details/StudentLessonView";
import { getStudentLessonAction } from "@/actions/student/lesson/get-lessons";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function StudentLessonDetailPage({ params }: PageProps) {
  const { lessonId } = await params;
  const res = await getStudentLessonAction(lessonId);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/dashboard/student/lessons"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to lessons
      </Link>

      {!res.ok ? (
        <div className="flex flex-col items-center rounded-lg border border-cream-200 bg-cream-50 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-ink-soft">
            <Lock className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mb-1 font-display text-lg font-bold text-night-900">
            This lesson is locked
          </h1>
          <p className="mb-5 max-w-sm text-sm text-ink-soft">{res.error}</p>
          <Link
            href="/dashboard/student/lessons"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gold-500 px-6 font-display text-sm font-semibold text-night-900 shadow-soft transition-transform hover:scale-[1.02] active:scale-95"
          >
            Back to my lessons
          </Link>
        </div>
      ) : (
        <>
          <h1 className="mb-4 font-display text-2xl font-bold text-night-900">
            {res.data.title}
          </h1>
          <StudentLessonView lesson={res.data} />
        </>
      )}
    </div>
  );
}
