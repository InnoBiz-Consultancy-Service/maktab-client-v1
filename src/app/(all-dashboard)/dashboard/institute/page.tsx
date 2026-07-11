import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/api/cookies";
import { getInstituteOverviewAction } from "@/actions/institute/overview";
import { Card } from "@/components/ui";
import { InstituteDashboard } from "@/components/institute/dashboard/InstituteDashboard";

export default async function InstitutePage() {
  const session = await getSession();
  const res = await getInstituteOverviewAction();

  // Data failed to load — say so plainly, and offer a way forward.
  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/15 text-error">
            <AlertTriangle className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-bold text-night-900">
              Couldn&rsquo;t load your dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{res.error}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/institute"
              className="inline-flex min-h-[44px] items-center rounded-full bg-gold-500 px-6 font-display font-semibold text-night-900 transition-transform hover:scale-[1.02]"
            >
              Try again
            </Link>
            <Link
              href="/dashboard/institute/students/new"
              className="inline-flex min-h-[44px] items-center rounded-full border border-cream-200 px-6 font-display font-semibold text-night-900 transition-colors hover:bg-cream-100"
            >
              Add a student
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <InstituteDashboard name={session?.label ?? "there"} overview={res.data} />
  );
}
