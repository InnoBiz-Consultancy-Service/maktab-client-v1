import { Card, Spinner } from "@/components/ui";

export default function TeacherSubmissionsRosterLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-4 w-12 bg-cream-200 animate-pulse rounded" />
        <div>
          <div className="h-7 w-48 bg-cream-200 animate-pulse rounded mb-1" />
          <div className="h-4 w-64 bg-cream-100 animate-pulse rounded" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 p-6 border border-cream-200 shadow-soft space-y-3">
          <div className="h-4 w-32 bg-quran-soft animate-pulse rounded" />
          <div className="h-7 w-3/4 bg-night-900/10 animate-pulse rounded" />
          <div className="h-12 w-full bg-cream-100 animate-pulse rounded" />
        </Card>

        <Card className="p-6 border border-cream-200 shadow-soft flex flex-col justify-between">
          <div className="h-4 w-28 bg-cream-200 animate-pulse rounded mb-3" />
          <div className="h-8 w-20 bg-quran/20 animate-pulse rounded mb-2" />
          <div className="h-2.5 w-full bg-cream-200 rounded-full" />
        </Card>
      </div>

      <Card className="p-12 text-center shadow-soft flex flex-col items-center justify-center gap-3">
        <Spinner className="h-8 w-8 text-gold-500" />
        <p className="text-sm font-semibold text-night-900">Loading submissions roster...</p>
      </Card>
    </div>
  );
}
