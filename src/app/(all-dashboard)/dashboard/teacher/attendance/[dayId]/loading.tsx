import { Skeleton } from "@/components/ui";

export default function RosterLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-5">
        <Skeleton className="mb-3 h-4 w-14" />
        <Skeleton className="mb-2 h-8 w-44" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Summary bar */}
      <Skeleton className="mb-3 h-10 w-full rounded-lg" />

      {/* Student rows */}
      <div className="rounded-lg bg-cream-50 shadow-soft">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="border-b border-cream-200 px-5 py-4 last:border-0"
          >
            <div className="mb-3 flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-[42px] rounded-full" />
              <Skeleton className="h-[42px] rounded-full" />
              <Skeleton className="h-[42px] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
