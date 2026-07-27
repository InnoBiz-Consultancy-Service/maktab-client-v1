"use client";

import { useEffect, useState } from "react";
import { Check, Minus, X } from "lucide-react";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { getStudentResultAction } from "@/actions/teacher/lesson/get-student-result";
import type { StudentResultDetail } from "@/types/lesson";

interface Props {
  lessonId: string;
  studentId: string | null;
  studentName: string;
  hasQuiz: boolean;
  onClose: () => void;
}

function fmt(dt: string | null): string {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StudentResultDrawer({
  lessonId,
  studentId,
  studentName,
  hasQuiz,
  onClose,
}: Props) {
  const [data, setData] = useState<StudentResultDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    setData(null);
    setError(null);
    setLoading(true);
    getStudentResultAction(lessonId, studentId).then((res) => {
      if (res.ok) setData(res.data);
      else setError(res.error);
      setLoading(false);
    });
  }, [lessonId, studentId]);

  useEffect(() => {
    if (!studentId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [studentId, onClose]);

  if (!studentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-night-900/40"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-label={`Results for ${studentName}`}
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-cream-50 shadow-lift sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-cream-200 p-5">
          <div>
            <h2 className="font-display text-lg font-bold text-night-900">
              {studentName}
            </h2>
            {data && (
              <p className="text-sm text-ink-soft">
                {data.student.studentCode}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-200"
          >
            <X className="h-5 w-5" aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {loading && (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          )}

          {error && !loading && (
            <p className="rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
              {error}
            </p>
          )}

          {data && !loading && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-2">
                <ProgressRow
                  done={data.progress.videoCompleted}
                  label="Watched the video"
                  at={data.progress.videoCompletedAt}
                />
                {hasQuiz && (
                  <ProgressRow
                    done={data.progress.quizPassed}
                    label="Passed the quiz"
                    at={data.progress.quizPassedAt}
                  />
                )}
                <ProgressRow
                  done={data.progress.isCompleted}
                  label="Lesson completed"
                  at={data.progress.completedAt}
                />
              </div>

              {hasQuiz && (
                <div>
                  <h3 className="mb-2 font-display text-sm font-bold text-night-900">
                    Quiz attempts ({data.totalAttempts})
                  </h3>
                  {data.attempts.length === 0 ? (
                    <p className="text-sm text-ink-soft">No attempts yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {data.attempts.map((a) => (
                        <li
                          key={a.attemptNumber}
                          className="rounded-md border border-cream-200 p-3.5"
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-night-900">
                              Attempt {a.attemptNumber}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                a.isPassed
                                  ? "bg-success/12 text-success"
                                  : "bg-error/12 text-error",
                              )}
                            >
                              {a.score}/{a.totalQuestions} ·{" "}
                              {a.isPassed ? "Passed" : "Failed"}
                            </span>
                          </div>
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            {a.answers.map((ans, i) => (
                              <span
                                key={ans.questionId}
                                title={`Question ${i + 1}: ${ans.isCorrect ? "correct" : "wrong"}`}
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full text-cream-50",
                                  ans.isCorrect ? "bg-success" : "bg-error",
                                )}
                              >
                                {ans.isCorrect ? (
                                  <Check className="h-3.5 w-3.5" aria-hidden />
                                ) : (
                                  <X className="h-3.5 w-3.5" aria-hidden />
                                )}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-ink-soft">
                            {fmt(a.submittedAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  done,
  label,
  at,
}: {
  done: boolean;
  label: string;
  at: string | null;
}) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-cream-200 px-3.5 py-2.5">
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          done ? "bg-success text-cream-50" : "bg-cream-200 text-ink-soft",
        )}
      >
        {done ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Minus className="h-4 w-4" aria-hidden />
        )}
      </span>
      <span className="flex-1 text-sm text-night-900">{label}</span>
      {done && at && <span className="text-xs text-ink-soft">{fmt(at)}</span>}
    </div>
  );
}
