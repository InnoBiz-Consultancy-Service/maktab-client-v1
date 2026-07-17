import { getTodayAction } from "@/actions/attendance/get-today";
import { TodayBatchList } from "@/components/teacher/Attendance/TodayBatchList";
import { Card } from "@/components/ui";

export default async function TeacherAttendancePage() {
  const res = await getTodayAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const { date, batches } = res.data;

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
    "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">Attendance</h1>
        <p className="mt-1 text-sm text-ink-soft">{formattedDate}</p>
      </header>

      <TodayBatchList batches={batches} />
    </div>
  );
}
