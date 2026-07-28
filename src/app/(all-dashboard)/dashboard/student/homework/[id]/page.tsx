import { getStudentHomeworkDetail } from "@/actions/homework";
import { StudentSubmissionForm } from "@/components/student/homework/StudentSubmissionForm";
import { Card } from "@/components/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentHomeworkDetailPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getStudentHomeworkDetail(id);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load homework details. {result.error}
        </Card>
      </div>
    );
  }

  const {
    homework,
    canSubmit = false,
    submission = null,
    submitBlockedReason = null,
  } = result.data || {};

  if (!homework) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Homework assignment details could not be found.
        </Card>
      </div>
    );
  }

  return (
    <StudentSubmissionForm
      homework={homework}
      canSubmit={canSubmit}
      submission={submission}
      submitBlockedReason={submitBlockedReason}
    />
  );
}
