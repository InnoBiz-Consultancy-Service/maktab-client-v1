import { Card, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <Skeleton className="mb-2 h-8 w-56" />
      <Skeleton className="mb-6 h-5 w-72" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1">
                <Skeleton className="mb-1.5 h-6 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i}>
            <Skeleton className="h-12 w-full" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i}>
            <Skeleton className="h-48 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
