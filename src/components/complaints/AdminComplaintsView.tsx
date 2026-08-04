"use client";

import { useState, useTransition } from "react";
import { BarChart3, Inbox, Users, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ComplaintStatusBadge } from "@/components/shared/complaints/ComplaintStatusBadge";
import { ComplaintFilterBar, DEFAULT_FILTERS } from "@/components/shared/complaints/ComplaintFilterBar";
import type { ComplaintFilters } from "@/components/shared/complaints/ComplaintFilterBar";
import { PaginationControls } from "@/components/shared/complaints/PaginationControls";
import { ComplaintDetailModal } from "@/components/shared/complaints/ComplaintDetailModal";
import {
  getAdminInstituteComplaintsAction,
  getAdminAllMemberComplaintsAction,
  updateMemberComplaintStatusAction,
  updateInstituteComplaintStatusAction,
} from "@/actions/complaints";
import { toast } from "sonner";
import type {
  ComplaintStatistics,
  MemberComplaint,
  InstituteComplaint,
  PaginatedComplaints,
  ComplaintStatus,
} from "@/types/shared/complaint";

type ActiveTab = "layer2" | "layer1";

interface AdminComplaintsViewProps {
  statistics: ComplaintStatistics;
  initialLayer2: PaginatedComplaints<InstituteComplaint>;
  initialLayer1: PaginatedComplaints<MemberComplaint>;
}

const STAT_CARDS = (stats: ComplaintStatistics) => [
  {
    label: "Member Complaints",
    icon: Users,
    color: "text-arabic bg-arabic/10",
    total: stats.totalMemberComplaints,
    pending: stats.pendingMemberComplaints,
    resolved: stats.resolvedMemberComplaints,
  },
  {
    label: "Institute Complaints",
    icon: Building2,
    color: "text-studies bg-studies/10",
    total: stats.totalInstituteComplaints,
    pending: stats.pendingInstituteComplaints,
    resolved: stats.resolvedInstituteComplaints,
  },
];

export function AdminComplaintsView({
  statistics,
  initialLayer2,
  initialLayer1,
}: AdminComplaintsViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("layer2");
  const [layer2Data, setLayer2Data] = useState(initialLayer2);
  const [layer1Data, setLayer1Data] = useState(initialLayer1);
  const [filters, setFilters] = useState<ComplaintFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detailComplaint, setDetailComplaint] = useState<
    (MemberComplaint & { _type: "member" }) | (InstituteComplaint & { _type: "institute" }) | null
  >(null);
  const [isLoading, startLoading] = useTransition();

  const fetchLayer = (
    tab: ActiveTab,
    f: ComplaintFilters,
    p: number,
    l: number,
  ) => {
    const params = {
      page: p,
      limit: l,
      status: f.status !== "ALL" ? f.status : undefined,
      reportedRole: f.reportedRole !== "ALL" ? f.reportedRole : undefined,
      search: f.search || undefined,
      fromDate: f.fromDate || undefined,
      toDate: f.toDate || undefined,
      sortBy: f.sortBy,
      sortOrder: f.sortOrder,
    };
    startLoading(async () => {
      if (tab === "layer2") {
        const res = await getAdminInstituteComplaintsAction(params);
        if (res.ok && res.data) setLayer2Data(res.data);
        else toast.error((!res.ok && res.error) ? res.error : "Failed to load complaints.");
      } else {
        const res = await getAdminAllMemberComplaintsAction(params);
        if (res.ok && res.data) setLayer1Data(res.data);
        else toast.error((!res.ok && res.error) ? res.error : "Failed to load complaints.");
      }
    });
  };

  const handleFiltersChange = (f: ComplaintFilters) => {
    setFilters(f);
    setPage(1);
    fetchLayer(activeTab, f, 1, limit);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchLayer(activeTab, filters, p, limit);
  };

  const handleLimitChange = (l: number) => {
    setLimit(l);
    setPage(1);
    fetchLayer(activeTab, filters, 1, l);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setPage(1);
    setFilters(DEFAULT_FILTERS);
    fetchLayer(tab, DEFAULT_FILTERS, 1, limit);
  };

  const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    if (!detailComplaint) return;
    let res;
    if (detailComplaint._type === "institute") {
      res = await updateInstituteComplaintStatusAction(id, newStatus);
    } else {
      res = await updateMemberComplaintStatusAction(id, newStatus);
    }
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    fetchLayer(activeTab, filters, page, limit);
    setDetailComplaint(null);
  };

  const complaints =
    activeTab === "layer2"
      ? (layer2Data?.data ?? [])
      : (layer1Data?.data ?? []);
  const pagination =
    activeTab === "layer2" ? layer2Data?.pagination : layer1Data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-900 text-gold-500">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-night-900">
            Complaints Portal
          </h1>
          <p className="text-sm text-ink-soft">
            Platform-wide complaint oversight
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STAT_CARDS(statistics).map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-ink-soft">{s.label}</p>
                <p className="font-display text-2xl font-bold text-night-900">{s.total}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-4 border-t border-cream-200 pt-3">
              <div>
                <p className="text-xs text-warn">Pending</p>
                <p className="font-semibold text-night-900">{s.pending}</p>
              </div>
              <div>
                <p className="text-xs text-success">Resolved</p>
                <p className="font-semibold text-night-900">{s.resolved}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-cream-200">
        {(
          [
            { value: "layer2", label: "Institute Complaints (L2)", icon: Building2 },
            { value: "layer1", label: "Member Complaints (L1)", icon: Users },
          ] as const
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleTabChange(value)}
            className={[
              "mb-[-1px] flex items-center gap-2 border-b-2 pb-3 pr-5 pl-2 text-sm font-semibold transition-colors",
              activeTab === value
                ? "border-gold-500 text-night-900"
                : "border-transparent text-ink-soft hover:text-night-900",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <ComplaintFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          showRoleFilter={activeTab === "layer1"}
        />
      </Card>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-cream-200 bg-cream-50 shadow-soft">
        <div className="hidden grid-cols-[1fr_160px_140px_80px] gap-4 border-b border-cream-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft sm:grid">
          <span>Complaint</span>
          <span>Reporter</span>
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
          complaints.map((c, idx) => {
            const isMember = activeTab === "layer1";
            return (
              <button
                key={c.id}
                onClick={() =>
                  setDetailComplaint(
                    isMember
                      ? { ...(c as MemberComplaint), _type: "member" }
                      : { ...(c as InstituteComplaint), _type: "institute" },
                  )
                }
                className={[
                  "w-full text-left transition-colors hover:bg-cream-100",
                  idx !== 0 ? "border-t border-cream-200" : "",
                ].join(" ")}
              >
                {/* Mobile */}
                <div className="flex flex-col gap-2 p-4 sm:hidden">
                  <div className="flex items-center justify-between">
                    <ComplaintStatusBadge status={c.status} />
                    <span className="text-xs text-ink-soft">
                      {new Date(c.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-night-900">{c.report}</p>
                  <p className="text-xs text-ink-soft">
                    {c.reporter?.name ?? "—"} · {c.institute?.name ?? "—"}
                  </p>
                </div>

                {/* Desktop */}
                <div className="hidden grid-cols-[1fr_160px_140px_80px] items-center gap-4 px-5 py-4 sm:grid">
                  <div>
                    <p className="line-clamp-2 text-sm text-night-900">{c.report}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{c.institute?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-night-900">{c.reporter?.name ?? "—"}</p>
                    <p className="text-xs capitalize text-ink-soft">
                      {c.reporter?.role?.toLowerCase() ?? "—"}
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
            );
          })
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
