import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonForm } from "@/components/teacher/lesson/LessonForm";
import { getMyBatchesAction } from "@/actions/teacher/lesson/my-batches";

export default async function CreateLessonPage() {
  const result = await getMyBatchesAction();
  const batches = result.ok
    ? result.data.map((b) => ({ id: b.id, name: b.name }))
    : [];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/dashboard/teacher/lessons"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to lessons
      </Link>
      <LessonForm mode="create" batches={batches} />
    </div>
  );
}
