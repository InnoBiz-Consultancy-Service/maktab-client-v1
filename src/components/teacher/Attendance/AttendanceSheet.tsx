"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, CalendarOff, Loader2 } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import type { MyStudent, AttendanceMark } from "@/lib/dummy/teacher";

const options: Array<{
  value: AttendanceMark;
  label: string;
  icon: typeof Check;
  tone: string;
}> = [
  {
    value: "PRESENT",
    label: "Present",
    icon: Check,
    tone: "bg-success text-cream-50",
  },
  { value: "ABSENT", label: "Absent", icon: X, tone: "bg-error text-cream-50" },
  {
    value: "LEAVE",
    label: "Leave",
    icon: CalendarOff,
    tone: "bg-warn text-night-900",
  },
];

/**
 * Mark a whole class's attendance in one screen (FR-TE-05).
 * Everyone defaults to PRESENT — the teacher only taps the exceptions, which is
 * far quicker than marking each child individually.
 */
export function AttendanceSheet({ students }: { students: MyStudent[] }) {
  const [marks, setMarks] = useState<Record<string, AttendanceMark>>(
    Object.fromEntries(
      students.map((s) => [s.id, "PRESENT" as AttendanceMark]),
    ),
  );
  const [saving, setSaving] = useState(false);

  const counts = {
    PRESENT: Object.values(marks).filter((m) => m === "PRESENT").length,
    ABSENT: Object.values(marks).filter((m) => m === "ABSENT").length,
    LEAVE: Object.values(marks).filter((m) => m === "LEAVE").length,
  };

  async function save() {
    setSaving(true);
    // TODO: replace with a real POST /api/v1/attendance action.
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Attendance saved (preview — not sent to the server yet)");
  }

  return (
    <>
      {/* Running tally */}
      <Card className="mb-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden />
            <span className="text-ink-soft">Present</span>
            <span className="font-semibold text-night-900">
              {counts.PRESENT}
            </span>
          </li>
          <li className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-error" aria-hidden />
            <span className="text-ink-soft">Absent</span>
            <span className="font-semibold text-night-900">
              {counts.ABSENT}
            </span>
          </li>
          <li className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-warn" aria-hidden />
            <span className="text-ink-soft">Leave</span>
            <span className="font-semibold text-night-900">{counts.LEAVE}</span>
          </li>
        </ul>
      </Card>

      <Card className="mb-6 p-0">
        <ul className="divide-y divide-cream-200">
          {students.map((s) => (
            <li key={s.id} className="px-5 py-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-sm font-bold text-quran">
                  {s.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-night-900">
                    {s.name}
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    {s.studentCode}
                  </p>
                </div>
              </div>

              {/* Segmented control — big targets, works on a phone */}
              <div
                role="radiogroup"
                aria-label={`Attendance for ${s.name}`}
                className="grid grid-cols-3 gap-2"
              >
                {options.map((o) => {
                  const Icon = o.icon;
                  const active = marks[s.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() =>
                        setMarks((m) => ({ ...m, [s.id]: o.value }))
                      }
                      className={cn(
                        "inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-all active:scale-95",
                        active
                          ? o.tone
                          : "border border-cream-200 bg-cream-50 text-ink-soft hover:bg-cream-100",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Sticky save bar — always reachable on a phone */}
      <div className="sticky bottom-20 z-10 lg:bottom-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gold-500 font-display text-base font-semibold text-night-900 shadow-lift transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save attendance"
          )}
        </button>
      </div>
    </>
  );
}
