"use client";

import { useState, useEffect, useTransition } from "react";
import { X, AlertTriangle, Building2, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import {
  fileMemberComplaintAction,
  fileInstituteComplaintAction,
  getTeacherDirectoryAction,
  getParentInstitutesAction,
} from "@/actions/complaints";
import type {
  ReportedRole,
  TeacherDirectoryItem,
  ParentInstituteItem,
  MemberComplaint,
  InstituteComplaint,
} from "@/types/shared/complaint";

type Layer = "MEMBER" | "INSTITUTE";

interface FileComplaintModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the newly created complaint after a successful submit. */
  onSuccess?: (complaint: MemberComplaint | InstituteComplaint, layer: Layer) => void;
  /** If provided, Member tab pre-fills the Institute ID and hides the institute field. */
  defaultInstituteId?: string;
  /** Role of the currently authenticated user. */
  role: "TEACHER" | "PARENT";
}

export function FileComplaintModal({
  open,
  onClose,
  onSuccess,
  defaultInstituteId,
  role,
}: FileComplaintModalProps) {
  const [layer, setLayer] = useState<Layer>("MEMBER");
  const [isPending, startTransition] = useTransition();

  // Allowed reported roles based on caller role
  // TEACHER: can report TEACHER or STUDENT
  // PARENT: can report TEACHER only
  const reportedRoleOptions: { value: ReportedRole; label: string }[] =
    role === "TEACHER"
      ? [
          { value: "TEACHER", label: "Teacher (Colleague)" },
          { value: "STUDENT", label: "Student" },
        ]
      : [{ value: "TEACHER", label: "Teacher" }];

  // Layer 1 fields
  const [reportText, setReportText] = useState("");
  const [reportedId, setReportedId] = useState("");
  const [reportedRole, setReportedRole] = useState<ReportedRole>("TEACHER");
  const [instituteId, setInstituteId] = useState(defaultInstituteId ?? "");

  // Layer 2 fields
  const [instituteReportText, setInstituteReportText] = useState("");
  const [instituteIdL2, setInstituteIdL2] = useState(defaultInstituteId ?? "");

  // Directory & Institute lookups state
  const [parentInstitutes, setParentInstitutes] = useState<ParentInstituteItem[]>([]);
  const [loadingInstitutes, setLoadingInstitutes] = useState(false);

  const [teachers, setTeachers] = useState<TeacherDirectoryItem[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. Fetch parent's institutes on modal open for PARENT role
  useEffect(() => {
    if (!open || role !== "PARENT") return;

    let isMounted = true;
    setLoadingInstitutes(true);

    getParentInstitutesAction().then((res) => {
      if (!isMounted) return;
      setLoadingInstitutes(false);
      if (res.ok && res.data) {
        const list = Array.isArray(res.data) ? res.data : [];
        setParentInstitutes(list);
        if (list.length === 1) {
          const singleInstId = list[0].id;
          setInstituteId(singleInstId);
          setInstituteIdL2(singleInstId);
        }
      } else if (!res.ok) {
        setParentInstitutes([]);
        toast.error(res.error || "Failed to load your institutes");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [open, role]);

  // 2. Fetch teacher directory when reportedRole is TEACHER
  useEffect(() => {
    if (!open || reportedRole !== "TEACHER") return;

    // For parent, only fetch if an institute is selected
    if (role === "PARENT" && !instituteId) {
      setTeachers([]);
      return;
    }

    let isMounted = true;
    setLoadingTeachers(true);

    getTeacherDirectoryAction({
      instituteId: role === "PARENT" ? instituteId : undefined,
    }).then((res) => {
      if (!isMounted) return;
      setLoadingTeachers(false);
      if (res.ok && res.data) {
        const list = Array.isArray(res.data) ? res.data : [];
        setTeachers(list);
      } else if (!res.ok) {
        setTeachers([]);
        toast.error(res.error || "Failed to load teacher directory");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [open, reportedRole, instituteId, role]);

  const resetForm = () => {
    setReportText("");
    setReportedId("");
    setReportedRole("TEACHER");
    setInstituteId(defaultInstituteId ?? "");
    setInstituteReportText("");
    setInstituteIdL2(defaultInstituteId ?? "");
    setParentInstitutes([]);
    setTeachers([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateMember = () => {
    const errs: Record<string, string> = {};
    if (!reportText.trim() || reportText.trim().length < 5)
      errs.reportText = "Report must be at least 5 characters.";
    if (reportText.trim().length > 2000)
      errs.reportText = "Report must not exceed 2000 characters.";
    if (!reportedId.trim()) errs.reportedId = "Please select or enter reported member.";
    if (role === "PARENT" && !instituteId.trim())
      errs.instituteId = "Please select an institute.";
    return errs;
  };

  const validateInstitute = () => {
    const errs: Record<string, string> = {};
    if (!instituteReportText.trim() || instituteReportText.trim().length < 5)
      errs.instituteReportText = "Report must be at least 5 characters.";
    if (instituteReportText.trim().length > 2000)
      errs.instituteReportText = "Report must not exceed 2000 characters.";
    if (role === "PARENT" && !instituteIdL2.trim())
      errs.instituteIdL2 = "Please select an institute.";
    return errs;
  };

  const handleSubmit = () => {
    if (layer === "MEMBER") {
      const errs = validateMember();
      if (Object.keys(errs).length > 0) return setErrors(errs);
      setErrors({});

      startTransition(async () => {
        const res = await fileMemberComplaintAction({
          reportText: reportText.trim(),
          reportedId: reportedId.trim() || undefined,
          reportedRole,
          instituteId: instituteId.trim() || undefined,
        });

        if (res.ok) {
          toast.success("Complaint filed successfully.");
          if (res.data) onSuccess?.(res.data, "MEMBER");
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
          reportText: instituteReportText.trim(),
          instituteId: instituteIdL2.trim() || undefined,
        });

        if (res.ok) {
          toast.success("Complaint filed successfully.");
          if (res.data) onSuccess?.(res.data, "INSTITUTE");
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
              {/* Parent Institute Selector */}
              {role === "PARENT" && (
                <div>
                  {loadingInstitutes ? (
                    <div className="flex items-center gap-2 text-xs text-ink-soft py-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading your child's institutes…
                    </div>
                  ) : (
                    <Select
                      id="complaint-parent-institute"
                      label="Select Institute"
                      value={instituteId}
                      onChange={(e) => {
                        setInstituteId(e.target.value);
                        setReportedId(""); // Reset teacher selection when institute changes
                      }}
                      error={errors.instituteId}
                    >
                      <option value="">-- Choose Institute --</option>
                      {parentInstitutes.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              )}

              {/* Who are you reporting? */}
              <Select
                id="complaint-reported-role"
                label="Who are you reporting?"
                value={reportedRole}
                onChange={(e) => {
                  setReportedRole(e.target.value as ReportedRole);
                  setReportedId("");
                }}
                disabled={role === "PARENT"} // Locked to Teacher for Parent
              >
                {reportedRoleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>

              {/* Reported Target Picker */}
              {reportedRole === "TEACHER" ? (
                <div>
                  {loadingTeachers ? (
                    <div className="flex items-center gap-2 text-xs text-ink-soft py-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading teacher directory…
                    </div>
                  ) : (
                    <Select
                      id="complaint-reported-teacher"
                      label="Select Teacher"
                      value={reportedId}
                      onChange={(e) => setReportedId(e.target.value)}
                      error={errors.reportedId}
                      disabled={role === "PARENT" && !instituteId}
                    >
                      <option value="">-- Choose Teacher --</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              ) : (
                <Input
                  id="complaint-reported-id"
                  label="Reported Student ID"
                  placeholder="e.g. cstudent456id"
                  value={reportedId}
                  onChange={(e) => setReportedId(e.target.value)}
                  error={errors.reportedId}
                />
              )}

              <Textarea
                id="complaint-report"
                label="Your report"
                placeholder="Describe the issue in detail (5–2000 characters)…"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                error={errors.reportText}
                rows={5}
              />
              <p className="text-right text-xs text-ink-soft">
                {reportText.length} / 2000
              </p>
            </>
          ) : (
            <>
              {/* Parent Institute Selector for Layer 2 */}
              {role === "PARENT" ? (
                <div>
                  {loadingInstitutes ? (
                    <div className="flex items-center gap-2 text-xs text-ink-soft py-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading your child's institutes…
                    </div>
                  ) : (
                    <Select
                      id="complaint-parent-institute-l2"
                      label="Select Institute to Report"
                      value={instituteIdL2}
                      onChange={(e) => setInstituteIdL2(e.target.value)}
                      error={errors.instituteIdL2}
                    >
                      <option value="">-- Choose Institute --</option>
                      {parentInstitutes.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              ) : null}

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
                value={instituteReportText}
                onChange={(e) => setInstituteReportText(e.target.value)}
                error={errors.instituteReportText}
                rows={5}
              />
              <p className="text-right text-xs text-ink-soft">
                {instituteReportText.length} / 2000
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

