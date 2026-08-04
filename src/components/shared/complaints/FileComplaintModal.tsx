"use client";

import { useState, useTransition } from "react";
import { X, AlertTriangle, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { fileMemberComplaintAction, fileInstituteComplaintAction } from "@/actions/complaints";
import type { ReportedRole } from "@/types/shared/complaint";

type Layer = "MEMBER" | "INSTITUTE";

interface FileComplaintModalProps {
  open: boolean;
  onClose: () => void;
  /** If provided, Member tab pre-fills the Institute ID and hides the institute field. */
  defaultInstituteId?: string;
  /** Role of the currently authenticated user. */
  role: "TEACHER" | "PARENT";
}

const REPORTED_ROLES: { value: ReportedRole; label: string }[] = [
  { value: "TEACHER", label: "Teacher" },
  { value: "STUDENT", label: "Student" },
  { value: "PARENT", label: "Parent" },
];

export function FileComplaintModal({
  open,
  onClose,
  defaultInstituteId,
  role: _role,
}: FileComplaintModalProps) {
  const [layer, setLayer] = useState<Layer>("MEMBER");
  const [isPending, startTransition] = useTransition();

  // Layer 1 fields
  const [report, setReport] = useState("");
  const [reportedId, setReportedId] = useState("");
  const [reportedRole, setReportedRole] = useState<ReportedRole>("TEACHER");
  const [instituteId, setInstituteId] = useState(defaultInstituteId ?? "");

  // Layer 2 fields
  const [instituteReport, setInstituteReport] = useState("");
  const [instituteIdL2, setInstituteIdL2] = useState(defaultInstituteId ?? "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setReport("");
    setReportedId("");
    setReportedRole("TEACHER");
    setInstituteId(defaultInstituteId ?? "");
    setInstituteReport("");
    setInstituteIdL2(defaultInstituteId ?? "");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateMember = () => {
    const errs: Record<string, string> = {};
    if (!report.trim() || report.trim().length < 5)
      errs.report = "Report must be at least 5 characters.";
    if (report.trim().length > 2000)
      errs.report = "Report must not exceed 2000 characters.";
    if (!reportedId.trim()) errs.reportedId = "Reported member ID is required.";
    if (!instituteId.trim()) errs.instituteId = "Institute ID is required.";
    return errs;
  };

  const validateInstitute = () => {
    const errs: Record<string, string> = {};
    if (!instituteReport.trim() || instituteReport.trim().length < 5)
      errs.instituteReport = "Report must be at least 5 characters.";
    if (instituteReport.trim().length > 2000)
      errs.instituteReport = "Report must not exceed 2000 characters.";
    if (!instituteIdL2.trim()) errs.instituteIdL2 = "Institute ID is required.";
    return errs;
  };

  const handleSubmit = () => {
    if (layer === "MEMBER") {
      const errs = validateMember();
      if (Object.keys(errs).length > 0) return setErrors(errs);
      setErrors({});

      startTransition(async () => {
        const res = await fileMemberComplaintAction({
          report: report.trim(),
          reportedId: reportedId.trim(),
          reportedRole,
          instituteId: instituteId.trim(),
        });

        if (res.ok) {
          toast.success("Complaint filed successfully.");
          handleClose();
        } else {
          toast.error(res.error);
        }
      });
    } else {
      const errs = validateInstitute();
      if (Object.keys(errs).length > 0) return setErrors(errs);
      setErrors({});

      startTransition(async () => {
        const res = await fileInstituteComplaintAction({
          report: instituteReport.trim(),
          instituteId: instituteIdL2.trim(),
        });

        if (res.ok) {
          toast.success("Complaint filed successfully.");
          handleClose();
        } else {
          toast.error(res.error);
        }
      });
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/60 p-3 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="file-complaint-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-cream-200 bg-cream-50 shadow-lift">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="file-complaint-title"
            className="font-display text-base sm:text-lg font-bold text-night-900"
          >
            File a Complaint
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream-200 hover:text-night-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Layer tabs */}
        <div className="flex border-b border-cream-200 px-4 sm:px-6 pt-2 sm:pt-3">
          {(
            [
              { value: "MEMBER", label: "Against a Member", icon: User },
              { value: "INSTITUTE", label: "Against Institute", icon: Building2 },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setLayer(value)}
              className={[
                "mb-[-1px] flex flex-1 sm:flex-initial items-center justify-center gap-1.5 border-b-2 pb-2.5 px-2 sm:pr-4 sm:pl-1 text-xs sm:text-sm font-semibold transition-colors",
                layer === value
                  ? "border-gold-500 text-night-900"
                  : "border-transparent text-ink-soft hover:text-night-900",
              ].join(" ")}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4 px-4 py-4 sm:px-6 sm:py-5">
          {layer === "MEMBER" ? (
            <>
              <Select
                id="complaint-reported-role"
                label="Who are you reporting?"
                value={reportedRole}
                onChange={(e) => setReportedRole(e.target.value as ReportedRole)}
              >
                {REPORTED_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>

              <Input
                id="complaint-reported-id"
                label="Reported Member ID"
                placeholder="e.g. tchr_abc123"
                value={reportedId}
                onChange={(e) => setReportedId(e.target.value)}
                error={errors.reportedId}
              />

              {!defaultInstituteId && (
                <Input
                  id="complaint-institute-id"
                  label="Institute ID"
                  placeholder="e.g. inst_xyz789"
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value)}
                  error={errors.instituteId}
                />
              )}

              <Textarea
                id="complaint-report"
                label="Your report"
                placeholder="Describe the issue in detail (5–2000 characters)…"
                value={report}
                onChange={(e) => setReport(e.target.value)}
                error={errors.report}
                rows={5}
              />
              <p className="text-right text-xs text-ink-soft">
                {report.length} / 2000
              </p>
            </>
          ) : (
            <>
              {!defaultInstituteId && (
                <Input
                  id="complaint-institute-id-l2"
                  label="Institute ID"
                  placeholder="e.g. inst_xyz789"
                  value={instituteIdL2}
                  onChange={(e) => setInstituteIdL2(e.target.value)}
                  error={errors.instituteIdL2}
                />
              )}

              <div className="flex items-start gap-3 rounded-lg border border-warn/20 bg-warn/5 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                <p className="text-sm text-ink-soft">
                  This complaint will be reviewed exclusively by the platform
                  administrator. The institute will not be notified.
                </p>
              </div>

              <Textarea
                id="complaint-institute-report"
                label="Your report"
                placeholder="Describe the issue with the institute in detail (5–2000 characters)…"
                value={instituteReport}
                onChange={(e) => setInstituteReport(e.target.value)}
                error={errors.instituteReport}
                rows={5}
              />
              <p className="text-right text-xs text-ink-soft">
                {instituteReport.length} / 2000
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-cream-200 px-6 py-4">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            loading={isPending}
          >
            Submit Complaint
          </Button>
        </div>
      </div>
    </div>
  );
}
