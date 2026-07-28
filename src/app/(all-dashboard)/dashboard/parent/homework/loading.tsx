import { Card, Spinner } from "@/components/ui";

export default function ParentHomeworkLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 h-8 w-44 animate-pulse rounded bg-night-900/10" />
          <div className="h-4 w-72 animate-pulse rounded bg-cream-200" />
        </div>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner className="h-8 w-8 text-gold-500" />
          <p className="text-sm font-medium text-ink-soft">
            Loading children's homework...
          </p>
        </div>
      </div>
    </div>
  );
}
