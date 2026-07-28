import Link from "next/link";
import { Layers, CheckCircle2, Lock, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui";
import { requireSession } from "@/lib/utils/session";
import { getInstituteDashboardBatchesAction } from "@/actions/dashboard/institute-dashboard";
import { ProgressGauges } from "@/components/dashboard/shared/ProgressGauges";

export default async function BatchesPage() {
  await requireSession(["INSTITUTE"]);

  const res = await getInstituteDashboardBatchesAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const batches = res.data || [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900">
            Batches & Progress
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {batches.length} total batches (active & completed)
          </p>
        </div>
        <Link
          href="/dashboard/institute/batches/new"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02]"
        >
          <Layers className="h-4 w-4" aria-hidden />
          <span>Create batch</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {batches.map((b) => (
          <Card key={b.id} className="space-y-4 p-5">
            <div className="flex flex-col justify-between gap-2 border-b border-cream-200 pb-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-night-900">
                    {b.name}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      b.status === "COMPLETED"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {b.status === "COMPLETED" ? "COMPLETED (Frozen)" : "ACTIVE"}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
                  <Users className="h-3.5 w-3.5" /> {b.studentCount} Students •
                  Teachers:{" "}
                  {b.teachers?.map((t) => t.name).join(", ") || "None"}
                </p>
              </div>

              {b.status === "COMPLETED" ? (
                <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <Lock className="h-3.5 w-3.5" /> Completed on{" "}
                  {b.completedAt
                    ? new Date(b.completedAt).toLocaleDateString()
                    : "Finalized"}
                </div>
              ) : (
                <Link
                  href={`/dashboard/leaderboard?scope=batch&batchId=${b.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:underline"
                >
                  View Leaderboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {/* Progress Gauges for Batch */}
            <ProgressGauges
              progress={b.progress}
              title="Batch Average Progress"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
