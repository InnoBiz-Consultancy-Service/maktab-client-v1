import Link from "next/link";
import { ArrowLeft, GraduationCap, Phone, Layers, BookOpen } from "lucide-react";
import { Card } from "@/components/ui";
import { getInstituteTeacherDetailAction } from "@/actions/dashboard/institute-dashboard";
import { ProgressGauges } from "@/components/dashboard/shared/ProgressGauges";

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ teacherId: string }>;
}) {
  const { teacherId } = await params;
  const res = await getInstituteTeacherDetailAction(teacherId);

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/dashboard/institute/teachers"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gold-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Teachers
        </Link>
        <Card className="py-12 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const teacher = res.data;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link
        href="/dashboard/institute/teachers"
        className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Teachers
      </Link>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-arabic-soft font-display text-2xl font-bold text-arabic">
            {teacher.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-night-900">{teacher.name}</h1>
            <p className="text-sm text-ink-soft">
              {teacher.jobTitle || "Teacher"} • Phone: {teacher.phone || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-cream-200 pt-4 sm:grid-cols-3 text-sm">
          <div>
            <span className="text-xs text-ink-soft">Total Students</span>
            <p className="font-bold text-night-900">{teacher.totalStudents}</p>
          </div>
          <div>
            <span className="text-xs text-ink-soft">Assigned Batches</span>
            <p className="font-bold text-night-900">
              {teacher.batches?.map((b) => b.name).join(", ") || "None"}
            </p>
          </div>
          <div>
            <span className="text-xs text-ink-soft">Start Date</span>
            <p className="font-bold text-night-900">{teacher.startDate || "N/A"}</p>
          </div>
        </div>
      </Card>

      {/* Aggregate Student Progress */}
      {teacher.studentProgress && (
        <ProgressGauges
          progress={teacher.studentProgress}
          title="Aggregate Student Progress Across Batches"
        />
      )}

      {/* Activity Overview */}
      {teacher.activity && (
        <Card className="p-5">
          <h2 className="mb-4 font-display text-lg font-bold text-night-900">
            Teacher Activity Overview
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-3">
              <span className="text-xs text-ink-soft">Homeworks Published</span>
              <p className="text-xl font-bold text-night-900">
                {teacher.activity.homeworksPublished}
              </p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-3">
              <span className="text-xs text-ink-soft">Homeworks Draft</span>
              <p className="text-xl font-bold text-night-900">
                {teacher.activity.homeworksDraft}
              </p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-3">
              <span className="text-xs text-ink-soft">Lessons Published</span>
              <p className="text-xl font-bold text-night-900">
                {teacher.activity.lessonsPublished}
              </p>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-3">
              <span className="text-xs text-ink-soft">Lessons Created</span>
              <p className="text-xl font-bold text-night-900">
                {teacher.activity.lessonsCreated}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
