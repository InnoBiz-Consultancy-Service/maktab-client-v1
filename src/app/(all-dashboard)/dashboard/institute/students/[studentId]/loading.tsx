import { Skeleton } from "@/components/ui";

export default function InstituteStudentLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-5">
        <Skeleton className="mb-3 h-4 w-14" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div>
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="mb-5 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="rounded-lg bg-cream-50 p-6 shadow-soft">
          <div className="flex justify-center py-2">
            <Skeleton className="h-22 w-22 rounded-full" />
          </div>
          <Skeleton className="mx-auto mt-3 h-4 w-40" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div>
        <Skeleton className="mb-3 h-5 w-20" />
        <div className="mb-4 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
        <div className="rounded-lg bg-cream-50 shadow-soft">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-cream-200 px-5 py-4 last:border-0"
            >
              <div>
                <Skeleton className="mb-1 h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
