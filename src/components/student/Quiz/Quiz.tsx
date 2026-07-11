"use client";

import { useState } from "react";
import { Check, X, Trophy, RotateCcw, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/lib/dummy/student";

/**
 * Quiz with instant feedback — you find out immediately whether you were right,
 * which is what keeps a child engaged. No "submit and wait".
 */
export function Quiz({
  questions,
  xpReward,
  onComplete,
}: {
  questions: QuizQuestion[];
  xpReward: number;
  onComplete?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const answered = picked !== null;
  const gotItRight = answered && picked === q.correctIndex;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === q.correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (isLast) {
      setFinished(true);
      onComplete?.();
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function retry() {
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setFinished(false);
  }

  // ---- Results ----
  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const perfect = correctCount === questions.length;
    const earned = Math.round((correctCount / questions.length) * xpReward);

    return (
      <Card className="text-center">
        <div
          className={cn(
            "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full",
            perfect ? "bg-gold-500 text-night-900" : "bg-quran-soft text-quran",
          )}
          style={
            perfect
              ? { filter: "drop-shadow(0 0 24px rgba(245,184,51,0.55))" }
              : undefined
          }
        >
          <Trophy className="h-9 w-9" aria-hidden />
        </div>

        <h2 className="font-display text-2xl font-bold text-night-900">
          {perfect ? "Perfect!" : pct >= 60 ? "Well done!" : "Good effort!"}
        </h2>
        <p className="mt-1 text-ink-soft">
          You got {correctCount} out of {questions.length} right.
        </p>

        <div className="my-6 inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-5 py-2.5">
          <span className="font-display text-2xl font-bold text-night-900">
            +{earned}
          </span>
          <span className="font-medium text-ink-soft">XP earned</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-cream-200 font-display font-semibold text-night-900 transition-colors hover:bg-cream-100"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </button>
        </div>
      </Card>
    );
  }

  // ---- Question ----
  return (
    <Card>
      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-soft">
            Question {index + 1} of {questions.length}
          </span>
          <span className="font-display font-bold text-gold-600">
            {correctCount} correct
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
          <div
            className="h-full rounded-full bg-gold-500 transition-all duration-300"
            style={{
              width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <h2 className="mb-5 font-display text-xl font-bold text-night-900">
        {q.question}
      </h2>

      <div role="radiogroup" className="flex flex-col gap-3">
        {q.options.map((option, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked = picked === i;

          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isPicked}
              onClick={() => choose(i)}
              disabled={answered}
              className={cn(
                "flex min-h-[56px] items-center justify-between gap-3 rounded-md border-2 px-4 py-3 text-left font-medium transition-all",
                !answered &&
                  "border-cream-200 bg-cream-50 text-night-900 hover:border-gold-400 active:scale-[0.98]",
                answered &&
                  isCorrect &&
                  "border-success bg-success/10 text-night-900",
                answered &&
                  isPicked &&
                  !isCorrect &&
                  "border-error bg-error/10 text-night-900",
                answered &&
                  !isCorrect &&
                  !isPicked &&
                  "border-cream-200 bg-cream-50 text-ink-soft/60",
              )}
            >
              <span>{option}</span>
              {answered && isCorrect && (
                <Check className="h-5 w-5 shrink-0 text-success" aria-hidden />
              )}
              {answered && isPicked && !isCorrect && (
                <X className="h-5 w-5 shrink-0 text-error" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback + next */}
      {answered && (
        <div className="mt-5">
          <p
            className={cn(
              "mb-4 rounded-md px-4 py-3 text-sm font-medium",
              gotItRight
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error",
            )}
            role="status"
          >
            {gotItRight
              ? "That's right — well done!"
              : `Not quite. The answer is “${q.options[q.correctIndex]}”.`}
          </p>

          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gold-500 font-display text-base font-semibold text-night-900 transition-transform hover:scale-[1.01] active:scale-95"
          >
            {isLast ? "See my result" : "Next question"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </Card>
  );
}
