"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronLeft, ChevronRight, Minus, Search } from "lucide-react";
import { Input, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { getLessonResultsAction } from "@/actions/teacher/lesson/get-results";
import { SummaryStrip } from "./SummaryStrip";
import { StatusPill } from "./StatusPill";
import { StudentResultDrawer } from "./StudentResultDrawer";
import type {
  LessonResults,
  ResultsFilter,
  StudentResultRow,
} from "@/types/lesson";

const TABS: { value: ResultsFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PASSED", label: "Passed" },
  { value: "FAILED", label: "Failed" },
  { value: "NOT_ATTEMPTED", label: "Not attempted" },
];

export function LessonResultsView({
  lessonId,
  initial,
}: {
  lessonId: string;
  initial: LessonResults;
}) {
  const [data, setData] = useState(initial);
  const [filter, setFilter] = useState<ResultsFilter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<StudentResultRow | null>(null);
  const firstRender = useRef(true);

  const hasQuiz = data.lesson.hasQuiz;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      startTransition(async () => {
        const res = await getLessonResultsAction(lessonId, {
          status: filter,
          search: search || undefined,
          page,
        });
        if (res.ok) setData(res.data);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [lessonId, filter, search, page]);

  const { summary, results, meta } = data;

  return (
    <div>
      <SummaryStrip summary={summary} hasQuiz={hasQuiz} />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setPage(1);
              setFilter(t.value);
            }}
            aria-pressed={filter === t.value}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              filter === t.value
                ? "bg-night-900 text-cream-50"
                : "bg-cream-50 text-ink-soft hover:text-night-900",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 max-w-xs">
        <Input
          placeholder="Search students"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          icon={<Search className="h-4 w-4" aria-hidden />}
          aria-label="Search students"
        />
      </div>

      {pending ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="rounded-md border border-dashed border-cream-200 bg-cream-50 px-5 py-10 text-center text-sm text-ink-soft">
          No students match this filter.
        </p>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg bg-cream-50 shadow-soft sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-cream-200 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Video</th>
                  {hasQuiz && <th className="px-4 py-3 font-semibold">Quiz</th>}
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr
                    key={r.student.id}
                    onClick={() => setActive(r)}
                    className="cursor-pointer border-b border-cream-100 last:border-0 hover:bg-cream-100"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-night-900">
                        {r.student.name}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {r.student.studentCode}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <VideoMark done={r.video.completed} />
                    </td>
                    {hasQuiz && (
                      <td className="px-4 py-3">
                        <QuizCell quiz={r.quiz} />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 sm:hidden">
            {results.map((r) => (
              <button
                key={r.student.id}
                onClick={() => setActive(r)}
                className="flex w-full items-center justify-between gap-3 rounded-md bg-cream-50 p-3.5 text-left shadow-soft"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-night-900">
                    {r.student.name}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {r.student.studentCode}
                  </p>
                  {hasQuiz && (
                    <p className="mt-1 text-xs text-ink-soft">
                      Quiz: <QuizInline quiz={r.quiz} />
                    </p>
                  )}
                </div>
                <StatusPill status={r.status} />
              </button>
            ))}
          </div>
        </>
      )}

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || pending}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Prev
          </button>
          <span className="text-sm font-medium text-ink-soft">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages || pending}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <StudentResultDrawer
        lessonId={lessonId}
        studentId={active?.student.id ?? null}
        studentName={active?.student.name ?? ""}
        hasQuiz={hasQuiz}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

function VideoMark({ done }: { done: boolean }) {
  return done ? (
    <span className="inline-flex items-center gap-1 text-success">
      <Check className="h-4 w-4" aria-hidden />
      <span className="sr-only">Watched</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-ink-soft/60">
      <Minus className="h-4 w-4" aria-hidden />
      <span className="sr-only">Not watched</span>
    </span>
  );
}

/** score: null means "didn't attempt" → em dash, never 0. */
function QuizCell({ quiz }: { quiz: StudentResultRow["quiz"] }) {
  if (!quiz || quiz.score === null)
    return <span className="text-ink-soft/60">—</span>;
  return (
    <span
      className={cn(
        "font-medium",
        quiz.isPassed ? "text-success" : "text-error",
      )}
    >
      {quiz.score} {quiz.isPassed ? "· passed" : "· failed"}
      {quiz.attempts > 1 && (
        <span className="ml-1 text-xs text-ink-soft">
          ({quiz.attempts} tries)
        </span>
      )}
    </span>
  );
}

function QuizInline({ quiz }: { quiz: StudentResultRow["quiz"] }) {
  if (!quiz || quiz.score === null)
    return <span className="text-ink-soft/60">—</span>;
  return (
    <span className={quiz.isPassed ? "text-success" : "text-error"}>
      {quiz.score} · {quiz.isPassed ? "passed" : "failed"}
    </span>
  );
}
