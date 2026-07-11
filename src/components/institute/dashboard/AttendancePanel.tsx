import { CalendarCheck } from "lucide-react";
import { Card } from "@/components/ui";
import { AttendanceToday } from "@/lib/dummy/instititue";

/**
 * Today's attendance at a glance. Placeholder data for now — swap the prop for
 * the real GET /attendance/today response when the backend lands.
 */
export function AttendancePanel({ data }: { data: AttendanceToday }) {
  const total = data.present + data.absent + data.notTaken;
  const pct = total > 0 ? Math.round((data.present / total) * 100) : 0;

  const rows = [
    { label: "Present", value: data.present, tone: "bg-success" },
    { label: "Absent", value: data.absent, tone: "bg-error" },
    { label: "Not taken", value: data.notTaken, tone: "bg-cream-200" },
  ];

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4.5 w-4.5 text-ink-soft" aria-hidden />
          <h2 className="font-display font-bold text-night-900">
            Today&rsquo;s attendance
          </h2>
        </div>
        <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-soft">
          Preview
        </span>
      </div>

      <p className="font-display text-3xl font-bold text-night-900">
        {pct}
        <span className="text-2xl">%</span>
        <span className="ml-1.5 text-sm font-medium text-ink-soft">
          present
        </span>
      </p>

      {/* Stacked bar */}
      <div
        className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-cream-200"
        role="img"
        aria-label={`${data.present} present, ${data.absent} absent, ${data.notTaken} not taken`}
      >
        {rows.map(
          (r) =>
            r.value > 0 && (
              <span
                key={r.label}
                className={r.tone}
                style={{ width: `${(r.value / total) * 100}%` }}
              />
            ),
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-1.5 text-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${r.tone}`}
              aria-hidden
            />
            <span className="text-ink-soft">{r.label}</span>
            <span className="font-semibold text-night-900">{r.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
