import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getBatchReportAction } from "@/actions/attendance/get-batch-report";
import { BatchReportTable } from "@/components/institute/attendance/BatchReportTable";
import { Card } from "@/components/ui";

interface Props {
  params: Promise<{ batchId: string }>;
}

export default async function InstituteBatchReportPage({ params }: Props) {
  const { batchId } = await params;
  const res = await getBatchReportAction(batchId);

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const report = res.data;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-5">
        <Link
          href="/dashboard/institute/attendance"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back
        </Link>
        <h1 className="font-display text-2xl font-bold text-night-900">
          {report.batch.name}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {report.totalStudents} students · Batch report
        </p>
      </header>

      <BatchReportTable
        batchId={batchId}
        initial={report}
        studentBasePath="/dashboard/institute/attendance/students"
      />
    </div>
  );
}
