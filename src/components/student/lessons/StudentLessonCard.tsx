import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronRight,
  ListChecks,
  Lock,
  Play,
  PlayCircle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCalendarDate } from "@/lib/utils/date";
import type { StudentLessonListItem } from "@/types/lesson";

function StatusNode({ state }: { state: "done" | "available" | "locked" }) {
  return (
    <div
      className={cn(
        "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 transition-transform",
        state === "done" && "border-success bg-success text-cream-50",
        state === "available" &&
          "border-gold-500 bg-gold-500 text-night-900 shadow-[0_0_24px_rgba(245,184,51,0.45)]",
        state === "locked" && "border-cream-200 bg-cream-50 text-cream-200",
      )}
    >
      {state === "done" && <Check className="h-6 w-6" aria-hidden />}
      {state === "available" && (
        <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />
      )}
      {state === "locked" && <Lock className="h-5 w-5" aria-hidden />}
      {state === "done" && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-night-900">
          <Star className="h-3 w-3 fill-current" aria-hidden />
        </span>
      )}
    </div>
  );
}

function MetaBadges({ lesson }: { lesson: StudentLessonListItem }) {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
      <span className="inline-flex items-center gap-1">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
        {formatCalendarDate(lesson.date)}
      </span>
      {lesson.hasVideo && (
        <span className="inline-flex items-center gap-1">
          <PlayCircle className="h-3.5 w-3.5 text-quran" aria-hidden />
          Video
        </span>
      )}
      {lesson.hasQuiz && (
        <span className="inline-flex items-center gap-1">
          <ListChecks className="h-3.5 w-3.5 text-arabic" aria-hidden />
          Quiz
        </span>
      )}
    </div>
  );
}

export function StudentLessonCard({
  lesson,
}: {
  lesson: StudentLessonListItem;
}) {
  const state: "done" | "available" | "locked" = lesson.isLocked
    ? "locked"
    : lesson.isCompleted
      ? "done"
      : "available";

  const inProgress =
    state === "available" &&
    (lesson.progress.videoCompleted || lesson.progress.quizPassed);

  if (state === "locked") {
    return (
      <div
        className="flex items-center gap-4 rounded-lg bg-cream-50/70 p-4 opacity-90"
        aria-disabled
      >
        <StatusNode state="locked" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-bold text-ink-soft">
            {lesson.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Finish the lesson before this one to unlock it
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/student/lessons/${lesson.id}`}
      className="group flex items-center gap-4 rounded-lg bg-cream-50 p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
    >
      <StatusNode state={state} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-display text-base font-bold text-night-900">
            {lesson.title}
          </h3>
          {state === "done" && (
            <span className="shrink-0 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success">
              Done
            </span>
          )}
          {inProgress && (
            <span className="shrink-0 rounded-full bg-gold-300/50 px-2 py-0.5 text-[11px] font-semibold text-gold-600">
              In progress
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-soft">
          {lesson.teacher.name}
        </p>
        <MetaBadges lesson={lesson} />
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
