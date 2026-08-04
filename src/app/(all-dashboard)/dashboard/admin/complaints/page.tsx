import { requireSession } from "@/lib/utils/session";
import {
  getAdminComplaintStatisticsAction,
  getAdminInstituteComplaintsAction,
  getAdminAllMemberComplaintsAction,
} from "@/actions/complaints";
import { AdminComplaintsView } from "@/components/complaints/AdminComplaintsView";
import { Card } from "@/components/ui";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Complaints Portal | Maktab Admin",
  description: "Platform-wide complaint oversight and management.",
};

const EMPTY_PAGINATED = {
  data: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
};

const EMPTY_STATS = {
  totalMemberComplaints: 0,
  totalInstituteComplaints: 0,
  pendingMemberComplaints: 0,
  pendingInstituteComplaints: 0,
  resolvedMemberComplaints: 0,
  resolvedInstituteComplaints: 0,
};

export default async function AdminComplaintsPage() {
  await requireSession(["ADMIN"]);

  const [statsRes, layer2Res, layer1Res] = await Promise.all([
    getAdminComplaintStatisticsAction(),
    getAdminInstituteComplaintsAction({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" }),
    getAdminAllMemberComplaintsAction({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" }),
  ]);

  if (!statsRes.ok && !layer2Res.ok && !layer1Res.ok) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="flex flex-col items-center gap-4 py-14 text-center">
          <AlertCircle className="h-10 w-10 text-error" />
          <p className="text-sm text-ink-soft">
            Failed to load complaint data. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <AdminComplaintsView
      statistics={statsRes.ok ? statsRes.data! : EMPTY_STATS}
      initialLayer2={layer2Res.ok ? layer2Res.data! : EMPTY_PAGINATED}
      initialLayer1={layer1Res.ok ? layer1Res.data! : EMPTY_PAGINATED}
    />
  );
}
