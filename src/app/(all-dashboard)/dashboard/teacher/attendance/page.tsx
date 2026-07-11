import { getTeacherOverviewAction } from "@/actions/teacher/overview";
import { AttendanceSheet } from "@/components/teacher/Attendance/AttendanceSheet";
import { PreviewBanner } from "@/components/teacher/PreviewBanner/PreviewBanner";
import { Card } from "@/components/ui";

export default async function TeacherAttendancePage() {
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
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">Attendance</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {today} · everyone starts as present, just tap the exceptions.
        </p>
      </header>

      <PreviewBanner what="Attendance" />

      <AttendanceSheet students={students} />
    </div>
  );
}
