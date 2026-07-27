import { getParentHomeworkData } from "@/actions/homework";
import { ParentHomeworkView } from "@/components/parent/homework/ParentHomeworkView";
import { Card } from "@/components/ui";

interface PageProps {
  searchParams: Promise<{ studentId?: string }>;
}

export default async function ParentHomeworkPage({ searchParams }: PageProps) {
  const { studentId } = await searchParams;
  const result = await getParentHomeworkData({ studentId });

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load children's homework. {result.error}
        </Card>
      </div>
    );
  }

  return <ParentHomeworkView data={result.data} initialChildId={studentId} />;
}
