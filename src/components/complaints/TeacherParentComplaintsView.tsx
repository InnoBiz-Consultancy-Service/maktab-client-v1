"use client";

import { useState, useTransition } from "react";
import { Plus, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ComplaintStatusBadge } from "@/components/shared/complaints/ComplaintStatusBadge";
import { ComplaintFilterBar, DEFAULT_FILTERS } from "@/components/shared/complaints/ComplaintFilterBar";
import type { ComplaintFilters } from "@/components/shared/complaints/ComplaintFilterBar";
import { PaginationControls } from "@/components/shared/complaints/PaginationControls";
import { FileComplaintModal } from "@/components/shared/complaints/FileComplaintModal";
import { ComplaintDetailModal } from "@/components/shared/complaints/ComplaintDetailModal";
import { getMyComplaintsAction, deleteMemberComplaintAction, deleteInstituteComplaintAction } from "@/actions/complaints";
import { toast } from "sonner";
import type {
  MemberComplaint,
  InstituteComplaint,
  ComplaintPagination,
} from "@/types/shared/complaint";

type AnyComplaint = (MemberComplaint & { layer: "MEMBER" }) | (InstituteComplaint & { layer: "INSTITUTE" });

interface TeacherParentComplaintsViewProps {
  initialMemberComplaints: MemberComplaint[];
  initialInstituteComplaints: InstituteComplaint[];
  role: "TEACHER" | "PARENT";
  defaultInstituteId?: string;
}

const PAGE_LIMIT = 10;

