"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui";
import { subjects, type Lesson, type QuizQuestion } from "@/lib/dummy/student";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer";
import { Quiz } from "../Quiz/Quiz";

type Stage = "watch" | "quiz";

/**
 * One lesson, start to finish: watch the video, then take the quiz.
 * The quiz only unlocks after the video ends — that keeps the order honest
 * without nagging the child.
 */
export function LessonView({
  lesson,
  quiz,
}: {
  lesson: Lesson;
  quiz: QuizQuestion[];
}) {
  const [stage, setStage] = useState<Stage>("watch");
  const [watched, setWatched] = useState(false);
  const subject = subjects[lesson.subject];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/dashboard/student/learn"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to journey
      </Link>

      {/* Title */}
      <div className="mb-4">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${subject.soft} ${subject.accent}`}
        >
          {subject.label}
        </span>
        <h1 className="mt-2 font-display text-2xl font-bold text-night-900">
          {lesson.title}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{lesson.description}</p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setStage("watch")}
          className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
            stage === "watch"
              ? "bg-night-900 text-cream-50"
              : "border border-cream-200 bg-cream-50 text-ink-soft"
          }`}
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Watch
        </button>
        <button
          type="button"
          onClick={() => watched && setStage("quiz")}
          disabled={!watched}
          className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
            stage === "quiz"
              ? "bg-night-900 text-cream-50"
              : "border border-cream-200 bg-cream-50 text-ink-soft"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          title={watched ? undefined : "Watch the video first"}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Quiz
        </button>
      </div>

      {stage === "watch" ? (
        <>
          <VideoPlayer
            src={lesson.videoUrl}
            title={lesson.title}
            onEnded={() => {
              setWatched(true);
              setStage("quiz");
            }}
          />
          <Card className="mt-4">
            <p className="text-sm text-ink-soft">
              Watch to the end, then the quiz unlocks. You&rsquo;ll earn{" "}
              <strong className="text-night-900">+{lesson.xp} XP</strong> for
              finishing this lesson.
            </p>
          </Card>
        </>
      ) : (
        <Quiz questions={quiz} xpReward={lesson.xp} />
      )}
    </div>
  );
}
