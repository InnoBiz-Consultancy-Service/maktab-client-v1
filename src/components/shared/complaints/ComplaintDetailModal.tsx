"use client";

import { useState, useTransition } from "react";
import { X, User, Building2, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ComplaintStatusBadge } from "./ComplaintStatusBadge";
import { toast } from "sonner";
import type { MemberComplaint, InstituteComplaint } from "@/types/shared/complaint";

type AnyComplaint = MemberComplaint | InstituteComplaint;

function isMemberComplaint(c: AnyComplaint): c is MemberComplaint {
  return "reported" in c && "reportedRole" in c;
}

interface ComplaintDetailModalProps {
  complaint: AnyComplaint | null;
  open: boolean;
  onClose: () => void;
  /** If provided, a status-toggle button will be shown for institute/admin use. */
  onStatusChange?: (
    id: string,
    newStatus: "PENDING" | "RESOLVED",
  ) => Promise<void>;
  /** Whether the current user is the original reporter (shows withdraw option). */
  canWithdraw?: boolean;
  onWithdraw?: (id: string) => Promise<void>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ComplaintDetailModal({
  complaint,
  open,
  onClose,
  onStatusChange,
  canWithdraw,
  onWithdraw,
}: ComplaintDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  if (!open || !complaint) return null;

  const isMember = isMemberComplaint(complaint);

  const handleToggleStatus = () => {
    if (!onStatusChange) return;
    const next = complaint.status === "PENDING" ? "RESOLVED" : "PENDING";
    startTransition(async () => {
      await onStatusChange(complaint.id, next);
      toast.success(`Complaint marked as ${next.toLowerCase()}.`);
    });
  };

  const handleWithdraw = () => {
    if (!onWithdraw) return;
    startTransition(async () => {
      await onWithdraw(complaint.id);
      toast.success("Complaint withdrawn.");
      onClose();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/60 p-3 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complaint-detail-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-cream-200 bg-cream-50 shadow-lift">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2
              id="complaint-detail-title"
              className="font-display text-base sm:text-lg font-bold text-night-900"
            >
              Complaint Detail
            </h2>
            <ComplaintStatusBadge status={complaint.status} />
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-200 hover:text-night-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 px-4 py-4 sm:px-6 sm:py-5">
          {/* Layer tag */}
          <div className="flex items-center gap-2">
            {isMember ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-arabic/20 bg-arabic/10 px-2.5 py-1 text-xs font-semibold text-arabic">
                <User className="h-3.5 w-3.5" />
                Member Complaint
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-studies/20 bg-studies/10 px-2.5 py-1 text-xs font-semibold text-studies">
                <Building2 className="h-3.5 w-3.5" />
                Institute Complaint
              </span>
            )}
          </div>

          {/* Report text */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Report
            </p>
            <p className="rounded-lg border border-cream-200 bg-cream-100 p-3 text-sm leading-relaxed text-night-900 break-words">
              {complaint.reportText}
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-cream-200 bg-cream-100 p-3">
              <p className="mb-1 text-xs text-ink-soft">Filed by</p>
              <p className="font-semibold text-night-900">
                {complaint.reporter?.name ?? complaint.reporterRole ?? "—"}
              </p>
              <p className="text-xs text-ink-soft capitalize">
                {complaint.reporter?.role?.toLowerCase() ?? complaint.reporterRole?.toLowerCase() ?? "—"}
              </p>
            </div>

            {isMember && (
              <div className="rounded-lg border border-cream-200 bg-cream-100 p-3">
                <p className="mb-1 text-xs text-ink-soft">Reported</p>
                <p className="font-semibold text-night-900">
                  {(complaint as MemberComplaint).reported?.name
                    ?? ((complaint as MemberComplaint).reportedId
                      ? `ID: ${(complaint as MemberComplaint).reportedId!.slice(-8)}`
                      : "—")}
                </p>
                <p className="text-xs text-ink-soft capitalize">
                  {(complaint as MemberComplaint).reportedRole?.toLowerCase() ?? "—"}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-cream-200 bg-cream-100 p-3">
              <p className="mb-1 text-xs text-ink-soft">Institute</p>
              <p className="font-semibold text-night-900">
                {complaint.institute?.name ?? complaint.instituteId ?? "—"}
              </p>
            </div>

            <div className="rounded-lg border border-cream-200 bg-cream-100 p-3">
              <p className="mb-1 text-xs text-ink-soft">Filed on</p>
              <p className="flex items-center gap-1 font-semibold text-night-900 text-xs sm:text-sm">
                <Calendar className="h-3.5 w-3.5 text-ink-soft shrink-0" />
                {formatDate(complaint.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 px-4 py-3 sm:px-6 sm:py-4">
          {/* Withdraw */}
          {canWithdraw && complaint.status === "PENDING" && !confirmWithdraw && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmWithdraw(true)}
              disabled={isPending}
            >
              Withdraw
            </Button>
          )}
          {confirmWithdraw && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-error">Withdraw this complaint?</p>
              <Button
                variant="danger"
                size="sm"
                loading={isPending}
                onClick={handleWithdraw}
              >
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmWithdraw(false)}
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="ml-auto flex gap-3">
            {onStatusChange && (
              <Button
                variant={complaint.status === "PENDING" ? "primary" : "ghost"}
                size="sm"
                loading={isPending}
                onClick={handleToggleStatus}
              >
                {complaint.status === "PENDING" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Resolved
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4" />
                    Reopen
                  </>
                )}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
