import { Spinner } from "@/components/ui";

export default function DashboardGlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
      <Spinner className="h-9 w-9 text-gold-500" />
      <p className="text-sm font-semibold text-night-900">Loading page...</p>
    </div>
  );
}
