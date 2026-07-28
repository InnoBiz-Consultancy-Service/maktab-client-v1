import { getSubmissionDetails } from "@/actions/homework";
import { GradingForm } from "@/components/teacher/homework/GradingForm";
import { Card } from "@/components/ui";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string; submissionId: string }>;
}

export default async function GradeSubmissionPage({ params }: PageProps) {
  const { id: homeworkId, submissionId } = await params;
  const result = await getSubmissionDetails(submissionId, homeworkId);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          href={`/dashboard/teacher/homework/${homeworkId}/submissions`}
          className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Submissions</span>
        </Link>
        <Card className="py-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-ink-soft/30 mb-3" />
          <h3 className="font-display font-semibold text-night-900 mb-1">Submission Unavailable</h3>
          <p className="text-sm text-ink-soft max-w-sm mx-auto">
            This submission could not be loaded. Please go back and try again.
          </p>
        </Card>
      </div>
    );
  }

  return <GradingForm submission={result.data} homeworkId={homeworkId} />;
}
