"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Check,
  X,
  Loader2,
  Power,
  PowerOff,
  UserPlus,
  UserRoundPlus,
  GraduationCap,
  Baby,
  Inbox,
} from "lucide-react";
import { Card, Input } from "@/components/ui";
import {
  MultiSearchPicker,
  type PickerItem,
} from "@/components/shared/MultiSearchPicker";
import { searchTeachersAction } from "@/actions/institute/teacher/get-teacher";
import { searchStudentsAction } from "@/actions/institute/student/get-students";
import { updateBatchAction } from "@/actions/institute/batch/update-batch";
import { toggleBatchStatusAction } from "@/actions/institute/batch/toggle-batch-status";
import {
  addBatchTeachersAction,
  removeBatchTeachersAction,
} from "@/actions/institute/batch/manage-batch-teachers";
import {
  addBatchStudentsAction,
  removeBatchStudentsAction,
} from "@/actions/institute/batch/manage-batch-students";
import type { Batch } from "@/types/institute/batch";

/** Row-level remove button — small, quiet, with its own pending state. */
function RemoveButton({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await onRemove();
        setPending(false);
      }}
      className="shrink-0 rounded-full p-2 text-ink-soft transition-colors hover:bg-error/10 hover:text-error disabled:pointer-events-none disabled:opacity-60"
      aria-label={label}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <X className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

