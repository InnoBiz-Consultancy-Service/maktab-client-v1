import { getParentChildrenDashboardAction } from "@/actions/dashboard/parent-dashboard";
import { ParentHomeView } from "@/components/dashboard/parent/ParentHomeView";
import { Card } from "@/components/ui";

export default async function ParentDashboardHomePage() {
  const res = await getParentChildrenDashboardAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <Card className="py-12 text-center text-sm text-ink-soft">
          {res.error || "Could not load parent dashboard details. Please try again."}
        </Card>
      </div>
    );
  }

  const childrenData = res.data || [];

  return <ParentHomeView childrenData={childrenData} />;
}
