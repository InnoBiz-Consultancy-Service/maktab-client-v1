import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { requireSession } from "@/lib/utils/session";
import { getBatchAction } from "@/actions/institute/batch/get-batch";
import { Card } from "@/components/ui";
import { BatchDetail } from "@/components/institute/batch/BatchDetail/BatchDetail";

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession(["INSTITUTE"]);
  const { id } = await params;

  const res = await getBatchAction(id);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/dashboard/institute/batches"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to batches
      </Link>

      {!res.ok ? (
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/15 text-error">
            <AlertTriangle className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-bold text-night-900">
              Couldn&rsquo;t load this batch
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{res.error}</p>
          </div>
          <Link
            href="/dashboard/institute/batches"
            className="inline-flex min-h-[44px] items-center rounded-full bg-gold-500 px-6 font-display font-semibold text-night-900 transition-transform hover:scale-[1.02]"
          >
            Back to batches
          </Link>
        </Card>
      ) : (
        <BatchDetail batch={res.data} />
      )}
    </div>
  );
}
