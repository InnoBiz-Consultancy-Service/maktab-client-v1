import Link from "next/link";
import { ArrowLeft, ListChecks, PlayCircle, SquarePen } from "lucide-react";
import { getLessonResultsAction } from "@/actions/teacher/lesson/get-results";
import { LessonResultsView } from "@/components/teacher/lesson/results/LessonResultsView";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonResultsPage({ params }: PageProps) {
  const { lessonId } = await params;
  const res = await getLessonResultsAction(lessonId);

  return (
    <div>
      <Link
        href="/dashboard/teacher/lessons"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to lessons
      </Link>

      {!res.ok ? (
        <div className="rounded-lg border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">
          {res.error}
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-night-900">
                {res.data.lesson.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                {res.data.lesson.hasVideo && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-quran-soft px-2.5 py-1 text-xs font-semibold text-quran">
                    <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                    Video
                  </span>
                )}
                {res.data.lesson.hasQuiz && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-arabic-soft px-2.5 py-1 text-xs font-semibold text-arabic">
                    <ListChecks className="h-3.5 w-3.5" aria-hidden />
                    Quiz · pass {res.data.lesson.passMark}/
                    {res.data.lesson.totalQuestions}
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/dashboard/teacher/lessons/${lessonId}/edit`}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100"
            >
              <SquarePen className="h-4 w-4" aria-hidden />
              Edit lesson
            </Link>
          </div>

          <LessonResultsView lessonId={lessonId} initial={res.data} />
        </>
      )}
    </div>
  );
}
