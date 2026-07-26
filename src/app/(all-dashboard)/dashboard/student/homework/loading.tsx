import { Card, Spinner } from "@/components/ui";

export default function StudentHomeworkListLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="h-8 w-44 bg-night-900/10 animate-pulse rounded mb-2" />
          <div className="h-4 w-72 bg-cream-200 animate-pulse rounded" />
        </div>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-10 w-full bg-cream-100 animate-pulse rounded-full" />
          <div className="h-10 w-full bg-cream-100 animate-pulse rounded-full sm:col-span-2" />
        </div>
      </Card>

      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner className="h-8 w-8 text-gold-500" />
          <p className="text-sm font-medium text-ink-soft">Loading assignments...</p>
        </div>
      </div>
    </div>
  );
}
