import { Card } from "@/components/ui";
import type { MyStudent } from "@/lib/dummy/teacher";

/** Small coloured bar showing a 0–100 value. */
function Meter({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
      <div
        className={`h-full rounded-full ${tone}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function StudentRow({ student }: { student: MyStudent }) {
  return (
    <li className="px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-sm font-bold text-quran">
          {student.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-night-900">{student.name}</p>
          <p className="truncate text-sm text-ink-soft">
            {student.class} · {student.parentName}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-cream-100 px-2.5 py-1 font-display text-sm font-semibold tracking-wide text-night-900">
          {student.studentCode}
        </span>
      </div>

      {/* Progress · average · attendance */}
      <dl className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <dt className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink-soft">Progress</span>
            <span className="font-semibold text-night-900">
              {student.progress}%
            </span>
          </dt>
          <dd>
            <Meter value={student.progress} tone="bg-gold-500" />
          </dd>
        </div>
        <div>
          <dt className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink-soft">Average</span>
            <span className="font-semibold text-night-900">
              {student.average}%
            </span>
          </dt>
          <dd>
            <Meter value={student.average} tone="bg-arabic" />
          </dd>
        </div>
        <div>
          <dt className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink-soft">Attendance</span>
            <span className="font-semibold text-night-900">
              {student.attendanceRate}%
            </span>
          </dt>
          <dd>
            <Meter
              value={student.attendanceRate}
              tone={student.attendanceRate >= 85 ? "bg-success" : "bg-warn"}
            />
          </dd>
        </div>
      </dl>
    </li>
  );
}
