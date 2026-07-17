import { Skeleton } from "@/components/ui";

export default function InstituteAttendanceLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <Skeleton className="mb-2 h-8 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg bg-cream-50 p-4 shadow-soft">
            <Skeleton className="mb-2 h-9 w-9 rounded-full" />
            <Skeleton className="mb-1 h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Batch list */}
      <Skeleton className="mb-3 h-5 w-40" />
      <div className="rounded-lg bg-cream-50 shadow-soft">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-cream-200 px-5 py-4 last:border-0"
          >
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-1 h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
