import { getRosterAction } from "@/actions/attendance/get-roster";
import { AttendanceRoster } from "@/components/teacher/Attendance/AttendanceRoster";
import { Card } from "@/components/ui";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ dayId: string }>;
}

export default async function RosterPage({ params }: Props) {
  const { dayId } = await params;
  const res = await getRosterAction(dayId);

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const { day, batch } = res.data;

  const formattedDate = new Date(day.date + "T00:00:00").toLocaleDateString(
    "en-GB",
    { weekday: "short", day: "numeric", month: "long" },
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-5">
        <Link
          href="/dashboard/teacher/attendance"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-night-900">{batch.name}</h1>
        <p className="mt-1 text-sm text-ink-soft">{formattedDate}</p>
      </header>

      <AttendanceRoster roster={res.data} />
    </div>
  );
}
