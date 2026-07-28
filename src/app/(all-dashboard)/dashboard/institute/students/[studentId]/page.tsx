import Link from "next/link";
import { ArrowLeft, User, Phone, BookOpen, Calendar, Award } from "lucide-react";
import { Card } from "@/components/ui";
import { getInstituteStudentDetailAction } from "@/actions/dashboard/institute-dashboard";
import { ProgressGauges } from "@/components/dashboard/shared/ProgressGauges";
import { PointsBreakdownCard } from "@/components/dashboard/shared/PointsBreakdownCard";

export default async function InstituteStudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const res = await getInstituteStudentDetailAction(studentId);

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dashboard/institute/students"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gold-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Students
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
        href="/dashboard/institute/students"
        className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Students
      </Link>

      {/* Header Profile */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-quran-soft font-display text-2xl font-bold text-quran">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-night-900">{profile.name}</h1>
                <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-semibold text-night-900">
                  {profile.studentCode}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                {profile.class} • Joined {profile.joinDate ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 rounded-xl bg-gold-500/10 p-3 text-right">
            <span className="text-xs font-medium text-ink-soft">Total Points</span>
            <span className="font-display text-2xl font-bold text-night-900">
              {points} pts
            </span>
          </div>
        </div>

        {/* Parent & Teacher Meta */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-cream-200 pt-4 sm:grid-cols-3">
          <div>
            <span className="text-xs text-ink-soft">Batch</span>
            <p className="text-sm font-semibold text-night-900">
              {profile.batches?.map((b) => b.name).join(", ") || "Unassigned"}
            </p>
          </div>
          <div>
            <span className="text-xs text-ink-soft">Teacher</span>
            <p className="text-sm font-semibold text-night-900">
              {profile.teacher?.name || "Unassigned"}
            </p>
          </div>
          <div>
            <span className="text-xs text-ink-soft">Parent</span>
            <p className="text-sm font-semibold text-night-900">
              {profile.parent?.name || "N/A"}{" "}
              {profile.parent?.phone && `(${profile.parent.phone})`}
            </p>
          </div>
        </div>
      </Card>

      {/* Progress Gauges */}
      <ProgressGauges progress={progressRates} title="Student Progress Breakdown" />

      {/* Points Breakdown */}
      <PointsBreakdownCard points={points} breakdown={pointsBreakdown} />

      {/* Record Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <span className="text-xs font-medium text-ink-soft">Lessons</span>
          <p className="mt-1 text-xl font-bold text-night-900">
            {progress?.lesson?.completed ?? 0} / {progress?.lesson?.total ?? 0}
          </p>
          <span className="text-xs text-gold-600">Completed Rate: {progress?.lesson?.rate ?? 0}%</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-ink-soft">Homework</span>
          <p className="mt-1 text-xl font-bold text-night-900">
            {progress?.homework?.submitted ?? 0} / {progress?.homework?.total ?? 0}
          </p>
          <span className="text-xs text-arabic">On-Time: {progress?.homework?.onTime ?? 0} | Avg: {progress?.homework?.avgScore ?? 0}</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-ink-soft">Attendance</span>
          <p className="mt-1 text-xl font-bold text-night-900">
            {progress?.attendance?.present ?? 0} Present
          </p>
          <span className="text-xs text-quran">Late: {progress?.attendance?.late ?? 0} | Absent: {progress?.attendance?.absent ?? 0}</span>
        </Card>
      </div>
    </div>
  );
}
