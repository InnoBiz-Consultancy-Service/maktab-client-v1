import { getBatches, getLessons } from "@/actions/homework";
import { mockStudents } from "@/data/mock-homework";
import { CreateHomeworkForm } from "@/components/teacher/homework/CreateHomeworkForm";
import { Card } from "@/components/ui";

export default async function CreateHomeworkPage() {
  const batchesRes = await getBatches();
  const lessonsRes = await getLessons();

  const batches = batchesRes.ok ? batchesRes.data : [];
  const lessons = lessonsRes.ok ? lessonsRes.data : [];

  if (!batchesRes.ok || !lessonsRes.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load batches or lessons. Please try again.
        </Card>
      </div>
    );
  }

  return (
    <CreateHomeworkForm
      batches={batches}
      lessons={lessons}
      students={mockStudents}
    />
  );
}
