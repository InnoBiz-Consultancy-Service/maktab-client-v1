"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Batch, Lesson, Student } from "@/types/shared/homework";
import { Button, Card, Input, Textarea, Select } from "@/components/ui";
import { createHomework, getBatchStudents } from "@/actions/homework";
import { toast } from "sonner";
import { ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface CreateHomeworkFormProps {
  batches: Batch[];
  lessons: Lesson[];
  students?: Student[];
}

export function CreateHomeworkForm({
  batches,
  lessons,
  students: initialStudents = [],
}: CreateHomeworkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState<Student[]>(initialStudents);

  // Form states
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [batchId, setBatchId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [assignedDate, setAssignedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [gradingType, setGradingType] = useState<"graded" | "completion">(
    "graded",
  );
  const [maxScore, setMaxScore] = useState<string>("10");
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);
  const [targetType, setTargetType] = useState<"BATCH" | "SPECIFIC">("BATCH");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic student loading on batch change
  useEffect(() => {
    if (!batchId) {
      setStudents([]);
      setSelectedStudentIds([]);
      return;
    }

    const fetchStudents = async () => {
      setLoadingStudents(true);
      const res = await getBatchStudents(batchId);
      setLoadingStudents(false);
      if (res.ok) {
        setStudents(res.data);
        // Initially leave all students unselected so teacher selects them manually
        setSelectedStudentIds([]);
      } else {
        toast.error("Failed to load students for this batch");
      }
    };

    fetchStudents();
  }, [batchId]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title cannot be empty";
    else if (title.length > 200)
      newErrors.title = "Title cannot exceed 200 characters";

    if (!instruction.trim())
      newErrors.instruction = "Instructions cannot be empty";
    else if (instruction.length > 5000)
      newErrors.instruction = "Instructions cannot exceed 5000 characters";

    if (!batchId) newErrors.batchId = "Please select a batch";

    if (!dueDate) newErrors.dueDate = "Please select a due date";
    else if (dueDate < assignedDate) {
      newErrors.dueDate = "Due date must be on or after the assigned date";
    }

    if (gradingType === "graded") {
      const parsedMax = Number(maxScore);
      if (!maxScore || isNaN(parsedMax) || parsedMax <= 0) {
        newErrors.maxScore = "Max score must be a positive number";
      }
    }

    if (selectedStudentIds.length === 0) {
      newErrors.students = "Please select at least one student";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve the validation errors");
      return;
    }

    setLoading(true);
    const isAllSelected = selectedStudentIds.length === students.length;
    const finalTargetType = isAllSelected ? "BATCH" : "SPECIFIC";
    const finalStudentIds = isAllSelected ? null : selectedStudentIds;

    const result = await createHomework({
      title,
      instruction,
      batchId,
      lessonId: lessonId || null,
      assignedDate,
      dueDate,
      status,
      maxScore: gradingType === "graded" ? Number(maxScore) : null,
      allowLateSubmission,
      targetType: finalTargetType,
      studentIds: finalStudentIds,
    });

    setLoading(false);

    if (result.ok) {
      toast.success(result.message || "Homework created successfully!");
      router.push("/dashboard/teacher/homework");
      router.refresh();
    } else {
      if (
        (result as any).errorSource &&
        (result as any).errorSource.length > 0
      ) {
        const fieldErrors: Record<string, string> = {};
        (result as any).errorSource.forEach((err: any) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Please resolve the validation errors");
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/teacher/homework"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-night-900">
            Create New Homework
          </h1>
          <p className="text-sm text-ink-soft">
            Publish a new assignment for your students.
          </p>
        </div>
      </div>

      <Card className="space-y-5 border border-cream-200 p-6 shadow-soft">
        <div className="flex w-fit items-center gap-2 rounded-md bg-quran-soft/30 px-3 py-1.5 text-sm font-bold text-quran">
          <Sparkles className="h-4 w-4" />
          <span>Basic Details</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-night-900">
            Homework Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Surah Al-Fatiha — memorise and write"
            disabled={loading}
          />
          {errors.title && <p className="text-xs text-error">{errors.title}</p>}
        </div>

        {/* Instructions */}
        <div className="space-y-1">
          <Textarea
            label="Instructions *"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Write clear instructions for students..."
            rows={5}
            disabled={loading}
            error={errors.instruction}
          />
          <p className="text-right text-xs text-ink-soft/60">
            {instruction.length}/5000 chars
          </p>
        </div>

        {/* Batch and Lesson */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-night-900">
              Batch *
            </label>
            <Select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
            {errors.batchId && (
              <p className="text-xs text-error">{errors.batchId}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-night-900">
              Link Lesson (Optional)
            </label>
            <Select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              disabled={loading}
            >
              <option value="">None</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {batchId && (
        <>
          <Card className="space-y-5 border border-cream-200 p-6 shadow-soft">
            <div className="flex w-fit items-center gap-2 rounded-md bg-studies-soft/30 px-3 py-1.5 text-sm font-bold text-studies">
              <Sparkles className="h-4 w-4" />
              <span>Grading & Timeline</span>
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-night-900">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={assignedDate}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-night-900">
                  Due Date *
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={loading}
                />
                {errors.dueDate && (
                  <p className="text-xs text-error">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Grading settings */}
            <div className="grid items-end gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-night-900">
                  Grading Option
                </label>
                <Select
                  value={gradingType}
                  onChange={(e) => setGradingType(e.target.value as any)}
                  disabled={loading}
                >
                  <option value="graded">Score Grading</option>
                  <option value="completion">Completion Only (Ungraded)</option>
                </Select>
              </div>

              {gradingType === "graded" && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-night-900">
                    Maximum Score
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    disabled={loading}
                  />
                  {errors.maxScore && (
                    <p className="text-xs text-error">{errors.maxScore}</p>
                  )}
                </div>
              )}
            </div>

            {/* Allow late submission */}
            <div className="flex items-center gap-3 rounded-lg border border-cream-200/50 bg-cream-50/50 p-3">
              <input
                type="checkbox"
                id="allowLate"
                checked={allowLateSubmission}
                onChange={(e) => setAllowLateSubmission(e.target.checked)}
                className="border-cream-300 h-4.5 w-4.5 rounded text-gold-500 accent-gold-500"
                disabled={loading}
              />
              <label
                htmlFor="allowLate"
                className="text-sm font-medium text-night-900 select-none"
              >
                Allow Late Submissions
                <span className="block text-xs font-normal text-ink-soft">
                  When checked, students can submit homework after the due date,
                  marked as "Submitted late".
                </span>
              </label>
            </div>
          </Card>

          <Card className="space-y-5 border border-cream-200 p-6 shadow-soft">
            <div className="flex w-fit items-center gap-2 rounded-md bg-arabic-soft/30 px-3 py-1.5 text-sm font-bold text-arabic">
              <Sparkles className="h-4 w-4" />
              <span>Audience & Publishing</span>
            </div>

            {/* Student list */}
            <div className="space-y-2">
              <div className="mb-1 flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-night-900">
                  Assign to Students *
                </label>
                {students.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedStudentIds.length === students.length) {
                        setSelectedStudentIds([]);
                      } else {
                        setSelectedStudentIds(students.map((s) => s.id));
                      }
                    }}
                    className="hover:text-gold-700 text-xs font-semibold text-gold-600 transition-colors"
                  >
                    {selectedStudentIds.length === students.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                )}
              </div>
              <div className="grid max-h-60 min-h-[100px] items-center justify-center gap-2 overflow-y-auto rounded-lg border border-cream-200 bg-cream-50/20 p-3 sm:grid-cols-2">
                {loadingStudents ? (
                  <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gold-500" />
                    <p className="text-xs text-ink-soft">Loading students...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="col-span-2 py-4 text-center text-xs text-ink-soft">
                    No students found in this batch
                  </div>
                ) : (
                  students.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    return (
                      <div
                        key={student.id}
                        onClick={() =>
                          !loading && handleStudentToggle(student.id)
                        }
                        className={`flex cursor-pointer items-center justify-between rounded-md border p-2.5 transition-all select-none ${
                          isSelected
                            ? "border-gold-500/40 bg-gold-500/10 text-night-900"
                            : "hover:border-cream-300 border-cream-200 bg-white text-night-900 hover:bg-cream-50/50"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {student.name}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {student.studentCode}
                          </p>
                        </div>
                        {isSelected ? (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500 p-0.5 text-white shadow-sm">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="border-cream-300 h-5 w-5 shrink-0 rounded-full border-2 bg-white transition-colors" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {(errors.students || errors.studentIds) && (
                <p className="text-xs text-error">
                  {errors.students || errors.studentIds}
                </p>
              )}
            </div>

            {/* Publish status */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-night-900">
                Status
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                disabled={loading}
              >
                <option value="PUBLISHED">
                  Published (Visible to students immediately)
                </option>
                <option value="DRAFT">Draft (Only visible to you)</option>
              </Select>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/dashboard/teacher/homework"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-cream-200 bg-transparent px-6 font-display text-[15px] font-semibold text-night-900 transition-all duration-150 hover:scale-[1.02] hover:bg-cream-50 active:scale-95"
            >
              Cancel
            </Link>
            <Button type="submit" loading={loading} className="px-8">
              Save Assignment
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
