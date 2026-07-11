import { getSession } from "@/lib/api/cookies";
import { getTeacherOverviewAction } from "@/actions/teacher/overview";
import { Card } from "@/components/ui";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard/TeacherDashboard";

export default async function TeacherPage() {
  const session = await getSession();
  const res = await getTeacherOverviewAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  return (
    <TeacherDashboard name={session?.label ?? "Ustadh"} overview={res.data} />
  );
}