export function TeacherParentComplaintsView({
  initialMemberComplaints,
  initialInstituteComplaints,
  role,
  defaultInstituteId,
}: TeacherParentComplaintsViewProps) {
  const [memberComplaints, setMemberComplaints] = useState<MemberComplaint[]>(initialMemberComplaints);
  const [instituteComplaints, setInstituteComplaints] = useState<InstituteComplaint[]>(initialInstituteComplaints);
  const [filters, setFilters] = useState<ComplaintFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [detailComplaint, setDetailComplaint] = useState<AnyComplaint | null>(null);
  const [isRefreshing, startRefresh] = useTransition();

  // Optimistically prepend newly filed complaint to the list —
  // avoids depending on GET /complains/my which may not be live yet.
  const handleComplaintFiled = (complaint: MemberComplaint | InstituteComplaint, layer: "MEMBER" | "INSTITUTE") => {
    if (layer === "MEMBER") {
      setMemberComplaints((prev) => [complaint as MemberComplaint, ...prev]);
    } else {
      setInstituteComplaints((prev) => [complaint as InstituteComplaint, ...prev]);
    }
    setPage(1);
  };

  const refresh = () => {
    startRefresh(async () => {
      const res = await getMyComplaintsAction();
      if (res.ok && res.data) {
        setMemberComplaints(res.data.memberComplaints ?? []);
        setInstituteComplaints(res.data.instituteComplaints ?? []);
      }
    });
  };

  // Merge and annotate
  const allComplaints: AnyComplaint[] = [
    ...memberComplaints.map((c) => ({ ...c, layer: "MEMBER" as const })),
    ...instituteComplaints.map((c) => ({ ...c, layer: "INSTITUTE" as const })),
  ];

  // Client-side filter
  const filtered = allComplaints.filter((c) => {
    if (filters.status !== "ALL" && c.status !== filters.status) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.reportText.toLowerCase().includes(q) && !c.institute?.name?.toLowerCase().includes(q))
        return false;
    }
    if (filters.fromDate && c.createdAt < filters.fromDate) return false;
    if (filters.toDate && c.createdAt > filters.toDate + "T23:59:59") return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[filters.sortBy as keyof typeof a] as string;
    const bVal = b[filters.sortBy as keyof typeof b] as string;
    return filters.sortOrder === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const total = sorted.length;
  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const paginated = sorted.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  const pagination: ComplaintPagination = {
    totalCount: total,
    page,
    limit: PAGE_LIMIT,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  const handleWithdraw = async (id: string) => {
    const complaint = allComplaints.find((c) => c.id === id);
    if (!complaint) return;

    const res = complaint.layer === "MEMBER"
      ? await deleteMemberComplaintAction(id)
      : await deleteInstituteComplaintAction(id);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    // Optimistically remove from local state — refresh() depends on /complains/my
    // which is not yet implemented on the backend.
    if (complaint.layer === "MEMBER") {
      setMemberComplaints((prev) => prev.filter((c) => c.id !== id));
    } else {
      setInstituteComplaints((prev) => prev.filter((c) => c.id !== id));
    }
    toast.success("Complaint withdrawn.");
    setDetailComplaint(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-night-900">
            My Complaints
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            View and manage complaints you have filed.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setFileModalOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          File Complaint
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total filed", value: allComplaints.length },
          { label: "Pending", value: allComplaints.filter((c) => c.status === "PENDING").length },
          { label: "Resolved", value: allComplaints.filter((c) => c.status === "RESOLVED").length },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1 p-4">
            <p className="text-xs text-ink-soft">{stat.label}</p>
            <p className="font-display text-2xl font-bold text-night-900">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <ComplaintFilterBar
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(1); }}
          showRoleFilter={false}
        />
      </Card>

      {/* List */}
      <div className="space-y-3">
        {isRefreshing && (
          <p className="text-center text-sm text-ink-soft">Refreshing…</p>
        )}

        {paginated.length === 0 && !isRefreshing ? (
          <Card className="flex flex-col items-center gap-3 py-14 text-center">
            <Inbox className="h-10 w-10 text-ink-soft/50" />
            <p className="text-sm text-ink-soft">No complaints found.</p>
          </Card>
        ) : (
          paginated.map((c) => (
            <button
              key={c.id}
              onClick={() => setDetailComplaint(c)}
              className="w-full text-left"
            >
              <Card className="flex flex-col gap-2 p-4 transition-shadow hover:shadow-lift sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
                        c.layer === "MEMBER"
                          ? "border-arabic/20 bg-arabic/10 text-arabic"
                          : "border-studies/20 bg-studies/10 text-studies",
                      ].join(" ")}
                    >
                      <AlertCircle className="h-3 w-3" />
                      {c.layer === "MEMBER" ? "Member" : "Institute"}
                    </span>
                    <ComplaintStatusBadge status={c.status} />
                  </div>
                  <p className="line-clamp-2 text-sm text-night-900">{c.reportText}</p>
                  <p className="text-xs text-ink-soft">
                    Against:{" "}
                    <span className="font-medium">
                      {(() => {
                        if (c.layer === "INSTITUTE") {
                          return c.institute?.name || (c.instituteId ? `Institute (ID: ${c.instituteId.slice(-8)})` : "Institute");
                        }
                        const mc = c as MemberComplaint;
                        const targetName = mc.reported?.name;
                        const targetRole = mc.reportedRole ? mc.reportedRole.charAt(0) + mc.reportedRole.slice(1).toLowerCase() : "";
                        const targetId = mc.reportedId ? `ID: ${mc.reportedId.slice(-8)}` : "";

                        if (targetName) return `${targetName}${targetRole ? ` (${targetRole})` : ""}`;
                        if (targetRole && targetId) return `${targetRole} (${targetId})`;
                        if (targetRole) return targetRole;
                        if (targetId) return targetId;
                        return c.institute?.name || (c.instituteId ? `Institute (ID: ${c.instituteId.slice(-8)})` : "—");
                      })()}
                    </span>
                  </p>
                </div>
                <p className="shrink-0 text-xs text-ink-soft">
                  {new Date(c.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Card>
            </button>
          ))
        )}
      </div>

      {total > PAGE_LIMIT && (
        <PaginationControls
          pagination={pagination}
          onPageChange={setPage}
        />
      )}

      {/* Modals */}
      <FileComplaintModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        onSuccess={handleComplaintFiled}
        defaultInstituteId={defaultInstituteId}
        role={role}
      />

      <ComplaintDetailModal
        complaint={detailComplaint}
        open={Boolean(detailComplaint)}
        onClose={() => setDetailComplaint(null)}
        canWithdraw
        onWithdraw={handleWithdraw}
      />
    </div>
  );
}
