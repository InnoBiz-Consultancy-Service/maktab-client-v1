"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  History,
  Lock,
  PartyPopper,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { submitQuizAction } from "@/actions/student/lesson/submit-quiz";
import type { StudentQuiz, SubmitQuizResult } from "@/types/lesson";

interface Props {
  lessonId: string;
  quiz: StudentQuiz;
  canAttempt: boolean;
  onChanged: () => void | Promise<void>;
}

function fmt(dt: string): string {
  return new Date(dt).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function QuizPlayer({ lessonId, quiz, canAttempt, onChanged }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitQuizResult | null>(null);

  const allAnswered = useMemo(
    () => quiz.questions.every((q) => answers[q.id]),
    [answers, quiz.questions],
  );

  async function submit() {
    if (!allAnswered) return;
    setPending(true);
    const res = await submitQuizAction(lessonId, {
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id],
      })),
    });
    setPending(false);

    if (!res.ok) {
      toast.error(res.error);
      await onChanged(); // e.g. 409 already passed — resync
      return;
    }
    setResult(res.data);
    await onChanged();
  }

  function retry() {
    setResult(null);
    setAnswers({});
  }

  if (result) {
    return (
      <ResultCard
        result={result}
        onRetry={result.isPassed ? undefined : retry}
      />
    );
  }

  if (quiz.hasPassed) {
    return (
      <Card className="space-y-4">
        <QuizHeader passMark={quiz.passMark} total={quiz.totalQuestions} />
        <p className="inline-flex items-center gap-2 rounded-full bg-success/12 px-3.5 py-2 text-sm font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          You've passed this quiz
        </p>
        <AttemptsHistory quiz={quiz} />
      </Card>
    );
  }

  if (!canAttempt) {
    return (
      <Card className="space-y-3">
        <QuizHeader passMark={quiz.passMark} total={quiz.totalQuestions} />
        <p className="inline-flex items-center gap-2 rounded-sm bg-cream-100 px-3.5 py-2 text-sm text-ink-soft">
          <Lock className="h-4 w-4" aria-hidden />
          Watch the video and mark it complete to unlock the quiz.
        </p>
        <AttemptsHistory quiz={quiz} />
      </Card>
    );
  }

  return (
    <Card className="space-y-5">
      <QuizHeader passMark={quiz.passMark} total={quiz.totalQuestions} />

      <ol className="space-y-5">
        {quiz.questions.map((q, qi) => (
          <li key={q.id}>
            <p className="mb-2.5 font-medium text-night-900">
              {qi + 1}. {q.text}
            </p>
            <div className="space-y-2">
              {q.options.map((o) => {
                const selected = answers[q.id] === o.id;
                return (
                  <label
                    key={o.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-sm border px-3.5 py-3 transition-colors",
                      selected
                        ? "border-gold-500 bg-gold-300/20"
                        : "border-cream-200 hover:border-cream-200/70 hover:bg-cream-50",
                    )}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={selected}
                      onChange={() =>
                        setAnswers((a) => ({ ...a, [q.id]: o.id }))
                      }
                      className="h-5 w-5 accent-gold-500"
                    />
                    <span className="text-[15px] text-night-900">{o.text}</span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {Object.keys(answers).length}/{quiz.totalQuestions} answered
        </p>
        <Button onClick={submit} loading={pending} disabled={!allAnswered}>
          Submit answers
        </Button>
      </div>

      {quiz.attempts.length > 0 && <AttemptsHistory quiz={quiz} />}
    </Card>
  );
}

function QuizHeader({ passMark, total }: { passMark: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-display text-lg font-bold text-night-900">Quiz</h3>
      <span className="text-sm text-ink-soft">
        Get {passMark} of {total} right to pass
      </span>
    </div>
  );
}

function ResultCard({
  result,
  onRetry,
}: {
  result: SubmitQuizResult;
  onRetry?: () => void;
}) {
  const passed = result.isPassed;
  return (
    <Card className="space-y-4 text-center">
      <div
        className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
          passed ? "bg-success/15 text-success" : "bg-error/12 text-error",
        )}
      >
        {passed ? (
          <PartyPopper className="h-8 w-8" aria-hidden />
        ) : (
          <XCircle className="h-8 w-8" aria-hidden />
        )}
      </div>

      <div>
        <h3 className="font-display text-xl font-bold text-night-900">
          {passed ? "Well done!" : "Not quite yet"}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          You scored {result.score} out of {result.totalQuestions} (pass mark{" "}
          {result.passMark}).
        </p>
      </div>

      {passed ? (
        <p className="rounded-sm bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
          {result.lessonCompleted
            ? "Lesson complete — the next one is unlocked."
            : (result.remaining ?? "Quiz passed.")}
        </p>
      ) : (
        onRetry && (
          <Button onClick={onRetry} variant="primary">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
        )
      )}
    </Card>
  );
}

function AttemptsHistory({ quiz }: { quiz: StudentQuiz }) {
  if (quiz.attempts.length === 0) return null;
  return (
    <div className="border-t border-cream-200 pt-4">
      <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-night-900">
        <History className="h-4 w-4" aria-hidden />
        Your attempts
      </h4>
      <ul className="space-y-1.5">
        {quiz.attempts.map((a) => (
          <li
            key={a.attemptNumber}
            className="flex items-center justify-between gap-3 rounded-sm bg-cream-100 px-3 py-2 text-sm"
          >
            <span className="text-ink-soft">Attempt {a.attemptNumber}</span>
            <span className="text-ink-soft">{fmt(a.submittedAt)}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                a.isPassed
                  ? "bg-success/12 text-success"
                  : "bg-error/12 text-error",
              )}
            >
              {a.score}/{quiz.totalQuestions} · {a.isPassed ? "Pass" : "Fail"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
