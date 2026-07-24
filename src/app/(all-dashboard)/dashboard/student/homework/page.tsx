import { getStudentHomeworks } from "@/actions/homework";
import { Button, Card } from "@/components/ui";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import { BookOpen, Calendar, ChevronRight, Award } from "lucide-react";
import Link from "next/link";

export default async function StudentHomeworkListPage() {
  // For mock development, we'll default to student "stu_01" (Rahim Uddin)
  const studentId = "stu_01";
  const result = await getStudentHomeworks(studentId);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load your homework assignments. Please try again.
        </Card>
      </div>
    );
  }

  const assignments = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-night-900 sm:text-3xl">My Homework</h1>
        <p className="text-sm text-ink-soft">View assignments, submit your work, and review grading feedback.</p>
      </div>

      {assignments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center shadow-soft">
          <BookOpen className="h-12 w-12 text-ink-soft/40" />
          <h3 className="mt-4 text-lg font-bold text-night-900">No homework yet</h3>
          <p className="mt-1 text-sm text-ink-soft">
            You don't have any homework assigned to you right now. Take a break!
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 max-w-4xl">
          {assignments.map((asg) => {
            const hw = asg.homework;
            return (
              <Link key={asg.assignmentId} href={`/dashboard/student/homework/${hw.id}`} className="block group">
                <Card className="border border-cream-200 shadow-soft group-hover:border-gold-500/50 transition-all p-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-quran bg-quran-soft px-2 py-0.5 rounded">
                        {hw.batch.name}
                      </span>
                      <StatusChip
                        status={asg.status}
                        isLate={asg.isLate}
                        dueDate={hw.dueDate}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-night-900 group-hover:text-gold-600 transition-colors">
                      {hw.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-ink-soft">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Due: {hw.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" /> {hw.maxScore !== null ? `Score: ${hw.maxScore} max` : "Ungraded / Completion"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    {asg.status === "GRADED" && (
                      <div className="text-right">
                        <span className="text-xs text-ink-soft block">Grade</span>
                        <span className="text-base font-extrabold text-success">
                          {hw.maxScore !== null ? `${asg.score} / ${hw.maxScore}` : "Complete"}
                        </span>
                      </div>
                    )}
                    <ChevronRight className="h-5 w-5 text-ink-soft group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
