import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonForm } from "@/components/teacher/lesson/LessonForm";
import { getTeacherLessonAction } from "@/actions/teacher/lesson/get-lessons";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function EditLessonPage({ params }: PageProps) {
  const { lessonId } = await params;
  const res = await getTeacherLessonAction(lessonId);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/dashboard/teacher/lessons"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to lessons
      </Link>

      {!res.ok ? (
        <div className="rounded-lg border border-error/30 bg-error/5 px-5 py-4 text-sm text-error">
          {res.error}
        </div>
      ) : !res.data.isOwner ? (
        <div className="rounded-lg border border-warn/30 bg-warn/5 px-5 py-4 text-sm text-night-900">
          This lesson was created by{" "}
          {res.data.teacher?.name ?? "another teacher"}. You can view it, but
          only its owner can make changes.
        </div>
      ) : (
        <LessonForm
          mode="edit"
          lesson={res.data}
          batches={
            res.data.batch
              ? [{ id: res.data.batch.id, name: res.data.batch.name }]
              : []
          }
        />
      )}
    </div>
  );
}
