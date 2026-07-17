import { getInstituteOverviewAction } from "@/actions/attendance/get-institute-overview";
import { getMissingTodayAction } from "@/actions/attendance/get-missing-today";
import { OverviewStats } from "@/components/institute/attendance/OverviewStats";
import { MissingTodayAlert } from "@/components/institute/attendance/MissingTodayAlert";
import { BatchRankingList } from "@/components/institute/attendance/BatchRankingList";
import { Card } from "@/components/ui";

export default async function InstituteAttendancePage() {
  const [overviewRes, missingRes] = await Promise.all([
    getInstituteOverviewAction(),
    getMissingTodayAction(),
  ]);

  if (!overviewRes.ok) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {overviewRes.error}
        </Card>
      </div>
    );
  }

  const overview = overviewRes.data;
  const missing = missingRes.ok ? missingRes.data : null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">Attendance</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Institute-wide overview and batch insights.
        </p>
      </header>

      {/* Missing today alert */}
      {missing && missing.missingCount > 0 && (
        <div className="mb-6">
          <MissingTodayAlert data={missing} />
        </div>
      )}

      {/* Stats grid */}
      <div className="mb-6">
        <OverviewStats data={overview} />
      </div>

      {/* Batch ranking */}
      <section>
        <h2 className="mb-3 font-display text-base font-bold text-night-900">
          Batches by attendance
        </h2>
        <BatchRankingList
          batches={overview.batches}
          lowThreshold={overview.lowThreshold}
        />
      </section>
    </div>
  );
}
