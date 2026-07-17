import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getStudentSummaryAction } from "@/actions/attendance/get-student-summary";
import { getStudentHistoryAction } from "@/actions/attendance/get-student-history";
import { AttendanceSummary } from "@/components/parent/attendance/AttendanceSummary";
import { AttendanceHistory } from "@/components/parent/attendance/AttendanceHistory";
import { Card } from "@/components/ui";

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function ChildDetailPage({ params }: Props) {
  const { studentId } = await params;

  const [summaryRes, historyRes] = await Promise.all([
    getStudentSummaryAction(studentId),
    getStudentHistoryAction(studentId),
  ]);

  if (!summaryRes.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {summaryRes.error}
        </Card>
      </div>
    );
  }

  const summary = summaryRes.data;
  const history = historyRes.ok ? historyRes.data : [];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-5">
        <Link
          href="/dashboard/parent/children"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>

        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-base font-bold text-quran">
            {summary.student.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-night-900">
              {summary.student.name}
            </h1>
            <p className="text-sm text-ink-soft">
              {summary.student.class} · {summary.student.studentCode}
            </p>
          </div>
        </div>
      </header>

      {/* Summary section */}
      <section className="mb-8">
        <h2 className="mb-3 font-display text-base font-bold text-night-900">
          Summary
        </h2>
        <AttendanceSummary studentId={studentId} initial={summary} />
      </section>

      {/* History section */}
      <section>
        <h2 className="mb-3 font-display text-base font-bold text-night-900">
          History
        </h2>
        <AttendanceHistory studentId={studentId} initial={history} />
      </section>
    </div>
  );
}
