import { Skeleton } from "@/components/ui";

export default function TeacherAttendanceLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <Skeleton className="mb-2 h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg bg-cream-50 p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="mt-4 h-[42px] w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
