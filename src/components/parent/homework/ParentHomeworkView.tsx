"use client";

import { useState } from "react";
import { ParentHomeworkData } from "@/actions/homework";
import { Card, Button } from "@/components/ui";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import {
  Calendar,
  Award,
  User,
  BookOpen,
  MessageSquare,
  X,
  CheckCircle2,
  FileText,
  ChevronRight,
  Clock,
} from "lucide-react";
import { formatCalendarDate } from "@/lib/utils/date";

interface ParentHomeworkViewProps {
  data: ParentHomeworkData;
  initialChildId?: string;
}

export function ParentHomeworkView({
  data,
  initialChildId,
}: ParentHomeworkViewProps) {
  const { children, results } = data;

  // Active child state
  const [selectedChildId, setSelectedChildId] = useState(
    initialChildId || (children.length > 0 ? children[0].id : ""),
  );

  // Active modal state for detail view
  const [modalItem, setModalItem] = useState<any | null>(null);

  const selectedChild = children.find((c) => c.id === selectedChildId);

  // Filter homework results for selected child
  const childResults = results.filter((r) => {
    if (children.length <= 1) return true;
    if (!selectedChildId) return true;

    const rStudentId =
      r?.student?.id ||
      r?.studentId ||
      r?.childId ||
      r?.child_id ||
      (typeof r?.student === "string" ? r?.student : null);
    if (
      rStudentId &&
      selectedChildId &&
      String(rStudentId).trim() === String(selectedChildId).trim()
    )
      return true;

    const rCode = r?.student?.studentCode || r?.studentCode || r?.code;
    if (
      rCode &&
      selectedChild?.studentCode &&
      String(rCode).trim() === String(selectedChild.studentCode).trim()
    )
      return true;

    const rName = r?.student?.name || r?.studentName || r?.name;
    if (
      rName &&
      selectedChild?.name &&
      rName.trim().toLowerCase() === selectedChild.name.trim().toLowerCase()
    )
      return true;

    return true;
  });

  const showSwitcher = children.length > 1;

  // Summary Metrics calculations
  const totalAssigned = childResults.length;
  const totalSubmitted = childResults.filter(
    (r) =>
      r?.status === "SUBMITTED" ||
      r?.status === "GRADED" ||
      r?.submittedAt ||
      r?.submissionId,
  ).length;
  const totalGraded = childResults.filter((r) => r?.status === "GRADED").length;
  const totalPending = totalAssigned - totalSubmitted;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-night-900 sm:text-3xl">
            Children's Homework
          </h1>
          <p className="text-sm text-ink-soft">
            Track assignments, grades, and teacher feedback for your children.
          </p>
        </div>

        {/* Child Switcher (Visible only if children.length > 1) */}
        {showSwitcher && (
          <div className="flex w-fit rounded-full border border-cream-200 bg-cream-200/50 p-1.5">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 font-display text-xs font-bold transition-all ${
                  selectedChildId === child.id
                    ? "bg-gold-500 text-night-900 shadow-sm"
                    : "text-ink hover:text-gold-600"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>{child.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Child Summary Banner & Overview Cards */}
      {selectedChild && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-night-800 bg-night-900 p-5 text-cream-50 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-night-700 bg-night-800 p-2.5 text-gold-500">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider text-cream-100/60 uppercase">
                  Active Profile
                </p>
                <h2 className="text-lg font-bold">
                  {selectedChild?.name ||
                    (selectedChild as any)?.user?.name ||
                    (selectedChild as any)?.studentName ||
                    "Student Profile"}
                </h2>
              </div>
            </div>
            <span className="rounded border border-night-700 bg-night-800 px-3 py-1 text-xs font-semibold text-cream-100">
              Student Code:{" "}
              {selectedChild?.studentCode ||
                (selectedChild as any)?.code ||
                (selectedChild as any)?.student_code ||
                (selectedChild as any)?.id ||
                "—"}
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="border border-cream-200 p-4 text-center shadow-soft">
              <span className="block text-xs font-semibold tracking-wider text-ink-soft uppercase">
                Total Assigned
              </span>
              <span className="mt-1 block font-display text-2xl font-black text-night-900">
                {totalAssigned}
              </span>
            </Card>
            <Card className="border border-cream-200 p-4 text-center shadow-soft">
              <span className="block text-xs font-semibold tracking-wider text-ink-soft uppercase">
                Submitted
              </span>
              <span className="mt-1 block font-display text-2xl font-black text-quran">
                {totalSubmitted}
              </span>
            </Card>
            <Card className="border border-cream-200 p-4 text-center shadow-soft">
              <span className="block text-xs font-semibold tracking-wider text-ink-soft uppercase">
                Graded
              </span>
              <span className="mt-1 block font-display text-2xl font-black text-success">
                {totalGraded}
              </span>
            </Card>
            <Card className="border border-cream-200 p-4 text-center shadow-soft">
              <span className="block text-xs font-semibold tracking-wider text-ink-soft uppercase">
                Pending Work
              </span>
              <span className="mt-1 block font-display text-2xl font-black text-warn">
                {totalPending}
              </span>
            </Card>
          </div>
        </div>
      )}

      {/* Homework List */}
      {childResults.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center shadow-soft">
          <BookOpen className="h-12 w-12 text-ink-soft/40" />
          <h3 className="mt-4 font-display text-lg font-bold text-night-900">
            No homework assigned
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            There are currently no active homework assignments for this child.
          </p>
        </Card>
      ) : (
        <div className="grid max-w-4xl gap-4">
          {(childResults || []).map((row: any, idx: number) => {
            const hwObj =
              row?.homework && typeof row.homework === "object"
                ? row.homework
                : null;
            const asgObj =
              row?.assignment && typeof row.assignment === "object"
                ? row.assignment
                : null;

            // Safe title resolution (NEVER fall through to student name!)
            const title: string =
              hwObj?.title ||
              asgObj?.title ||
              row?.homeworkTitle ||
              row?.assignmentTitle ||
              row?.title ||
              "Homework Assignment";

            const instruction: string =
              hwObj?.instruction ||
              asgObj?.instruction ||
              row?.instruction ||
              row?.description ||
              "";
            const dueDate: string | undefined =
              hwObj?.dueDate ||
              asgObj?.dueDate ||
              row?.dueDate ||
              row?.due_date;
            const maxScore: number | null | undefined =
              hwObj?.maxScore ??
              asgObj?.maxScore ??
              row?.maxScore ??
              row?.max_score;
            const batchName: string | undefined =
              hwObj?.batch?.name ||
              asgObj?.batch?.name ||
              row?.batch?.name ||
              row?.batchName ||
              row?.batch_name;
            const teacherName: string | undefined =
              hwObj?.teacher?.name ||
              asgObj?.teacher?.name ||
              row?.teacher?.name ||
              row?.teacherName ||
              row?.teacher_name;
            const status: string =
              row?.status || hwObj?.status || "NOT_SUBMITTED";
            const isGraded: boolean = status === "GRADED";
            const score: number | null = row?.score ?? hwObj?.score ?? null;
            const feedback: string | null =
              row?.feedback ?? hwObj?.feedback ?? null;
            const chip: any =
              row?.chip ||
              (isGraded
                ? "GRADED"
                : status === "SUBMITTED"
                  ? "SUBMITTED"
                  : "NOT_SUBMITTED");
            const assignmentId: string =
              row?.assignmentId || row?.id || `hw_${idx}`;
            const itemData = {
              title,
              instruction,
              dueDate,
              maxScore,
              batchName,
              teacherName,
              status,
              score,
              feedback,
              chip,
              assignmentId,
            };

            return (
              <Card
                key={assignmentId}
                onClick={() => setModalItem(itemData)}
                className="group cursor-pointer space-y-4 border border-cream-200 p-5 shadow-soft transition-all hover:border-gold-400 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-3 border-b border-cream-100 pb-3 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    {batchName && (
                      <span className="rounded-full bg-quran-soft px-2.5 py-0.5 text-xs font-semibold text-quran">
                        {batchName}
                      </span>
                    )}
                    <StatusChip chip={chip} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                    <Calendar className="h-3.5 w-3.5 text-gold-600" />
                    <span>
                      Due: {dueDate ? formatCalendarDate(dueDate) : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="font-display text-lg font-bold text-night-900 transition-colors group-hover:text-gold-600">
                      {title}
                    </h3>
                    {instruction && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
                        {instruction}
                      </p>
                    )}
                    {teacherName && (
                      <p className="pt-1 text-xs text-ink-soft/80">
                        Assigned by:{" "}
                        <strong className="font-semibold text-night-900">
                          {teacherName}
                        </strong>
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-4 self-end sm:self-start">
                    <div className="text-right">
                      {isGraded ? (
                        <div>
                          <span className="block text-[10px] font-semibold tracking-wider text-ink-soft uppercase">
                            Grade
                          </span>
                          <span className="font-display text-lg font-extrabold text-success">
                            {score !== null ? score : "—"}{" "}
                            {maxScore ? `/ ${maxScore}` : ""}
                          </span>
                        </div>
                      ) : status === "SUBMITTED" ? (
                        <span className="inline-block rounded-full border border-warn/20 bg-warn/10 px-3 py-1 text-xs font-semibold text-warn">
                          Awaiting Grade
                        </span>
                      ) : (
                        <span className="border-cream-300/40 inline-block rounded-full border bg-cream-200/60 px-3 py-1 text-xs font-semibold text-ink-soft">
                          Pending Work
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-ink-soft/40 transition-all group-hover:translate-x-1 group-hover:text-gold-500" />
                  </div>
                </div>

                {isGraded && feedback && (
                  <div className="border-t border-cream-100 pt-3">
                    <div className="flex items-start gap-2.5 rounded-lg border border-cream-200/80 bg-cream-50/80 p-3">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-quran" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-night-900">
                          Teacher's Feedback Note
                        </p>
                        <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft italic">
                          "{feedback}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Homework Detail Modal */}
      {modalItem && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-night-900/60 p-4 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-xl space-y-0 overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between bg-night-900 p-6 text-cream-50">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  {modalItem.batchName && (
                    <span className="rounded-full border border-night-700 bg-night-800 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-gold-500 uppercase">
                      {modalItem.batchName}
                    </span>
                  )}
                  <StatusChip chip={modalItem.chip} />
                </div>
                <h2 className="mt-2 font-display text-xl font-bold text-cream-50">
                  {modalItem.title}
                </h2>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="shrink-0 rounded-full bg-night-800 p-1.5 text-cream-100/60 transition-colors hover:text-cream-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6">
              {/* Due Date & Teacher Info */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-cream-200 bg-cream-100/50 p-4 text-xs">
                <div>
                  <span className="block font-semibold tracking-wider text-ink-soft uppercase">
                    Due Date
                  </span>
                  <span className="mt-0.5 block flex items-center gap-1.5 text-sm font-bold text-night-900">
                    <Calendar className="h-4 w-4 text-gold-600" />
                    {modalItem.dueDate
                      ? formatCalendarDate(modalItem.dueDate)
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold tracking-wider text-ink-soft uppercase">
                    Assigned By
                  </span>
                  <span className="mt-0.5 block flex items-center gap-1.5 text-sm font-bold text-night-900">
                    <User className="h-4 w-4 text-quran" />
                    {modalItem.teacherName || "Teacher"}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="font-display text-xs font-bold tracking-wider text-night-900 uppercase">
                  Assignment Instructions
                </h4>
                <div className="rounded-xl border border-cream-200/80 bg-cream-100/30 p-4 text-sm leading-relaxed whitespace-pre-wrap text-ink">
                  {modalItem.instruction ||
                    "No specific instructions provided for this assignment."}
                </div>
              </div>

              {/* Grade & Feedback Section */}
              {modalItem.status === "GRADED" ? (
                <div className="space-y-3 rounded-xl border border-success/20 bg-success/5 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-display text-xs font-bold tracking-wider text-success uppercase">
                      <Award className="h-4 w-4" />
                      Grade Evaluation
                    </span>
                    <span className="font-display text-xl font-extrabold text-success">
                      {modalItem.score !== null ? modalItem.score : "—"}{" "}
                      {modalItem.maxScore ? `/ ${modalItem.maxScore}` : ""}
                    </span>
                  </div>

                  {modalItem.feedback && (
                    <div className="space-y-1 rounded-lg border border-success/20 bg-cream-50 p-4">
                      <p className="text-xs font-bold text-night-900">
                        Teacher's Note & Feedback
                      </p>
                      <p className="text-xs leading-relaxed whitespace-pre-wrap text-ink-soft italic">
                        "{modalItem.feedback}"
                      </p>
                    </div>
                  )}
                </div>
              ) : modalItem.status === "SUBMITTED" ? (
                <div className="flex items-center gap-3 rounded-xl border border-warn/20 bg-warn/10 p-4 text-xs text-warn">
                  <Clock className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-night-900">
                      Homework Submitted
                    </p>
                    <p className="mt-0.5 text-ink-soft">
                      Work is currently awaiting grading from the teacher.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-cream-300/40 flex items-center gap-3 rounded-xl border bg-cream-200/50 p-4 text-xs text-ink-soft">
                  <FileText className="h-5 w-5 shrink-0 text-ink-soft/60" />
                  <div>
                    <p className="text-sm font-bold text-night-900">
                      Pending Submission
                    </p>
                    <p className="mt-0.5 text-ink-soft">
                      Child has not submitted work for this assignment yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-cream-200 bg-cream-100/50 p-4">
              <Button
                onClick={() => setModalItem(null)}
                variant="night"
                size="sm"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
