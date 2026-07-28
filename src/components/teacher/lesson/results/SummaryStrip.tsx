import {
  CircleDashed,
  ListChecks,
  PlayCircle,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import type { LessonResultsSummary } from "@/types/lesson";

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-cream-50 p-3.5 shadow-soft">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accent}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl leading-none font-bold text-night-900">
          {value}
        </p>
        <p className="mt-1 truncate text-xs text-ink-soft">{label}</p>
      </div>
    </div>
  );
}

export function SummaryStrip({
  summary,
  hasQuiz,
}: {
  summary: LessonResultsSummary;
  hasQuiz: boolean;
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <Stat
        icon={<Users className="h-4 w-4" aria-hidden />}
        label="Students"
        value={summary.totalStudents}
        accent="bg-night-800/10 text-night-800"
      />
      <Stat
        icon={<Trophy className="h-4 w-4" aria-hidden />}
        label="Completed"
        value={summary.completed}
        accent="bg-success/15 text-success"
      />
      <Stat
        icon={<PlayCircle className="h-4 w-4" aria-hidden />}
        label="Watched video"
        value={summary.videoCompleted}
        accent="bg-quran-soft text-quran"
      />
      {hasQuiz && (
        <Stat
          icon={<ListChecks className="h-4 w-4" aria-hidden />}
          label="Passed quiz"
          value={summary.quizPassed ?? "—"}
          accent="bg-arabic-soft text-arabic"
        />
      )}
      {hasQuiz && (
        <Stat
          icon={<XCircle className="h-4 w-4" aria-hidden />}
          label="Failed quiz"
          value={summary.quizAttemptedButFailed}
          accent="bg-error/12 text-error"
        />
      )}
      <Stat
        icon={<CircleDashed className="h-4 w-4" aria-hidden />}
        label="Not started"
        value={summary.notStarted}
        accent="bg-cream-200 text-ink-soft"
      />
    </div>
  );
}
