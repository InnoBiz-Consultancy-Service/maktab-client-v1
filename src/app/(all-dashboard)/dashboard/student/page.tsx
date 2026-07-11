import { getStudentOverviewAction } from "@/actions/student/overview";
import { StudentDashboard } from "@/components/student/StudentDashboard";
import { Card } from "@/components/ui";

export default async function StudentPage() {
  const res = await getStudentOverviewAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  return <StudentDashboard overview={res.data} />;
}
