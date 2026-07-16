import { Card, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Skeleton className="mb-2 h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>

      <Skeleton className="mb-4 h-11 w-full rounded-sm" />

      <Card className="p-0">
        <div className="divide-y divide-cream-200">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1.5 h-4 w-40" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
