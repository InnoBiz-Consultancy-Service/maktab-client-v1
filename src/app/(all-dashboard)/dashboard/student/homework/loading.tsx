import { Card, Spinner } from "@/components/ui";

export default function StudentHomeworkListLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 h-8 w-44 animate-pulse rounded bg-night-900/10" />
          <div className="h-4 w-72 animate-pulse rounded bg-cream-200" />
        </div>
      </div>

      <Card className="p-4 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-10 w-full animate-pulse rounded-full bg-cream-100" />
          <div className="h-10 w-full animate-pulse rounded-full bg-cream-100 sm:col-span-2" />
        </div>
      </Card>

      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner className="h-8 w-8 text-gold-500" />
          <p className="text-sm font-medium text-ink-soft">
            Loading assignments...
          </p>
        </div>
      </div>
    </div>
  );
}
