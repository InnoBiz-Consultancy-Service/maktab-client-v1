"use client";

import Link from "next/link";
import { Lock, Check, Play, Star } from "lucide-react";
import { subjects, type Lesson } from "@/lib/dummy/student";
import { cn } from "@/lib/utils/cn";

/**
 * The learning path — lesson nodes on a gently winding trail, like a game map.
 * This is the single biggest thing that stops the app feeling like homework:
 * you can *see* where you've been and what's next.
 */
export function JourneyPath({ lessons }: { lessons: Lesson[] }) {
  return (
    <ol className="relative flex flex-col items-center gap-2 py-4">
      {lessons.map((lesson, i) => {
        const subject = subjects[lesson.subject];
        const locked = lesson.state === "locked";
        const done = lesson.state === "done";
        const available = lesson.state === "available";

        // Alternate left / centre / right so the trail winds.
        const offset = [
          "-translate-x-16",
          "translate-x-0",
          "translate-x-16",
          "translate-x-0",
        ][i % 4];

        const node = (
          <div
            className={cn(
              "relative flex h-[70px] w-[70px] items-center justify-center rounded-full border-4 transition-transform",
              done && "border-success bg-success text-cream-50",
              available &&
                "border-gold-500 bg-gold-500 text-night-900 shadow-[0_0_28px_rgba(245,184,51,0.5)]",
              locked && "border-cream-200 bg-cream-50 text-cream-200",
              !locked && "hover:scale-105 active:scale-95",
            )}
          >
            {done && <Check className="h-7 w-7" aria-hidden />}
            {available && (
              <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />
            )}
            {locked && <Lock className="h-6 w-6" aria-hidden />}

            {/* XP badge on completed nodes */}
            {done && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 font-display text-[10px] font-bold text-night-900">
                <Star className="h-3 w-3 fill-current" aria-hidden />
              </span>
            )}
          </div>
        );

        return (
          <li
            key={lesson.id}
            className={cn("flex flex-col items-center", offset)}
          >
            {/* Connector to the previous node */}
            {i > 0 && (
              <span
                className={cn(
                  "mb-2 h-8 w-1 rounded-full",
                  done || available ? "bg-gold-400" : "bg-cream-200",
                )}
                aria-hidden
              />
            )}

            {locked ? (
              <div
                className="cursor-not-allowed"
                title="Finish the lesson before this one to unlock"
              >
                {node}
              </div>
            ) : (
              <Link
                href={`/dashboard/student/learn/${lesson.id}`}
                aria-label={`${lesson.title} — ${done ? "completed" : "start"}`}
              >
                {node}
              </Link>
            )}

            {/* Label */}
            <div className="mt-2 max-w-[150px] text-center">
              <p
                className={cn(
                  "truncate text-sm font-semibold",
                  locked ? "text-ink-soft/60" : "text-night-900",
                )}
              >
                {lesson.title}
              </p>
              <span
                className={cn(
                  "mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium",
                  locked
                    ? "bg-cream-200 text-ink-soft/70"
                    : `${subject.soft} ${subject.accent}`,
                )}
              >
                {subject.label}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
