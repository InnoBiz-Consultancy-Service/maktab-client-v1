import { getMyChildrenAction } from "@/actions/attendance/get-my-children";
import { ChildCard } from "@/components/parent/attendance/ChildCard";
import { EmptyState } from "@/components/shared/attendance/EmptyState";
import { Card } from "@/components/ui";
import { Users } from "lucide-react";

export default async function ParentChildrenPage() {
  const res = await getMyChildrenAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const children = res.data;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">My Children</h1>
        <p className="mt-1 text-sm text-ink-soft">
          This month's attendance at a glance.
        </p>
      </header>

      {children.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No children linked"
          description="Your children haven't been added to the system yet. Contact your institute."
        />
      ) : (
        <div className="space-y-3">
          {children.map((child) => (
            <ChildCard key={child.student.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}
