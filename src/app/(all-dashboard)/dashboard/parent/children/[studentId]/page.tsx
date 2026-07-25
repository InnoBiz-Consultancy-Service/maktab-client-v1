import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getStudentSummaryAction } from "@/actions/attendance/get-student-summary";
import { getStudentHistoryAction } from "@/actions/attendance/get-student-history";
import { getParentHomeworkOverview } from "@/actions/homework";
import { AttendanceSummary } from "@/components/parent/attendance/AttendanceSummary";
import { AttendanceHistory } from "@/components/parent/attendance/AttendanceHistory";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import { Card } from "@/components/ui";
import { formatCalendarDate } from "@/lib/utils/date";

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function ChildDetailPage({ params }: Props) {
  const { studentId } = await params;

  const [summaryRes, historyRes, homeworkOverviewRes] = await Promise.all([
    getStudentSummaryAction(studentId),
    getStudentHistoryAction(studentId),
    getParentHomeworkOverview(studentId),
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
  const homeworkOverview = homeworkOverviewRes.ok ? homeworkOverviewRes.data : null;

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

      {/* Homework section */}
      {homeworkOverview && homeworkOverview.children.length > 0 && (
        <section className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-night-900">
              Homework Progress ({homeworkOverview.month})
            </h2>
            <Link href="/dashboard/parent/homework" className="text-xs font-bold text-gold-600 hover:underline">
              View All Homeworks &rarr;
            </Link>
          </div>
          {homeworkOverview.children.map((childData) => (
            <div key={childData.student.id} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Card className="p-3 text-center border border-cream-200 shadow-sm">
                  <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Assigned</span>
                  <span className="text-lg font-bold text-night-900 mt-0.5 block">{childData.summary.assigned}</span>
                </Card>
                <Card className="p-3 text-center border border-cream-200 shadow-sm">
                  <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Submitted</span>
                  <span className="text-lg font-bold text-night-900 mt-0.5 block">{childData.summary.submitted}</span>
                </Card>
                <Card className="p-3 text-center border border-cream-200 shadow-sm">
                  <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Submission Rate</span>
                  <span className="text-lg font-bold text-quran mt-0.5 block">{childData.summary.submissionRate}%</span>
                </Card>
                <Card className="p-3 text-center border border-cream-200 shadow-sm">
                  <span className="text-[10px] text-ink-soft block font-semibold uppercase tracking-wider">Overdue</span>
                  <span className={`text-lg font-bold mt-0.5 block ${childData.summary.overdue > 0 ? 'text-error font-extrabold animate-pulse' : 'text-night-900'}`}>{childData.summary.overdue}</span>
                </Card>
              </div>

              {/* Recent Homeworks list */}
              {childData.recent.length > 0 && (
                <Card className="p-0 border border-cream-200 overflow-hidden shadow-sm">
                  <div className="border-b border-cream-100 bg-cream-50/50 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-night-900">Recent Assignments</span>
                  </div>
                  <ul className="divide-y divide-cream-100">
                    {childData.recent.map((item) => (
                      <li key={item.homework.id} className="px-4 py-3 text-xs flex items-center justify-between hover:bg-cream-50/30 transition-all">
                        <div>
                          <p className="font-semibold text-night-900">{item.homework.title}</p>
                          <p className="text-[10px] text-ink-soft mt-0.5">Due: {formatCalendarDate(item.homework.dueDate)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusChip chip={item.status === "GRADED" ? (item.isLate ? "GRADED_LATE" : "GRADED") : (item.isLate ? "SUBMITTED_LATE" : "SUBMITTED")} />
                          {item.status === "GRADED" && item.homework.maxScore !== null && (
                            <span className="font-bold text-success text-xs shrink-0">{item.score} / {item.homework.maxScore}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          ))}
        </section>
      )}

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
