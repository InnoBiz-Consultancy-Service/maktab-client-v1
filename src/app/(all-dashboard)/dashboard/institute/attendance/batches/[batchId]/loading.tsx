import { Skeleton } from "@/components/ui";

export default function BatchReportLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5">
        <Skeleton className="mb-3 h-4 w-14" />
        <Skeleton className="mb-2 h-8 w-44" />
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Date filter */}
      <div className="mb-4 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* Batch avg */}
      <Skeleton className="mb-4 h-16 rounded-lg" />

      {/* Table rows */}
      <div className="rounded-lg bg-cream-50 shadow-soft">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-cream-200 px-5 py-4 last:border-0"
          >
            <div className="flex-1">
              <Skeleton className="mb-1 h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
