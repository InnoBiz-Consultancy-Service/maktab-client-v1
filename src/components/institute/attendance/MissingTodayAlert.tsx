import Link from "next/link";
import { AlertTriangle, Clock, CircleDashed } from "lucide-react";
import type { MissingToday } from "@/types/attendance";

interface MissingTodayAlertProps {
  data: MissingToday;
}

export function MissingTodayAlert({ data }: MissingTodayAlertProps) {
  if (data.missingCount === 0) return null;

  return (
    <div className="rounded-lg border border-error/20 bg-error/5 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 shrink-0 text-error" aria-hidden />
        <h3 className="font-display font-bold text-night-900">
          {data.missingCount} batch{data.missingCount > 1 ? "es" : ""} pending
          today
        </h3>
      </div>

      <ul className="space-y-2">
        {data.batches.map((b) => (
          <li key={b.batch.id}>
            <Link
              href={`/dashboard/institute/attendance/batches/${b.batch.id}`}
              className="flex items-center gap-3 rounded-lg bg-cream-50 px-4 py-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98]"
            >
              {b.status === "NOT_STARTED" ? (
                <CircleDashed
                  className="h-4 w-4 shrink-0 text-ink-soft"
                  aria-hidden
                />
              ) : (
                <Clock className="h-4 w-4 shrink-0 text-warn" aria-hidden />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-night-900">
                  {b.batch.name}
                </p>
                <p className="text-xs text-ink-soft">
                  {b.status === "NOT_STARTED"
                    ? "Not started yet"
                    : `In progress — started by ${b.startedBy}`}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
