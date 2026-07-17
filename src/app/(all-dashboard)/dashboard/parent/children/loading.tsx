import { Skeleton } from "@/components/ui";

export default function ParentChildrenLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <Skeleton className="mb-2 h-8 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg bg-cream-50 p-5 shadow-soft">
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-5 w-28" />
                <Skeleton className="mb-2 h-3 w-36" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
