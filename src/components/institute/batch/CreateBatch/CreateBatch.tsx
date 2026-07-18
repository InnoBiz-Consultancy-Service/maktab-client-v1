"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Layers,
  GraduationCap,
  Baby,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import {
  MultiSearchPicker,
  type PickerItem,
} from "@/components/shared/MultiSearchPicker";
import { searchTeachersAction } from "@/actions/institute/teacher/get-teacher";
import { searchStudentsAction } from "@/actions/institute/student/get-students";
import { createBatchAction } from "@/actions/institute/batch/create-batch";
import type { Batch } from "@/types/institute/batch";

export function CreateBatchForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [teachers, setTeachers] = useState<PickerItem[]>([]);
  const [students, setStudents] = useState<PickerItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Batch | null>(null);

  const searchTeachers = useCallback(
    async (term: string): Promise<PickerItem[]> => {
      const res = await searchTeachersAction(term);
      if (!res.ok) {
        toast.error(res.error);
        return [];
      }
      return res.data.map((t) => ({
        id: t.id,
        title: t.name,
        subtitle: [t.user?.email, t.phone].filter(Boolean).join(" · "),
      }));
    },
    [],
  );

  const searchStudents = useCallback(
    async (term: string): Promise<PickerItem[]> => {
      const res = await searchStudentsAction(term);
      if (!res.ok) {
        toast.error(res.error);
        return [];
      }
      return res.data.map((s) => ({
        id: s.id,
        title: s.name,
        subtitle: [s.class, s.studentCode].filter(Boolean).join(" · "),
      }));
    },
    [],
  );

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    else if (name.trim().length > 150) e.name = "Name is too long";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;

    setSubmitting(true);
    const res = await createBatchAction({
      name: name.trim(),
      teacherIds: teachers.map((t) => t.id),
      studentIds: students.map((s) => s.id),
    });
    setSubmitting(false);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }

    toast.success(`${res.data.name} was created.`);
    setCreated(res.data);
  }

  function reset() {
    setName("");
    setTeachers([]);
    setStudents([]);
    setErrors({});
    setCreated(null);
  }

  // ============ SUCCESS SCREEN ============
  if (created) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
            <Check className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-bold text-night-900">
              {created.name} has been created
            </h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              {created.teachers.length} teacher
              {created.teachers.length === 1 ? "" : "s"} ·{" "}
              {created.students.length} student
              {created.students.length === 1 ? "" : "s"} assigned.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            block
            className="flex-1"
            onClick={() =>
              router.push(`/dashboard/institute/batches/${created.id}`)
            }
          >
            Manage this batch
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="ghost"
            block
            className="flex-1"
            onClick={reset}
          >
            Create another
          </Button>
        </div>
      </Card>
    );
  }

  // ============ FORM ============
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold-500/20 text-gold-600">
          <Layers className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-bold text-night-900">Create a batch</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Give it a name, then optionally assign teachers and students now —
            you can always add more later.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Input
          label="Batch name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="e.g. Class 5 - Morning"
        />

        <MultiSearchPicker
          label="Teachers (optional)"
          placeholder="Search teachers by name, email, or phone…"
          onSearch={searchTeachers}
          selected={teachers}
          onChange={setTeachers}
        />

        <MultiSearchPicker
          label="Students (optional)"
          placeholder="Search students by name, code, or class…"
          onSearch={searchStudents}
          selected={students}
          onChange={setStudents}
        />

        <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
          <Button
            type="button"
            size="lg"
            onClick={submit}
            loading={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Creating…" : "Create batch"}
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-ink-soft">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <Baby className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Assigning now is optional.
          </p>
        </div>
      </div>
    </Card>
  );
}
