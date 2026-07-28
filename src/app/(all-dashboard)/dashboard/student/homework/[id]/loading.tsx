import { Card, Spinner } from "@/components/ui";

export default function StudentHomeworkDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-4 w-12 animate-pulse rounded bg-cream-200" />
        <div>
          <div className="mb-2 h-7 w-48 animate-pulse rounded bg-cream-200" />
          <div className="h-4 w-64 animate-pulse rounded bg-cream-100" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-4 border border-cream-200 p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div className="h-5 w-24 animate-pulse rounded bg-quran-soft" />
              <div className="h-4 w-32 animate-pulse rounded bg-cream-200" />
            </div>
            <div className="h-8 w-3/4 animate-pulse rounded bg-night-900/10" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-20 animate-pulse rounded bg-cream-200" />
              <div className="h-20 w-full animate-pulse rounded-lg bg-cream-100" />
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center gap-3 border border-cream-200 p-6 py-16 shadow-soft">
            <Spinner className="h-8 w-8 text-gold-500" />
            <p className="text-sm font-semibold text-night-900">
              Loading homework assignment...
            </p>
          </Card>
        </div>

        <div>
          <Card className="space-y-4 border border-cream-200 bg-night-900 p-6 text-cream-50">
            <div className="h-6 w-40 animate-pulse rounded bg-night-800" />
            <div className="flex h-24 w-full animate-pulse items-center justify-center rounded-lg bg-night-800">
              <Spinner className="h-6 w-6 text-gold-500" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
