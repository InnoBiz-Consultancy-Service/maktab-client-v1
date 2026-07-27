"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper } from "lucide-react";
import { LessonVideo } from "./LessonVideo";
import { QuizPlayer } from "./QuizPlayer";
import type { StudentLessonDetail } from "@/types/lesson";
import { getStudentLessonAction } from "@/actions/student/lesson/get-lessons";

export function StudentLessonView({
  lesson: initial,
}: {
  lesson: StudentLessonDetail;
}) {
  const [lesson, setLesson] = useState(initial);
  const router = useRouter();

  async function refetch() {
    const res = await getStudentLessonAction(lesson.id);
    if (res.ok) setLesson(res.data);
    router.refresh();
  }

  const { progress, canMarkVideoComplete, canAttemptQuiz } = lesson;

  const hint = progress.isCompleted
    ? null
    : canMarkVideoComplete
      ? "Watch the video, then mark it complete."
      : canAttemptQuiz
        ? "Take the quiz to finish this lesson."
        : null;

  return (
    <div className="space-y-6">
      {progress.isCompleted && (
        <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success text-cream-50">
            <PartyPopper className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className="font-display font-bold text-night-900">
              Lesson complete
            </p>
            <p className="text-sm text-ink-soft">
              Great work — keep the streak going.
            </p>
          </div>
        </div>
      )}

      {lesson.hasVideo && lesson.youtubeVideoId && (
        <LessonVideo
          lessonId={lesson.id}
          videoId={lesson.youtubeVideoId}
          completed={progress.videoCompleted}
          canComplete={canMarkVideoComplete}
          onCompleted={refetch}
        />
      )}

      {lesson.description && (
        <p className="leading-relaxed text-ink-soft">{lesson.description}</p>
      )}

      {hint && (
        <p className="rounded-sm border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-ink-soft">
          {hint}
        </p>
      )}

      {lesson.hasQuiz && lesson.quiz && (
        <QuizPlayer
          lessonId={lesson.id}
          quiz={lesson.quiz}
          canAttempt={canAttemptQuiz}
          onChanged={refetch}
        />
      )}
    </div>
  );
}
