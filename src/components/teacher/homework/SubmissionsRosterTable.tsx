"use client";

import { useState, useTransition } from "react";
import { HomeworkSubmissionSummary } from "@/types/shared/homework";
import { Button, Card } from "@/components/ui";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import { bulkGradeSubmissions } from "@/actions/homework";
import { toast } from "sonner";
import { CheckSquare, Square, Check, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SubmissionsRosterTableProps {
  homeworkId: string;
  homework: HomeworkSubmissionSummary["homework"];
  results: HomeworkSubmissionSummary["results"];
}

export function SubmissionsRosterTable({ homeworkId, homework, results = [] }: SubmissionsRosterTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const isCompletionOnly = homework?.maxScore === null;
  const safeResults = results || [];

  // Filter out students who don't have submissions (cannot be graded)
  const gradableSubmissions = safeResults.filter((r) => r?.submissionId !== null && r?.submissionId !== undefined);

  const handleSelectAll = () => {
    if (selectedIds.length === gradableSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(gradableSubmissions.map((r) => r.submissionId!));
    }
  };

  const handleSelectRow = (submissionId: string) => {
    setSelectedIds((prev) =>
      prev.includes(submissionId) ? prev.filter((id) => id !== submissionId) : [...prev, submissionId]
    );
  };

  const handleBulkGrade = (isCompleted: boolean) => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      const grades = selectedIds.map((id) => ({
        submissionId: id,
        isCompleted,
        feedback: "Graded via bulk action.",
      }));

      const res = await bulkGradeSubmissions(grades);
      if (res.ok) {
        setSelectedIds([]);
        toast.success(res.message || "Bulk grading applied successfully!");
      } else {
        toast.error(res.error || "Failed to apply bulk grading.");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar (Visible only for completion-only and when selections exist) */}
      {isCompletionOnly && gradableSubmissions.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-cream-50/50 p-4 rounded-lg border border-cream-200">
          <div className="flex items-center gap-2 text-sm text-night-900 font-medium">
            <span>
              Selected <strong className="text-gold-600">{selectedIds.length}</strong> of{" "}
              <strong>{gradableSubmissions.length}</strong> gradable submission(s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="night"
              disabled={selectedIds.length === 0 || isPending}
              onClick={() => handleBulkGrade(true)}
              className="flex items-center gap-1.5"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              <span>Mark as Completed</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={selectedIds.length === 0 || isPending}
              onClick={() => handleBulkGrade(false)}
              className="flex items-center gap-1.5 border-cream-300 hover:border-gold-500 hover:text-gold-600"
            >
              <span>Mark as Incomplete</span>
            </Button>
          </div>
        </div>
      )}

      {/* Roster Table */}
      <Card className="border border-cream-200 shadow-soft overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50 text-xs font-bold text-ink-soft uppercase tracking-wider">
                {isCompletionOnly && (
                  <th className="px-6 py-3.5 w-12">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      disabled={gradableSubmissions.length === 0}
                      className="text-ink-soft hover:text-gold-500 transition-colors disabled:opacity-40"
                    >
                      {selectedIds.length === gradableSubmissions.length && gradableSubmissions.length > 0 ? (
                        <CheckSquare className="h-5 w-5 text-gold-500" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                )}
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Submitted At</th>
                {!isCompletionOnly && <th className="px-6 py-3.5 text-center">Score</th>}
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-sm text-ink">
              {safeResults.map((row) => {
                const canGrade = (row?.submissionId !== null && row?.submissionId !== undefined) || row?.status === "SUBMITTED" || row?.status === "GRADED";
                const activeSubmissionId = row?.submissionId || row?.assignmentId;
                const isSelected = activeSubmissionId ? selectedIds.includes(activeSubmissionId) : false;

                const formattedDate = row?.submittedAt
                  ? new Date(row.submittedAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—";

                return (
                  <tr
                    key={row?.assignmentId || row?.student?.id}
                    className={`hover:bg-cream-50/30 transition-all ${
                      isSelected ? "bg-gold-500/5 hover:bg-gold-500/10" : ""
                    }`}
                  >
                    {isCompletionOnly && (
                      <td className="px-6 py-4">
                        {canGrade ? (
                          <button
                            type="button"
                            onClick={() => handleSelectRow(row.submissionId!)}
                            className="text-ink-soft hover:text-gold-500 transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-5 w-5 text-gold-500" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                        ) : (
                          <Square className="h-5 w-5 opacity-20 pointer-events-none" />
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-night-900">{row?.student?.name || "Student"}</div>
                      <div className="text-xs text-ink-soft">{row?.student?.studentCode || ""}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusChip chip={row?.chip} />
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-soft">{formattedDate}</td>
                    {!isCompletionOnly && (
                      <td className="px-6 py-4 text-center font-display font-semibold">
                        {row?.status === "GRADED" ? (
                          <span className="text-success">
                            {row?.score} / {homework?.maxScore}
                          </span>
                        ) : row?.status === "SUBMITTED" ? (
                          <span className="text-warn text-xs bg-warn/10 px-2 py-0.5 rounded">Awaiting Grade</span>
                        ) : (
                          <span className="text-ink-soft/40">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 text-right">
                      {canGrade ? (
                        <Link
                          href={`/dashboard/teacher/homework/${homeworkId}/submissions/${activeSubmissionId}/grade`}
                          className={
                            row?.status === "GRADED"
                              ? "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-transparent text-night-900 border border-cream-200 hover:bg-cream-50 min-h-[38px] px-4 text-sm"
                              : "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-gold-500 text-night-900 shadow-soft hover:shadow-[0_0_28px_rgba(245,184,51,0.4)] min-h-[38px] px-4 text-sm"
                          }
                        >
                          {row?.status === "GRADED" ? "Edit Grade" : "Grade"}
                        </Link>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="opacity-40">
                          Not Submitted
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
