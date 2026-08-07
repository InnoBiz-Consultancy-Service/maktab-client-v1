import { requireSession } from "@/lib/utils/session";
import { getMyComplaintsAction } from "@/actions/complaints";
import { TeacherParentComplaintsView } from "@/components/complaints/TeacherParentComplaintsView";

export const metadata = {
  title: "My Complaints | Maktab Teacher",
  description: "View and manage complaints you have filed.",
};

export default async function TeacherComplaintsPage() {
  await requireSession(["TEACHER"]);

  const res = await getMyComplaintsAction();
  const memberComplaints = res.ok ? (res.data?.memberComplaints ?? []) : [];
  const instituteComplaints = res.ok ? (res.data?.instituteComplaints ?? []) : [];

  return (
    <TeacherParentComplaintsView
      initialMemberComplaints={memberComplaints}
      initialInstituteComplaints={instituteComplaints}
      role="TEACHER"
    />
  );
}
