"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { StudentMarkRow } from "./StudentMarkRow";
import { RosterSummaryBar } from "./RosterSummaryBar";
import { FinalizeBar } from "./FinalizeBar";
import { EditRecordModal } from "./EditRecordModal";
import { markAttendanceAction } from "@/actions/attendance/mark-attendance";
import { editRecordAction } from "@/actions/attendance/edit-record";
import type {
  RosterResponse,
  AttendanceStatus,
  RosterStudent,
} from "@/types/attendance";
import { ConfirmModal } from "@/components/shared/attendance/ConfirmModal";

interface AttendanceRosterProps {
  roster: RosterResponse;
}

export function AttendanceRoster({ roster }: AttendanceRosterProps) {
  const router = useRouter();
  const { day, batch, students: initialStudents } = roster;
  const canEdit = day.canEdit;
  const isFinalized = day.signedOff;

  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(
      initialStudents.map((s) => [s.id, s.status ?? "PRESENT"]),
    ),
  );

  const [students, setStudents] = useState<RosterStudent[]>(initialStudents);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    student: RosterStudent;
  } | null>(null);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  const counts: Record<AttendanceStatus, number> = {
    PRESENT: Object.values(marks).filter((m) => m === "PRESENT").length,
    ABSENT: Object.values(marks).filter((m) => m === "ABSENT").length,
    LATE: Object.values(marks).filter((m) => m === "LATE").length,
  };

  const handleChange = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      setMarks((prev) => ({ ...prev, [studentId]: status }));
    },
    [],
  );

  async function handleSave(finalize: boolean) {
    setSaving(true);
    const records = Object.entries(marks).map(([studentId, status]) => ({
      studentId,
      status,
    }));

    const res = await markAttendanceAction(day.id, { records, finalize });
    setSaving(false);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    setStudents(res.data.students);

    if (finalize) {
      toast.success("Attendance finalized");
      router.refresh();
    } else {
      toast.success("Draft saved");
    }
  }

  function handleFinalizeClick() {
    setShowFinalizeConfirm(true);
  }

  function handleFinalizeConfirm() {
    setShowFinalizeConfirm(false);
    handleSave(true);
  }

  async function handleEditSubmit(status: AttendanceStatus, reason: string) {
    if (!editTarget) return;
    const recordId = editTarget.student.recordId;
    if (!recordId) {
      toast.error("No record to edit");
      return;
    }

    const res = await editRecordAction(recordId, {
      status,
      reason: reason || undefined,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    setMarks((prev) => ({
      ...prev,
      [editTarget.student.id]: status,
    }));

    toast.success(`Updated to ${status.toLowerCase()}`);
  }

  // ── Read-only (another teacher owns) ──
  if (!canEdit) {
    return (
      <>
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-warn/30 bg-warn/10 px-4 py-3">
          <Lock className="h-4 w-4 shrink-0 text-warn" aria-hidden />
          <p className="text-sm text-night-900">
            {day.takenBy.name} is taking this attendance. You can only view.
          </p>
        </div>

        <RosterSummaryBar counts={counts} />

        <div className="mt-3 rounded-lg bg-cream-50 shadow-soft">
          <ul className="divide-y divide-cream-200">
            {students.map((s) => (
              <StudentMarkRow
                key={s.id}
                studentId={s.id}
                name={s.name}
                studentCode={s.studentCode}
                status={marks[s.id]}
                disabled
                onChange={() => {}}
              />
            ))}
          </ul>
        </div>
      </>
    );
  }

  // ── Finalized — individual edits ──
  if (isFinalized) {
    return (
      <>
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
          <p className="text-sm text-night-900">
            Finalized. Tap a student to edit their record.
          </p>
        </div>

        <RosterSummaryBar counts={counts} />

        <div className="mt-3 rounded-lg bg-cream-50 shadow-soft">
          <ul className="divide-y divide-cream-200">
            {students.map((s) => (
              <li
                key={s.id}
                className="cursor-pointer transition-colors hover:bg-cream-100"
                onClick={() => setEditTarget({ student: s })}
              >
                <StudentMarkRow
                  studentId={s.id}
                  name={s.name}
                  studentCode={s.studentCode}
                  status={marks[s.id]}
                  disabled
                  onChange={() => {}}
                />
              </li>
            ))}
          </ul>
        </div>

        {editTarget && (
          <EditRecordModal
            open
            studentName={editTarget.student.name}
            currentStatus={marks[editTarget.student.id]}
            onClose={() => setEditTarget(null)}
            onSubmit={handleEditSubmit}
          />
        )}
      </>
    );
  }

  // ── Active marking ──
  return (
    <>
      <RosterSummaryBar counts={counts} />

      <div className="mt-3 mb-4 rounded-lg bg-cream-50 shadow-soft">
        <ul className="divide-y divide-cream-200">
          {students.map((s) => (
            <StudentMarkRow
              key={s.id}
              studentId={s.id}
              name={s.name}
              studentCode={s.studentCode}
              status={marks[s.id]}
              onChange={handleChange}
            />
          ))}
        </ul>
      </div>

      <FinalizeBar
        saving={saving}
        onSave={() => handleSave(false)}
        onFinalize={handleFinalizeClick}
      />

      <ConfirmModal
        open={showFinalizeConfirm}
        title="Finalize attendance?"
        description={`This will lock today's attendance for ${batch.name}. You can still edit individual records after finalizing. ${counts.ABSENT} student(s) marked absent, ${counts.LATE} late.`}
        confirmLabel="Finalize"
        onConfirm={handleFinalizeConfirm}
        onCancel={() => setShowFinalizeConfirm(false)}
      />
    </>
  );
}
