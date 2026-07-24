import { getSubmissionDetails } from "@/actions/homework";
import { GradingForm } from "@/components/teacher/homework/GradingForm";
import { Card } from "@/components/ui";

interface PageProps {
  params: Promise<{ submissionId: string }>;
}

export default async function GradeSubmissionPage({ params }: PageProps) {
  const { submissionId } = await params;
  const result = await getSubmissionDetails(submissionId);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load student submission details. Please try again.
        </Card>
      </div>
    );
  }

  return <GradingForm submission={result.data} />;
}
