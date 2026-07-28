import Link from "next/link";
import {
  UserPlus,
  GraduationCap,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui";
import { getInstituteTeachersDashboardAction } from "@/actions/dashboard/institute-dashboard";

export default async function TeachersDashboardPage() {
  const res = await getInstituteTeachersDashboardAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const teachers = res.data || [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900">
            Teachers Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {teachers.length} teachers and assignment activity
          </p>
        </div>
        <Link
          href="/dashboard/institute/teachers/new"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02]"
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          <span>Add teacher</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {teachers.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-arabic-soft font-display text-base font-bold text-arabic">
                  {t.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/institute/teachers/${t.id}`}
                      className="font-display text-lg font-bold text-night-900 hover:text-gold-600 hover:underline"
                    >
                      {t.name}
                    </Link>
                    <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs text-ink-soft">
                      {t.jobTitle || "Teacher"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft">
                    Phone: {t.phone || "N/A"} • Total Students:{" "}
                    {t.totalStudents}
                  </p>
                </div>
              </div>

              <Link
                href={`/dashboard/institute/teachers/${t.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline"
              >
                View Activity & Detail <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Activity metrics */}
            {t.activity && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-cream-200 pt-3 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-ink-soft">Published Homeworks</span>
                  <p className="font-bold text-night-900">
                    {t.activity.homeworksPublished}
                  </p>
                </div>
                <div>
                  <span className="text-ink-soft">Draft Homeworks</span>
                  <p className="font-bold text-night-900">
                    {t.activity.homeworksDraft}
                  </p>
                </div>
                <div>
                  <span className="text-ink-soft">Submission Rate</span>
                  <p className="font-bold text-night-900">
                    {t.activity.homeworkSubmissionRate}%
                  </p>
                </div>
                <div>
                  <span className="text-ink-soft">Last Homework</span>
                  <p className="font-bold text-night-900">
                    {t.activity.lastHomeworkAt
                      ? `${t.activity.daysSinceLastHomework}d ago`
                      : "Never"}
                  </p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
