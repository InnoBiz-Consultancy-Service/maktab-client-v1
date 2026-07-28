import { Card, Spinner } from "@/components/ui";

export default function TeacherSubmissionsRosterLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-4 w-12 animate-pulse rounded bg-cream-200" />
        <div>
          <div className="mb-1 h-7 w-48 animate-pulse rounded bg-cream-200" />
          <div className="h-4 w-64 animate-pulse rounded bg-cream-100" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="space-y-3 border border-cream-200 p-6 shadow-soft md:col-span-2">
          <div className="h-4 w-32 animate-pulse rounded bg-quran-soft" />
          <div className="h-7 w-3/4 animate-pulse rounded bg-night-900/10" />
          <div className="h-12 w-full animate-pulse rounded bg-cream-100" />
        </Card>

        <Card className="flex flex-col justify-between border border-cream-200 p-6 shadow-soft">
          <div className="mb-3 h-4 w-28 animate-pulse rounded bg-cream-200" />
          <div className="mb-2 h-8 w-20 animate-pulse rounded bg-quran/20" />
          <div className="h-2.5 w-full rounded-full bg-cream-200" />
        </Card>
      </div>

      <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center shadow-soft">
        <Spinner className="h-8 w-8 text-gold-500" />
        <p className="text-sm font-semibold text-night-900">
          Loading submissions roster...
        </p>
      </Card>
    </div>
  );
}
