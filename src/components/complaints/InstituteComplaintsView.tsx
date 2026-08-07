"use client";

import { useState, useTransition } from "react";
import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ComplaintStatusBadge } from "@/components/shared/complaints/ComplaintStatusBadge";
import { ComplaintFilterBar, DEFAULT_FILTERS } from "@/components/shared/complaints/ComplaintFilterBar";
import type { ComplaintFilters } from "@/components/shared/complaints/ComplaintFilterBar";
import { PaginationControls } from "@/components/shared/complaints/PaginationControls";
import { ComplaintDetailModal } from "@/components/shared/complaints/ComplaintDetailModal";
import {
  getInstituteMemberComplaintsAction,
  updateMemberComplaintStatusAction,
} from "@/actions/complaints";
import { toast } from "sonner";
import type {
  MemberComplaint,
  PaginatedComplaints,
  ComplaintStatus,
} from "@/types/shared/complaint";

interface InstituteComplaintsViewProps {
  initialData: PaginatedComplaints<MemberComplaint>;
}

export function InstituteComplaintsView({
  initialData,
}: InstituteComplaintsViewProps) {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<ComplaintFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detailComplaint, setDetailComplaint] = useState<MemberComplaint | null>(null);
  const [isLoading, startLoading] = useTransition();

  const fetchData = (newFilters: ComplaintFilters, newPage: number, newLimit: number) => {
    startLoading(async () => {
      const res = await getInstituteMemberComplaintsAction({
        page: newPage,
        limit: newLimit,
        status: newFilters.status !== "ALL" ? newFilters.status : undefined,
        reportedRole: newFilters.reportedRole !== "ALL" ? newFilters.reportedRole : undefined,
        search: newFilters.search || undefined,
        fromDate: newFilters.fromDate || undefined,
        toDate: newFilters.toDate || undefined,
        sortBy: newFilters.sortBy,
        sortOrder: newFilters.sortOrder,
      });
      if (res.ok && res.data) setData(res.data);
      else toast.error((!res.ok && res.error) ? res.error : "Failed to load complaints.");
    });
  };

  const handleFiltersChange = (f: ComplaintFilters) => {
    setFilters(f);
    setPage(1);
    fetchData(f, 1, limit);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchData(filters, p, limit);
  };

  const handleLimitChange = (l: number) => {
    setLimit(l);
    setPage(1);
    fetchData(filters, 1, l);
  };

  const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    const res = await updateMemberComplaintStatusAction(id, newStatus);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    // Refresh
    fetchData(filters, page, limit);
    // Sync detail
    if (detailComplaint?.id === id) {
      setDetailComplaint({ ...detailComplaint, status: newStatus });
    }
  };

  const complaints: MemberComplaint[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];
  const pagination = Array.isArray(data)
    ? { totalCount: complaints.length, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false }
    : data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-night-900">
          Member Complaints
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Complaints filed against members of your institute.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: pagination?.totalCount ?? 0 },
          { label: "Pending", value: complaints.filter((c) => c.status === "PENDING").length },
          { label: "Resolved", value: complaints.filter((c) => c.status === "RESOLVED").length },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-xs text-ink-soft">{stat.label}</p>
            <p className="font-display text-2xl font-bold text-night-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <ComplaintFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          showRoleFilter
        />
      </Card>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-cream-200 bg-cream-50 shadow-soft">
        {/* Desktop header */}
        <div className="hidden grid-cols-[1fr_120px_140px_120px_80px] gap-4 border-b border-cream-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:grid">
          <span>Complaint</span>
          <span>Reporter</span>
          <span>Reported</span>
          <span>Filed</span>
          <span>Status</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <Inbox className="h-10 w-10 text-ink-soft/50" />
            <p className="text-sm text-ink-soft">No complaints found.</p>
          </div>
        ) : (
          complaints.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setDetailComplaint(c)}
              className={[
                "w-full text-left transition-colors hover:bg-cream-100",
                idx !== 0 ? "border-t border-cream-200" : "",
              ].join(" ")}
            >
              {/* Mobile layout */}
              <div className="flex flex-col gap-2 p-4 sm:hidden">
                <div className="flex items-center justify-between gap-2">
                  <ComplaintStatusBadge status={c.status} />
                  <span className="text-xs text-ink-soft">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-night-900">{c.reportText}</p>
                <p className="text-xs text-ink-soft">
                  {c.reporter?.name ?? c.reporterRole ?? "—"} &rarr;{" "}
                  {c.reported?.name ?? (c.reportedId ? `ID: ${c.reportedId.slice(-8)}` : "—")}{" "}
                  ({c.reportedRole ?? "—"})
                </p>
              </div>

              {/* Desktop layout */}
              <div className="hidden grid-cols-[1fr_120px_140px_120px_80px] items-center gap-4 px-5 py-4 sm:grid">
                <p className="line-clamp-2 text-sm text-night-900">{c.reportText}</p>
                <div>
                  <p className="text-sm font-medium text-night-900">
                    {c.reporter?.name ?? c.reporterRole ?? "—"}
                  </p>
                  <p className="text-xs capitalize text-ink-soft">
                    {c.reporter?.role?.toLowerCase() ?? c.reporterRole?.toLowerCase() ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-night-900">
                    {c.reported?.name ?? (c.reportedId ? `ID: ${c.reportedId.slice(-8)}` : "—")}
                  </p>
                  <p className="text-xs capitalize text-ink-soft">
                    {c.reportedRole?.toLowerCase() ?? "—"}
                  </p>
                </div>
                <p className="text-xs text-ink-soft">
                  {new Date(c.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <ComplaintStatusBadge status={c.status} />
              </div>
            </button>
          ))
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      <ComplaintDetailModal
        complaint={detailComplaint}
        open={Boolean(detailComplaint)}
        onClose={() => setDetailComplaint(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
