"use client";

import { Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { AttendanceStatus } from "@/types/attendance";

const options: Array<{
  value: AttendanceStatus;
  label: string;
  icon: typeof Check;
  active: string;
}> = [
  {
    value: "PRESENT",
    label: "Present",
    icon: Check,
    active: "bg-success text-cream-50",
  },
  {
    value: "ABSENT",
    label: "Absent",
    icon: X,
    active: "bg-error text-cream-50",
  },
  {
    value: "LATE",
    label: "Late",
    icon: Clock,
    active: "bg-warn text-night-900",
  },
];

interface StudentMarkRowProps {
  studentId: string;
  name: string;
  studentCode: string;
  status: AttendanceStatus;
  disabled?: boolean;
  onChange: (studentId: string, status: AttendanceStatus) => void;
}

export function StudentMarkRow({
  studentId,
  name,
  studentCode,
  status,
  disabled = false,
  onChange,
}: StudentMarkRowProps) {
  return (
    <li className="px-4 py-3.5 sm:px-5">
      <div className="mb-2.5 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-sm font-bold text-quran">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-night-900">{name}</p>
          <p className="truncate text-xs text-ink-soft">{studentCode}</p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label={`Attendance for ${name}`}
        className="grid grid-cols-3 gap-2"
      >
        {options.map((o) => {
          const Icon = o.icon;
          const isActive = status === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(studentId, o.value)}
              className={cn(
                "inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-all active:scale-95",
                isActive
                  ? o.active
                  : "border border-cream-200 bg-cream-50 text-ink-soft hover:bg-cream-100",
                disabled && "opacity-50 pointer-events-none",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {o.label}
            </button>
          );
        })}
      </div>
    </li>
  );
}
