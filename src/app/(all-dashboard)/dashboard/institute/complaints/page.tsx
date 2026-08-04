import { requireSession } from "@/lib/utils/session";
import { getInstituteMemberComplaintsAction } from "@/actions/complaints";
import { InstituteComplaintsView } from "@/components/complaints/InstituteComplaintsView";
import { Card } from "@/components/ui";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Member Complaints | Maktab Institute",
  description: "Review and resolve complaints filed against your institute's members.",
};

export default async function InstituteComplaintsPage() {
  await requireSession(["INSTITUTE"]);

  const res = await getInstituteMemberComplaintsAction({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" });

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

  const initialData = res.data ?? { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };

  return <InstituteComplaintsView initialData={initialData} />;
}
