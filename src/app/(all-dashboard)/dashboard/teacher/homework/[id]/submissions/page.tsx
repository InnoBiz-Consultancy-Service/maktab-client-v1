import { getHomeworkSubmissions } from "@/actions/homework";
import { Button, Card } from "@/components/ui";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import { ArrowLeft, Clock, Calendar, CheckSquare, GraduationCap, UserX, ClipboardList } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionsRosterPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getHomeworkSubmissions(id);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load submissions. Please try again.
        </Card>
      </div>
    );
  }

  const { homework, summary, results } = result.data;

  // Percentage calculations
  const submissionRate = summary.totalAssigned > 0 
    ? Math.round((summary.submitted / summary.totalAssigned) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/teacher/homework"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-night-900">Submission Roster</h1>
          <p className="text-sm text-ink-soft">Grade work and monitor progress for this homework assignment.</p>
        </div>
      </div>

      {/* Homework Info & Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Homework Info */}
        <Card className="md:col-span-2 p-6 border border-cream-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-quran bg-quran-soft px-2 py-0.5 rounded">
              {homework.batch.name}
            </span>
            <span className="text-xs font-semibold text-ink-soft flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Due: {homework.dueDate}
            </span>
          </div>
          <h2 className="text-xl font-bold text-night-900">{homework.title}</h2>
          <p className="text-sm text-ink-soft line-clamp-3">{homework.instruction}</p>
        </Card>

        {/* Progress Chart */}
        <Card className="p-6 border border-cream-200 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-night-900 mb-2">Submission Progress</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-quran">{submissionRate}%</span>
              <span className="text-xs text-ink-soft">
                ({summary.submitted}/{summary.totalAssigned} submitted)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-cream-200 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-quran h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${submissionRate}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-cream-100 pt-3 mt-4">
            <div>
              <span className="block text-sm font-bold text-success">{summary.graded}</span>
              <span className="text-[10px] text-ink-soft">Graded</span>
            </div>
            <div>
              <span className="block text-sm font-bold text-warn">{summary.late}</span>
              <span className="text-[10px] text-ink-soft">Late</span>
            </div>
            <div>
              <span className="block text-sm font-bold text-ink-soft">{summary.notSubmitted}</span>
              <span className="text-[10px] text-ink-soft">Pending</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Roster Table */}
      <Card className="border border-cream-200 shadow-soft overflow-hidden p-0">
        <div className="border-b border-cream-200 bg-cream-50 px-6 py-4">
          <h3 className="font-bold text-night-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-quran" />
            <span>Roster & Grades</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50 text-xs font-bold text-ink-soft uppercase tracking-wider">
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Submitted At</th>
                <th className="px-6 py-3.5 text-center">Score</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 text-sm text-ink">
              {results.map((row) => {
                const canGrade = row.submissionId !== null;
                const formattedDate = row.submittedAt 
                  ? new Date(row.submittedAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—";

                return (
                  <tr key={row.assignmentId} className="hover:bg-cream-50/30 transition-all">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-night-900">{row.student.name}</div>
                      <div className="text-xs text-ink-soft">{row.student.studentCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusChip
                        status={row.status}
                        isLate={row.isLate}
                        dueDate={homework.dueDate}
                      />
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-soft">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 text-center font-display font-semibold">
                      {row.status === "GRADED" ? (
                        homework.maxScore !== null ? (
                          <span className="text-success">{row.score} / {homework.maxScore}</span>
                        ) : (
                          <span className="text-success">Complete</span>
                        )
                      ) : row.status === "SUBMITTED" ? (
                        <span className="text-warn text-xs bg-warn/10 px-2 py-0.5 rounded">Awaiting Grade</span>
                      ) : (
                        <span className="text-ink-soft/40">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canGrade ? (
                        <Link
                          href={`/dashboard/teacher/homework/submissions/${row.submissionId}`}
                          className={row.status === "GRADED"
                            ? "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-transparent text-night-900 border border-cream-200 hover:bg-cream-50 min-h-[38px] px-4 text-sm"
                            : "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-gold-500 text-night-900 shadow-soft hover:shadow-[0_0_28px_rgba(245,184,51,0.4)] min-h-[38px] px-4 text-sm"
                          }
                        >
                          {row.status === "GRADED" ? "Edit Grade" : "Grade"}
                        </Link>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="opacity-40">
                          Unavailable
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
