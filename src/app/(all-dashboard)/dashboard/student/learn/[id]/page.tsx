import { notFound } from "next/navigation";
import { dummyLessons, dummyQuiz } from "@/lib/dummy/student";
import { LessonView } from "@/components/student/Lesson/LessonView";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: replace with GET /api/v1/lessons/:id + /quiz
  const lesson = dummyLessons.find((l) => l.id === id);
  if (!lesson || lesson.state === "locked") notFound();

  return <LessonView lesson={lesson} quiz={dummyQuiz} />;
}
