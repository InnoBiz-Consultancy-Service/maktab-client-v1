import { getStudentHomeworkDetail } from "@/actions/homework";
import { StudentSubmissionForm } from "@/components/student/homework/StudentSubmissionForm";
import { Card } from "@/components/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentHomeworkDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // For mock development, we'll default to student "stu_01" (Rahim Uddin)
  const studentId = "stu_01";
  const result = await getStudentHomeworkDetail(studentId, id);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load homework details. {result.error}
        </Card>
      </div>
    );
  }

  const { homework, canSubmit, submission } = result.data;

  return (
    <StudentSubmissionForm
      homework={homework}
      canSubmit={canSubmit}
      submission={submission}
      studentId={studentId}
    />
  );
}
