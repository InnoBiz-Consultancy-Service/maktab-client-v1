import { Card, Spinner } from "@/components/ui";

export default function StudentHomeworkDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-4 w-12 bg-cream-200 animate-pulse rounded" />
        <div>
          <div className="h-7 w-48 bg-cream-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-cream-100 animate-pulse rounded" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-cream-200 shadow-soft space-y-4">
            <div className="flex justify-between items-center border-b border-cream-100 pb-3">
              <div className="h-5 w-24 bg-quran-soft animate-pulse rounded" />
              <div className="h-4 w-32 bg-cream-200 animate-pulse rounded" />
            </div>
            <div className="h-8 w-3/4 bg-night-900/10 animate-pulse rounded" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-20 bg-cream-200 animate-pulse rounded" />
              <div className="h-20 w-full bg-cream-100 animate-pulse rounded-lg" />
            </div>
          </Card>

          <Card className="p-6 border border-cream-200 shadow-soft flex flex-col items-center justify-center py-16 gap-3">
            <Spinner className="h-8 w-8 text-gold-500" />
            <p className="text-sm font-semibold text-night-900">Loading homework assignment...</p>
          </Card>
        </div>

        <div>
          <Card className="p-6 border border-cream-200 bg-night-900 text-cream-50 space-y-4">
            <div className="h-6 w-40 bg-night-800 animate-pulse rounded" />
            <div className="h-24 w-full bg-night-800 animate-pulse rounded-lg flex items-center justify-center">
              <Spinner className="h-6 w-6 text-gold-500" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
