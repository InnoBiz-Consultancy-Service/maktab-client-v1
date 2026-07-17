"use client";

import { cn } from "@/lib/utils/cn";
import { Check, Clock, CircleDashed, CloudOff, Lock } from "lucide-react";
import type { TodayBatch } from "@/types/attendance";

const stateConfig: Record<
  TodayBatch["state"],
  { icon: typeof Check; color: string; bg: string }
> = {
  DONE: { icon: Check, color: "text-success", bg: "bg-success/10" },
  IN_PROGRESS: { icon: Clock, color: "text-warn", bg: "bg-warn/10" },
  NOT_STARTED: {
    icon: CircleDashed,
    color: "text-ink-soft",
    bg: "bg-cream-100",
  },
  OFF_DAY: {
    icon: CloudOff,
    color: "text-ink-soft",
    bg: "bg-cream-100",
  },
};

interface BatchCardProps {
  batch: TodayBatch;
  onStart: (batchId: string) => void;
  onOffDay: (batchId: string) => void;
  onContinue: (dayId: string) => void;
  onView: (dayId: string) => void;
}

export function BatchCard({
  batch,
  onStart,
  onOffDay,
  onContinue,
  onView,
}: BatchCardProps) {
  const { icon: StateIcon, color, bg } = stateConfig[batch.state];

  return (
    <div className="rounded-lg bg-cream-50 p-4 shadow-soft sm:p-5">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            bg,
          )}
        >
          <StateIcon className={cn("h-5 w-5", color)} aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-night-900">
            {batch.batch.name}
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            {batch.totalStudents} students
          </p>
        </div>
      </div>

      {/* State-specific content */}
      <div className="mt-4">
        {batch.state === "NOT_STARTED" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onStart(batch.batch.id)}
              className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-full bg-gold-500 text-sm font-semibold text-night-900 shadow-soft transition-all active:scale-95 hover:scale-[1.02]"
            >
              Start class
            </button>
            <button
              type="button"
              onClick={() => onOffDay(batch.batch.id)}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full border border-cream-200 bg-cream-50 px-4 text-sm font-semibold text-ink-soft transition-all active:scale-95 hover:bg-cream-100"
            >
              Off day
            </button>
          </div>
        )}

        {batch.state === "IN_PROGRESS" && (
          <>
            {/* Progress bar */}
            {batch.progress && (
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-xs text-ink-soft">
                  <span>
                    {batch.progress.marked} / {batch.progress.total} marked
                  </span>
                  <span>
                    {Math.round(
                      (batch.progress.marked / batch.progress.total) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-cream-200">
                  <div
                    className="h-full rounded-full bg-warn transition-all duration-300"
                    style={{
                      width: `${(batch.progress.marked / batch.progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {batch.canEdit ? (
              <button
                type="button"
                onClick={() => batch.dayId && onContinue(batch.dayId)}
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-full bg-gold-500 text-sm font-semibold text-night-900 shadow-soft transition-all active:scale-95 hover:scale-[1.02]"
              >
                Continue
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-1.5 text-sm text-ink-soft">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  <span>{batch.takenBy?.name} is taking attendance</span>
                </div>
                <button
                  type="button"
                  onClick={() => batch.dayId && onView(batch.dayId)}
                  className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-cream-200 bg-cream-50 px-4 text-sm font-semibold text-ink-soft transition-all active:scale-95 hover:bg-cream-100"
                >
                  View
                </button>
              </div>
            )}
          </>
        )}

        {batch.state === "DONE" && (
          <div className="flex items-center gap-2">
            <p className="flex-1 text-sm text-success">
              Completed by {batch.takenBy?.name}
            </p>
            {batch.canEdit && (
              <button
                type="button"
                onClick={() => batch.dayId && onView(batch.dayId)}
                className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-cream-200 bg-cream-50 px-4 text-sm font-semibold text-ink-soft transition-all active:scale-95 hover:bg-cream-100"
              >
                Edit
              </button>
            )}
          </div>
        )}

        {batch.state === "OFF_DAY" && (
          <p className="text-sm text-ink-soft">Holiday: {batch.reason}</p>
        )}
      </div>
    </div>
  );
}
