import { getParentHomeworkData } from "@/actions/homework";
import { ParentHomeworkView } from "@/components/parent/homework/ParentHomeworkView";
import { Card } from "@/components/ui";

export default async function ParentHomeworkPage() {
  const result = await getParentHomeworkData();

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          Failed to load children's homework. Please try again.
        </Card>
      </div>
    );
  }

  return <ParentHomeworkView data={result.data} />;
}