export function BatchDetail({ batch: initialBatch }: { batch: Batch }) {
  const [batch, setBatch] = useState<Batch>(initialBatch);

  // ---- rename ----
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(batch.name);
  const [nameError, setNameError] = useState<string | undefined>();
  const [savingName, setSavingName] = useState(false);

  // ---- status ----
  const [togglingStatus, setTogglingStatus] = useState(false);

  // ---- add-teachers panel ----
  const [addingTeachers, setAddingTeachers] = useState(false);
  const [pickedTeachers, setPickedTeachers] = useState<PickerItem[]>([]);
  const [savingTeachers, setSavingTeachers] = useState(false);

  // ---- add-students panel ----
  const [addingStudents, setAddingStudents] = useState(false);
  const [pickedStudents, setPickedStudents] = useState<PickerItem[]>([]);
  const [savingStudents, setSavingStudents] = useState(false);

  const existingTeacherIds = new Set(batch.teachers.map((t) => t.id));
  const existingStudentIds = new Set(batch.students.map((s) => s.id));

  const searchTeachers = useCallback(
    async (term: string): Promise<PickerItem[]> => {
      const res = await searchTeachersAction(term);
      if (!res.ok) {
        toast.error(res.error);
        return [];
      }
      return res.data
        .filter((t) => !existingTeacherIds.has(t.id))
        .map((t) => ({
          id: t.id,
          title: t.name,
          subtitle: [t.user?.email, t.phone].filter(Boolean).join(" · "),
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [batch.teachers],
  );

  const searchStudents = useCallback(
    async (term: string): Promise<PickerItem[]> => {
      const res = await searchStudentsAction(term);
      if (!res.ok) {
        toast.error(res.error);
        return [];
      }
      return res.data
        .filter((s) => !existingStudentIds.has(s.id))
        .map((s) => ({
          id: s.id,
          title: s.name,
          subtitle: [s.class, s.studentCode].filter(Boolean).join(" · "),
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [batch.students],
  );

  // ---- handlers ----
  async function saveName() {
    const trimmed = nameDraft.trim();
    if (trimmed.length < 2 || trimmed.length > 150) {
      setNameError("Name must be 2–150 characters");
      return;
    }
    setSavingName(true);
    const res = await updateBatchAction(batch.id, { name: trimmed });
    setSavingName(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setBatch(res.data);
    setEditingName(false);
    setNameError(undefined);
    toast.success("Batch renamed");
  }

  async function toggleStatus() {
    setTogglingStatus(true);
    const res = await toggleBatchStatusAction(batch.id);
    setTogglingStatus(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setBatch(res.data);
    toast.success(res.data.isActive ? "Batch activated" : "Batch deactivated");
  }

  async function saveTeachers() {
    if (pickedTeachers.length === 0) return;
    setSavingTeachers(true);
    const res = await addBatchTeachersAction(
      batch.id,
      pickedTeachers.map((t) => t.id),
    );
    setSavingTeachers(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setBatch(res.data);
    setPickedTeachers([]);
    setAddingTeachers(false);
    toast.success("Teacher(s) added");
  }

  async function removeTeacher(id: string) {
    const res = await removeBatchTeachersAction(batch.id, [id]);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setBatch(res.data);
    toast.success("Teacher removed from batch");
  }

  async function saveStudents() {
    if (pickedStudents.length === 0) return;
    setSavingStudents(true);
    const res = await addBatchStudentsAction(
      batch.id,
      pickedStudents.map((s) => s.id),
    );
    setSavingStudents(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setBatch(res.data);
    setPickedStudents([]);
    setAddingStudents(false);
    toast.success("Student(s) added");
  }

  async function removeStudent(id: string) {
    const res = await removeBatchStudentsAction(batch.id, [id]);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setBatch(res.data);
    toast.success("Student removed from batch");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* Header */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {!editingName ? (
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-bold text-night-900">
                  {batch.name}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(batch.name);
                    setEditingName(true);
                  }}
                  className="shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-cream-100 hover:text-night-900"
                  aria-label="Rename batch"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    label="Batch name"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    error={nameError}
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={saveName}
                  disabled={savingName}
                  className="mt-6.5 shrink-0 rounded-full bg-gold-500 p-2.5 text-night-900 transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
                  aria-label="Save name"
                >
                  {savingName ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Check className="h-4 w-4" aria-hidden />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingName(false);
                    setNameError(undefined);
                  }}
                  className="mt-6.5 shrink-0 rounded-full border border-cream-200 p-2.5 text-ink-soft transition-colors hover:bg-cream-100"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
            <p className="mt-1 text-sm text-ink-soft">
              {batch.teachers.length} teacher
              {batch.teachers.length === 1 ? "" : "s"} · {batch.students.length}{" "}
              student
              {batch.students.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span
              className={
                batch.isActive
                  ? "rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success"
                  : "rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-soft"
              }
            >
              {batch.isActive ? "Active" : "Inactive"}
            </span>
            <button
              type="button"
              onClick={toggleStatus}
              disabled={togglingStatus}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-60"
            >
              {togglingStatus ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : batch.isActive ? (
                <PowerOff className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <Power className="h-3.5 w-3.5" aria-hidden />
              )}
              {batch.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </Card>

      {/* Teachers */}
      <section aria-label="Teachers">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-night-900">
            Teachers
          </h2>
          {!addingTeachers && (
            <button
              type="button"
              onClick={() => setAddingTeachers(true)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-gold-500 px-4 text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <UserPlus className="h-4 w-4" aria-hidden />
              Add
            </button>
          )}
        </div>

        {addingTeachers && (
          <Card className="mb-3">
            <MultiSearchPicker
              label="Search teachers"
              placeholder="Search by name, email, or phone…"
              onSearch={searchTeachers}
              selected={pickedTeachers}
              onChange={setPickedTeachers}
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={saveTeachers}
                disabled={savingTeachers || pickedTeachers.length === 0}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-60"
              >
                {savingTeachers && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                )}
                Add {pickedTeachers.length || ""} teacher
                {pickedTeachers.length === 1 ? "" : "s"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingTeachers(false);
                  setPickedTeachers([]);
                }}
                className="inline-flex min-h-[42px] items-center rounded-full border border-cream-200 px-5 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100"
              >
                Cancel
              </button>
            </div>
          </Card>
        )}

        <Card className="p-0">
          {batch.teachers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Inbox className="h-7 w-7 text-cream-200" aria-hidden />
              <p className="text-sm text-ink-soft">No teachers assigned yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-cream-200">
              {batch.teachers.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-arabic-soft font-display text-sm font-bold text-arabic">
                    {t.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-night-900">
                      {t.name}
                    </p>
                    <p className="truncate text-sm text-ink-soft">
                      {t.user?.email ?? t.phone}
                    </p>
                  </div>
                  <RemoveButton
                    label={`Remove ${t.name} from batch`}
                    onRemove={() => removeTeacher(t.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* Students */}
      <section aria-label="Students">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-night-900">
            Students
          </h2>
          {!addingStudents && (
            <button
              type="button"
              onClick={() => setAddingStudents(true)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-gold-500 px-4 text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <UserRoundPlus className="h-4 w-4" aria-hidden />
              Add
            </button>
          )}
        </div>

        {addingStudents && (
          <Card className="mb-3">
            <MultiSearchPicker
              label="Search students"
              placeholder="Search by name, code, or class…"
              onSearch={searchStudents}
              selected={pickedStudents}
              onChange={setPickedStudents}
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={saveStudents}
                disabled={savingStudents || pickedStudents.length === 0}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95 disabled:pointer-events-none disabled:opacity-60"
              >
                {savingStudents && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                )}
                Add {pickedStudents.length || ""} student
                {pickedStudents.length === 1 ? "" : "s"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingStudents(false);
                  setPickedStudents([]);
                }}
                className="inline-flex min-h-[42px] items-center rounded-full border border-cream-200 px-5 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100"
              >
                Cancel
              </button>
            </div>
          </Card>
        )}

        <Card className="p-0">
          {batch.students.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Inbox className="h-7 w-7 text-cream-200" aria-hidden />
              <p className="text-sm text-ink-soft">No students assigned yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-cream-200">
              {batch.students.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-sm font-bold text-quran">
                    {s.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-night-900">
                      {s.name}
                    </p>
                    <p className="truncate text-sm text-ink-soft">{s.class}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-cream-100 px-2.5 py-1 font-display text-sm font-semibold tracking-wide text-night-900">
                    {s.studentCode}
                  </span>
                  <RemoveButton
                    label={`Remove ${s.name} from batch`}
                    onRemove={() => removeStudent(s.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <p className="flex items-center gap-1.5 text-xs text-ink-soft">
        <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <Baby className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Removing someone here only unlinks them from this batch — their account
        stays intact.
      </p>
    </div>
  );
}
