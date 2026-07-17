import type { AttendanceStatus } from "@/types/attendance";

interface RosterSummaryBarProps {
  counts: Record<AttendanceStatus, number>;
}

/** Sticky summary showing P / A / L counts at the top of the roster. */
export function RosterSummaryBar({ counts }: RosterSummaryBarProps) {
  return (
    <div className="sticky top-[52px] z-10 -mx-4 border-b border-cream-200 bg-cream-50/95 px-4 py-3 backdrop-blur-sm sm:-mx-0 sm:rounded-lg sm:border lg:top-0">
      <ul className="flex flex-wrap gap-x-6 gap-y-1">
        <li className="flex items-center gap-1.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden />
          <span className="text-ink-soft">Present</span>
          <span className="font-semibold text-night-900">{counts.PRESENT}</span>
        </li>
        <li className="flex items-center gap-1.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-error" aria-hidden />
          <span className="text-ink-soft">Absent</span>
          <span className="font-semibold text-night-900">{counts.ABSENT}</span>
        </li>
        <li className="flex items-center gap-1.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-warn" aria-hidden />
          <span className="text-ink-soft">Late</span>
          <span className="font-semibold text-night-900">{counts.LATE}</span>
        </li>
      </ul>
    </div>
  );
}
