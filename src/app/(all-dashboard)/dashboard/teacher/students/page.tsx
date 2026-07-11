import { getTeacherOverviewAction } from "@/actions/teacher/overview";
import { PreviewBanner } from "@/components/teacher/PreviewBanner/PreviewBanner";
import { StudentRow } from "@/components/teacher/student/StudentRow";
import { Card } from "@/components/ui";

export default async function MyStudentsPage() {
  const res = await getTeacherOverviewAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const { students } = res.data;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">My students</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {students.length} students in your classes. They&rsquo;re linked to
          you automatically through the class you teach.
        </p>
      </header>

      <PreviewBanner what="Student progress" />

      <Card className="p-0">
        <ul className="divide-y divide-cream-200">
          {students.map((s) => (
            <StudentRow key={s.id} student={s} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
