import { getHomeworkDetail, getBatches, getLessons, getHomeworkSubmissions } from "@/actions/homework";
import { mockStudents } from "@/data/mock-homework";
import { EditHomeworkForm } from "@/components/teacher/homework/EditHomeworkForm";
import { Card } from "@/components/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHomeworkPage({ params }: PageProps) {
  const { id } = await params;

  const homeworkRes = await getHomeworkDetail(id);
  const batchesRes = await getBatches();
  const lessonsRes = await getLessons();
  const submissionsRes = await getHomeworkSubmissions(id);

  if (!homeworkRes.ok || !batchesRes.ok || !lessonsRes.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load homework details. Please try again.
        </Card>
      </div>
    );
  }

  const homework = homeworkRes.data;
  const batches = batchesRes.ok ? batchesRes.data : [];
  const lessons = lessonsRes.ok ? lessonsRes.data : [];
  
  // Count how many students have actually submitted
  const submissionCount = submissionsRes.ok 
    ? submissionsRes.data.results.filter(r => r.status !== "NOT_SUBMITTED").length 
    : 0;

  return (
    <EditHomeworkForm
      homework={homework}
      batches={batches}
      lessons={lessons}
      students={mockStudents}
      submissionCount={submissionCount}
    />
  );
}
