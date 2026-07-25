import { getSession } from "@/lib/api/cookies";
import { getTeacherOverviewAction } from "@/actions/teacher/overview";
import { getTeacherHomeworkOverview } from "@/actions/homework";
import { Card } from "@/components/ui";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard/TeacherDashboard";

export default async function TeacherPage() {
  const session = await getSession();
  
  const [generalOverviewRes, homeworkOverviewRes] = await Promise.all([
    getTeacherOverviewAction(),
    getTeacherHomeworkOverview(),
  ]);

  if (!generalOverviewRes.ok) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {generalOverviewRes.error}
        </Card>
      </div>
    );
  }

  const homeworkOverview = homeworkOverviewRes.ok ? homeworkOverviewRes.data : undefined;

  return (
    <TeacherDashboard 
      name={session?.label ?? "Ustadh"} 
      overview={generalOverviewRes.data} 
      homeworkOverview={homeworkOverview}
    />
  );
}
