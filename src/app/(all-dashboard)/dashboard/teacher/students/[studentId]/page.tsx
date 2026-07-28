import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui";
import { getTeacherStudentDetailAction } from "@/actions/dashboard/teacher-dashboard";
import { ProgressGauges } from "@/components/dashboard/shared/ProgressGauges";
import { PointsBreakdownCard } from "@/components/dashboard/shared/PointsBreakdownCard";

export default async function TeacherStudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const res = await getTeacherStudentDetailAction(studentId);

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/dashboard/teacher/students"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gold-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Students
        </Link>
        <Card className="py-12 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const { profile, progress, points, pointsBreakdown } = res.data;

  const progressRates = {
    lessonCompletionRate: progress?.lesson?.rate ?? 0,
    homeworkSubmissionRate: progress?.homework?.rate ?? 0,
    attendanceRate: progress?.attendance?.rate ?? 0,
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link
        href="/dashboard/teacher/students"
        className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Students
      </Link>

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-arabic-soft font-display text-2xl font-bold text-arabic">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-night-900">{profile.name}</h1>
                <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-night-900">
                  {profile.studentCode}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{profile.class}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1 rounded-xl bg-gold-500/10 p-3 text-right">
            <span className="text-xs font-medium text-ink-soft">Total Points</span>
            <span className="font-display text-2xl font-bold text-night-900">
              {points} pts
            </span>
          </div>
        </div>
      </Card>

      <ProgressGauges progress={progressRates} title="Student Progress" />
      <PointsBreakdownCard points={points} breakdown={pointsBreakdown} />
    </div>
  );
}
