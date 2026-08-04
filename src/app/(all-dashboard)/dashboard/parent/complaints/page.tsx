import { requireSession } from "@/lib/utils/session";
import { getMyComplaintsAction } from "@/actions/complaints";
import { TeacherParentComplaintsView } from "@/components/complaints/TeacherParentComplaintsView";
import { Card } from "@/components/ui";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "My Complaints | Maktab Parent",
  description: "View and manage complaints you have filed.",
};

export default async function ParentComplaintsPage() {
  await requireSession(["PARENT"]);

  const res = await getMyComplaintsAction();

  if (!res.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="flex flex-col items-center gap-4 py-14 text-center">
          <AlertCircle className="h-10 w-10 text-error" />
          <p className="text-sm text-ink-soft">{res.error}</p>
        </Card>
      </div>
    );
  }

  const { memberComplaints = [], instituteComplaints = [] } = res.data ?? {};

  return (
    <TeacherParentComplaintsView
      initialMemberComplaints={memberComplaints}
      initialInstituteComplaints={instituteComplaints}
      role="PARENT"
    />
  );
}
