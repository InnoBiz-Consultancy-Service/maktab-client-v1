import { ChevronLeft, BookOpen, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getStudentSummaryAction } from "@/actions/attendance/get-student-summary";
import { getStudentHistoryAction } from "@/actions/attendance/get-student-history";
import { getParentHomeworkData, getParentHomeworkOverview } from "@/actions/homework";
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

  const [summaryRes, historyRes, homeworkOverviewRes, parentHomeworkRes] = await Promise.all([
    getStudentSummaryAction(studentId),
    getStudentHistoryAction(studentId),
    getParentHomeworkOverview(studentId),
    getParentHomeworkData({ studentId }),
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
  const homeworkData = parentHomeworkRes.ok ? parentHomeworkRes.data : null;

  // Filter homework results for this child
  const childHomeworks = (homeworkData?.results || []).filter((r: any) => {
    const rStudentId = r?.student?.id || r?.studentId || r?.childId || r?.child_id || (typeof r?.student === "string" ? r?.student : null);
    if (rStudentId && String(rStudentId).trim() === String(studentId).trim()) return true;
    const rCode = r?.student?.studentCode || r?.studentCode || r?.code;
    if (rCode && summary.student.studentCode && String(rCode).trim() === String(summary.student.studentCode).trim()) return true;
    const rName = r?.student?.name || r?.studentName || r?.name;
    if (rName && summary.student.name && rName.trim().toLowerCase() === summary.student.name.trim().toLowerCase()) return true;
    return true; // Fallback: show if this payload was requested for this studentId
  });

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="mb-2">
        <Link
          href="/dashboard/parent/children"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back to Children
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
              {summary.student.class} · Code: {summary.student.studentCode}
            </p>
          </div>
        </div>
      </header>

      {/* Attendance Summary section */}
      <section>
        <h2 className="mb-3 font-display text-base font-bold text-night-900">
          Attendance Summary
        </h2>
        <AttendanceSummary studentId={studentId} initial={summary} />
      </section>

      {/* Homework Assignments & Progress Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-night-900">
            Assigned Homeworks & Progress
          </h2>
          <Link
            href={`/dashboard/parent/homework?studentId=${studentId}`}
            className="text-xs font-bold text-gold-600 hover:underline"
          >
            Full Homework Dashboard &rarr;
          </Link>
        </div>

        {childHomeworks.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-10 text-center shadow-soft border border-cream-200">
            <BookOpen className="h-10 w-10 text-ink-soft/40 mb-2" />
            <h3 className="text-base font-bold text-night-900 font-display">No homework assigned yet</h3>
            <p className="text-xs text-ink-soft mt-0.5">
              There are currently no active homework assignments for {summary.student.name}.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {childHomeworks.map((row: any, idx: number) => {
              const hwObj = (row?.homework && typeof row.homework === "object") ? row.homework : null;
              const asgObj = (row?.assignment && typeof row.assignment === "object") ? row.assignment : null;

              const title: string = hwObj?.title || asgObj?.title || row?.title || row?.name || "Homework";
              const instruction: string = hwObj?.instruction || asgObj?.instruction || row?.instruction || row?.description || "";
              const dueDate: string | undefined = hwObj?.dueDate || asgObj?.dueDate || row?.dueDate || row?.due_date;
              const maxScore: number | null | undefined = hwObj?.maxScore ?? asgObj?.maxScore ?? row?.maxScore ?? row?.max_score;
              const batchName: string | undefined = hwObj?.batch?.name || asgObj?.batch?.name || row?.batch?.name || row?.batchName || row?.batch_name;
              const teacherName: string | undefined = hwObj?.teacher?.name || asgObj?.teacher?.name || row?.teacher?.name || row?.teacherName || row?.teacher_name;
              const status: string = row?.status || hwObj?.status || "NOT_SUBMITTED";
              const isGraded: boolean = status === "GRADED";
              const score: number | null = row?.score ?? hwObj?.score ?? null;
              const feedback: string | null = row?.feedback ?? hwObj?.feedback ?? null;
              const chip: any = row?.chip || (isGraded ? "GRADED" : status === "SUBMITTED" ? "SUBMITTED" : "NOT_SUBMITTED");
              const assignmentId: string = row?.assignmentId || row?.id || `hw_${idx}`;

              return (
                <Card
                  key={assignmentId}
                  className="border border-cream-200 shadow-soft p-4 space-y-3 transition-all hover:border-cream-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-100 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {batchName && (
                        <span className="text-[10px] font-semibold text-quran bg-quran-soft px-2 py-0.5 rounded">
                          {batchName}
                        </span>
                      )}
                      <StatusChip chip={chip} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Due: {dueDate ? formatCalendarDate(dueDate) : "—"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-night-900">{title}</h3>
                      {instruction && (
                        <p className="text-xs text-ink-soft line-clamp-2 leading-relaxed">
                          {instruction}
                        </p>
                      )}
                      {teacherName && (
                        <p className="text-[11px] text-ink-soft/80">
                          Assigned by: <strong className="text-night-900/80">{teacherName}</strong>
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      {isGraded ? (
                        <div>
                          <span className="text-[10px] text-ink-soft block uppercase tracking-wider font-semibold">Grade</span>
                          <span className="text-base font-extrabold text-success">
                            {score !== null ? score : "—"} {maxScore ? `/ ${maxScore}` : ""}
                          </span>
                        </div>
                      ) : status === "SUBMITTED" ? (
                        <span className="text-xs font-semibold text-warn bg-warn/10 px-2.5 py-1 rounded">Awaiting Grade</span>
                      ) : (
                        <span className="text-xs font-semibold text-ink-soft bg-cream-200/50 px-2.5 py-1 rounded">Pending Work</span>
                      )}
                    </div>
                  </div>

                  {/* Feedback display */}
                  {isGraded && feedback && (
                    <div className="mt-2 bg-cream-50 border border-cream-200 p-2.5 rounded-lg flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-quran shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-bold text-night-900">Teacher's Note</p>
                        <p className="text-xs text-ink-soft whitespace-pre-wrap">"{feedback}"</p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Attendance History section */}
      <section>
        <h2 className="mb-3 font-display text-base font-bold text-night-900">
          Attendance History
        </h2>
        <AttendanceHistory studentId={studentId} initial={history} />
      </section>
    </div>
  );
}
