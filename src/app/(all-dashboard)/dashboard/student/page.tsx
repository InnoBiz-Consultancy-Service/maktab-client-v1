import { getStudentOverviewAction } from "@/actions/student/overview";
import { getStudentHomeworkOverview } from "@/actions/homework";
import { StudentDashboard } from "@/components/student/StudentDashboard";
import { Card } from "@/components/ui";

export default async function StudentPage() {
  const [overviewRes, homeworkOverviewRes] = await Promise.all([
    getStudentOverviewAction(),
    getStudentHomeworkOverview(),
  ]);

  if (!overviewRes.ok) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {overviewRes.error}
        </Card>
      </div>
    );
  }

  const homeworkOverview = homeworkOverviewRes.ok
    ? homeworkOverviewRes.data
    : undefined;

  return (
    <StudentDashboard
      overview={overviewRes.data}
      homeworkOverview={homeworkOverview}
    />
  );
}
