import { getStudentOverviewAction } from "@/actions/student/overview";
import { JourneyPath } from "@/components/student/JourneyPath/JourneyPath";
import { Card } from "@/components/ui";

export default async function LearnPage() {
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

  const { lessons, counts } = res.data;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-2 text-center">
        <h1 className="font-display text-2xl font-bold text-night-900">
          Your journey
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {counts.completed} of {counts.total} lessons complete
        </p>
      </header>

      {/* Overall progress */}
      <div className="mx-auto mb-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-cream-200">
        <div
          className="h-full rounded-full bg-gold-500 transition-all"
          style={{ width: `${(counts.completed / counts.total) * 100}%` }}
        />
      </div>

      <JourneyPath lessons={lessons} />
    </div>
  );
}
