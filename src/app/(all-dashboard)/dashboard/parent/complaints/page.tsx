import { requireSession } from "@/lib/utils/session";
import { getMyComplaintsAction } from "@/actions/complaints";
import { TeacherParentComplaintsView } from "@/components/complaints/TeacherParentComplaintsView";

export const metadata = {
  title: "My Complaints | Maktab Parent",
  description: "View and manage complaints you have filed.",
};

export default async function ParentComplaintsPage() {
  await requireSession(["PARENT"]);

  const res = await getMyComplaintsAction();
  const memberComplaints = res.ok ? (res.data?.memberComplaints ?? []) : [];
  const instituteComplaints = res.ok ? (res.data?.instituteComplaints ?? []) : [];

  return (
    <TeacherParentComplaintsView
      initialMemberComplaints={memberComplaints}
      initialInstituteComplaints={instituteComplaints}
      role="PARENT"
    />
  );
}
