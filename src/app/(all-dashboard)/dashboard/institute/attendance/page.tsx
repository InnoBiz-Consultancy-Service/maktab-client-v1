import { CalendarCheck, Hammer } from "lucide-react";
import { Card } from "@/components/ui";
import { AttendancePanel } from "@/components/institute/dashboard/AttendancePanel";
import { dummyAttendanceToday } from "@/lib/dummy/instititue";

export default function AttendancePage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">Attendance</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Daily attendance across your classes.
        </p>
      </header>

      {/* Honest notice — this data isn't real yet */}
      <Card className="mb-6 border border-warn/30 bg-warn/10">
        <div className="flex items-start gap-3">
          <Hammer className="mt-0.5 h-5 w-5 shrink-0 text-warn" aria-hidden />
          <div>
            <p className="font-semibold text-night-900">Coming soon</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Attendance is still being built. The figures below are a preview
              of how it will look — they aren&rsquo;t your real numbers yet.
            </p>
          </div>
        </div>
      </Card>

      <AttendancePanel data={dummyAttendanceToday} />

      <Card className="mt-6 flex flex-col items-center gap-2 py-12 text-center">
        <CalendarCheck className="h-8 w-8 text-cream-200" aria-hidden />
        <p className="text-sm text-ink-soft">
          Once teachers start taking attendance, their records will appear here.
        </p>
      </Card>
    </div>
  );
}
