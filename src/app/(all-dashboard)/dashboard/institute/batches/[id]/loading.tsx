import { Card, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Skeleton className="mb-6 h-4 w-28" />

      <Card className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </Card>

      {[0, 1].map((i) => (
        <div key={i} className="mb-6">
          <Skeleton className="mb-3 h-6 w-24" />
          <Card className="p-0">
            <div className="divide-y divide-cream-200">
              {[0, 1].map((j) => (
                <div key={j} className="flex items-center gap-3 px-5 py-3.5">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-1.5 h-4 w-36" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
