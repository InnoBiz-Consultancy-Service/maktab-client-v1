import Link from "next/link";
import { Layers } from "lucide-react";
import { Card } from "@/components/ui";
import { requireSession } from "@/lib/utils/session";
import { getBatchesAction } from "@/actions/institute/batch/get-batches";
import { BatchList } from "@/components/institute/batch/BatchList/BatchList";

export default async function BatchesPage() {
  await requireSession(["INSTITUTE"]);

  const res = await getBatchesAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const batches = res.data;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900">Batches</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {batches.length} in your institute
          </p>
        </div>
        <Link
          href="/dashboard/institute/batches/new"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Layers className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Create batch</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      <BatchList initialBatches={batches} />
    </div>
  );
}
