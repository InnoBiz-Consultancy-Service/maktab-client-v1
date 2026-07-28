import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Layers,
  ListChecks,
  PlayCircle,
  SquarePen,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCalendarDate } from "@/lib/utils/date";
import type { TeacherLessonListItem } from "@/types/lesson";

const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-success/12 text-success",
  DRAFT: "bg-warn/12 text-warn",
};

function Badge({
  icon,
  children,
  tone,
}: {
  icon: ReactNode;
  children: ReactNode;
  tone: "quran" | "arabic";
}) {
  const tones = {
    quran: "bg-quran-soft text-quran",
    arabic: "bg-arabic-soft text-arabic",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function TeacherLessonCard({
  lesson,
}: {
  lesson: TeacherLessonListItem;
}) {
  const {
    id,
    title,
    date,
    status,
    batch,
    hasVideo,
    quiz,
    completedCount,
    isOwner,
    teacher,
  } = lesson;

  return (
    <article className="relative flex flex-col rounded-lg bg-cream-50 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <Link
        href={`/dashboard/teacher/lessons/${id}`}
        aria-label={`Open results for ${title}`}
        className="absolute inset-0 z-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
      />

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 font-display text-lg leading-snug font-bold text-night-900">
            {title}
          </h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              statusStyles[status],
            )}
          >
            {status === "PUBLISHED" ? "Published" : "Draft"}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden />
            {formatCalendarDate(date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-4 w-4" aria-hidden />
            {batch.name}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {hasVideo && (
            <Badge
              tone="quran"
              icon={<PlayCircle className="h-3.5 w-3.5" aria-hidden />}
            >
              Video
            </Badge>
          )}
          {quiz && (
            <Badge
              tone="arabic"
              icon={<ListChecks className="h-3.5 w-3.5" aria-hidden />}
            >
              Quiz · pass {quiz.passMark}/{quiz.totalQuestions}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-cream-200 pt-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft">
            <Users className="h-4 w-4" aria-hidden />
            {completedCount} completed
          </span>

          {isOwner ? (
            <Link
              href={`/dashboard/teacher/lessons/${id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto relative z-20 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-cream-200 px-3 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <SquarePen className="h-3.5 w-3.5" aria-hidden />
              Edit
            </Link>
          ) : (
            <span className="text-xs text-ink-soft/80">
              Shared by {teacher.name}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
