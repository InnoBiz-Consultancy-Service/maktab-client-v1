"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Homework, Batch, Lesson, Student } from "@/types/shared/homework";
import { Button, Card, Input, Textarea, Select } from "@/components/ui";
import { updateHomework, deleteHomework, getBatchStudents } from "@/actions/homework";
import { toast } from "sonner";
import { ArrowLeft, Check, Sparkles, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface EditHomeworkFormProps {
  homework: Homework & { studentIds?: string[] };
  batches: Batch[];
  lessons: Lesson[];
  students?: Student[];
  submissionCount: number;
}

export function EditHomeworkForm({
  homework,
  batches,
  lessons,
  students: initialStudents = [],
  submissionCount,
}: EditHomeworkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasSubmissions = submissionCount > 0;

  // Form states
  const [title, setTitle] = useState(homework.title);
  const [instruction, setInstruction] = useState(homework.instruction);
  const [batchId, setBatchId] = useState(homework.batch.id);
  const [lessonId, setLessonId] = useState(homework.lesson?.id || "");
  const [assignedDate, setAssignedDate] = useState(homework.assignedDate);
  const [dueDate, setDueDate] = useState(homework.dueDate);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(homework.status);
  const [gradingType, setGradingType] = useState<"graded" | "completion">(
    homework.maxScore !== null ? "graded" : "completion"
  );
  const [maxScore, setMaxScore] = useState<string>(homework.maxScore?.toString() || "10");
  const [allowLateSubmission, setAllowLateSubmission] = useState(homework.allowLateSubmission);
  const [targetType, setTargetType] = useState<"BATCH" | "SPECIFIC">(homework.targetType);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(homework.studentIds || []);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic student loading on batch change
  useEffect(() => {
    if (hasSubmissions || !batchId) return;

    const fetchStudents = async () => {
      setLoadingStudents(true);
      const res = await getBatchStudents(batchId);
      setLoadingStudents(false);
      if (res.ok) {
        setStudents(res.data);
        // If this is the batch from the original homework and it was targetType BATCH, select all.
        // If they change the batch, select all new students by default.
        if (batchId === homework.batch.id && homework.targetType === "BATCH") {
          setSelectedStudentIds(res.data.map((s) => s.id));
        } else if (batchId !== homework.batch.id) {
          setSelectedStudentIds(res.data.map((s) => s.id));
        }
      } else {
        toast.error("Failed to load students for this batch");
      }
    };

    fetchStudents();
  }, [batchId, hasSubmissions, homework.batch.id, homework.targetType]);

  const handleStudentToggle = (studentId: string) => {
    if (hasSubmissions) return; // Cannot edit target audience
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title cannot be empty";
    else if (title.length > 200) newErrors.title = "Title cannot exceed 200 characters";

    if (!instruction.trim()) newErrors.instruction = "Instructions cannot be empty";
    else if (instruction.length > 5000) newErrors.instruction = "Instructions cannot exceed 5000 characters";

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

    const result = await updateHomework(homework.id, {
      title,
      instruction,
      batchId: hasSubmissions ? undefined : batchId,
      lessonId: lessonId || null,
      assignedDate,
      dueDate,
      status,
      maxScore: gradingType === "graded" ? Number(maxScore) : null,
      allowLateSubmission,
      targetType: hasSubmissions ? undefined : finalTargetType,
      studentIds: hasSubmissions ? undefined : finalStudentIds,
    });

    setLoading(false);

    if (result.ok) {
      toast.success(result.message || "Homework updated successfully!");
      router.push("/dashboard/teacher/homework");
      router.refresh();
    } else {
      if ((result as any).errorSource && (result as any).errorSource.length > 0) {
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

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteHomework(homework.id);
    setLoading(false);

    if (result.ok) {
      toast.success(result.message || "Homework deleted successfully!");
      router.push("/dashboard/teacher/homework");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/teacher/homework"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-night-900">Edit Homework</h1>
          <p className="text-sm text-ink-soft">Update your homework assignment details or delete it.</p>
        </div>
      </div>

      {hasSubmissions && (
        <div className="flex gap-3 bg-warn/10 border border-warn/20 rounded-lg p-4 text-sm text-night-900">
          <AlertTriangle className="h-5 w-5 text-warn shrink-0" />
          <div>
            <p className="font-semibold text-warn">Target Controls Locked</p>
            <p className="text-ink-soft text-xs mt-0.5">
              Some configurations (Batch, Target Audience, and Student List) cannot be edited because students have already submitted their homework.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 border border-cream-200 shadow-soft space-y-5">
          <div className="flex items-center gap-2 text-quran font-bold text-sm bg-quran-soft/30 px-3 py-1.5 rounded-md w-fit">
            <Sparkles className="h-4 w-4" />
            <span>Basic Details</span>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-night-900">Homework Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Surah Al-Fatiha"
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
            <p className="text-right text-xs text-ink-soft/60">{instruction.length}/5000 chars</p>
          </div>

          {/* Batch and Lesson */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-night-900">Batch *</label>
              <Select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                disabled={loading || hasSubmissions}
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-night-900">Link Lesson (Optional)</label>
              <Select value={lessonId} onChange={(e) => setLessonId(e.target.value)} disabled={loading}>
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

        <Card className="p-6 border border-cream-200 shadow-soft space-y-5">
          <div className="flex items-center gap-2 text-studies font-bold text-sm bg-studies-soft/30 px-3 py-1.5 rounded-md w-fit">
            <Sparkles className="h-4 w-4" />
            <span>Grading & Timeline</span>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-night-900">Start Date</label>
              <Input
                type="date"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-night-900">Due Date *</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
              {errors.dueDate && <p className="text-xs text-error">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Grading settings */}
          <div className="grid gap-4 sm:grid-cols-2 items-end">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-night-900">Grading Option</label>
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
                <label className="text-sm font-semibold text-night-900">Maximum Score</label>
                <Input
                  type="number"
                  min="1"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  disabled={loading}
                />
                {errors.maxScore && <p className="text-xs text-error">{errors.maxScore}</p>}
              </div>
            )}
          </div>

          {/* Allow late submission */}
          <div className="flex items-center gap-3 bg-cream-50/50 p-3 rounded-lg border border-cream-200/50">
            <input
              type="checkbox"
              id="allowLate"
              checked={allowLateSubmission}
              onChange={(e) => setAllowLateSubmission(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-cream-300 text-gold-500 accent-gold-500"
              disabled={loading}
            />
            <label htmlFor="allowLate" className="text-sm font-medium text-night-900 select-none">
              Allow Late Submissions
              <span className="block text-xs font-normal text-ink-soft">
                When checked, students can submit homework after the due date, marked as "Submitted late".
              </span>
            </label>
          </div>
        </Card>

        <Card className="p-6 border border-cream-200 shadow-soft space-y-5">
          <div className="flex items-center gap-2 text-arabic font-bold text-sm bg-arabic-soft/30 px-3 py-1.5 rounded-md w-fit">
            <Sparkles className="h-4 w-4" />
            <span>Audience & Publishing</span>
          </div>

          {/* Student list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 mb-1">
              <label className="text-sm font-semibold text-night-900">Assign to Students *</label>
              {students.length > 0 && !hasSubmissions && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedStudentIds.length === students.length) {
                      setSelectedStudentIds([]);
                    } else {
                      setSelectedStudentIds(students.map((s) => s.id));
                    }
                  }}
                  className="text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors"
                >
                  {selectedStudentIds.length === students.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto border border-cream-200 rounded-lg p-3 bg-cream-50/20 min-h-[100px] items-center justify-center">
              {loadingStudents ? (
                <div className="col-span-2 flex flex-col items-center justify-center gap-2 py-4">
                  <Loader2 className="h-5 w-5 text-gold-500 animate-spin" />
                  <p className="text-xs text-ink-soft">Loading students...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="col-span-2 text-center text-xs text-ink-soft py-4">
                  No students found in this batch
                </div>
              ) : (
                students.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      onClick={() => !hasSubmissions && handleStudentToggle(student.id)}
                      className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer select-none transition-all ${
                        isSelected
                          ? "bg-gold-500/10 border-gold-500/40 text-night-900"
                          : "bg-white border-cream-200 hover:bg-cream-50/50 hover:border-cream-300 text-night-900"
                      } ${hasSubmissions ? "pointer-events-none opacity-80" : ""}`}
                    >
                      <div>
                        <p className="text-sm font-semibold">{student.name}</p>
                        <p className="text-xs text-ink-soft">{student.studentCode}</p>
                      </div>
                      {isSelected ? (
                        <div className="h-5 w-5 rounded-full bg-gold-500 text-white flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-cream-300 bg-white shrink-0 transition-colors" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {(errors.students || errors.studentIds) && (
              <p className="text-xs text-error">{errors.students || errors.studentIds}</p>
            )}
          </div>

          {/* Publish status */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-night-900">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value as any)} disabled={loading}>
              <option value="PUBLISHED">Published (Visible to students)</option>
              <option value="DRAFT">Draft (Only visible to you)</option>
            </Select>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Homework</span>
          </Button>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/teacher/homework"
              className="inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-transparent text-night-900 border border-cream-200 hover:bg-cream-50 min-h-[44px] px-6 text-[15px]"
            >
              Cancel
            </Link>
            <Button type="submit" loading={loading} className="px-8">
              Update Assignment
            </Button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 border border-cream-200 shadow-lift space-y-4">
            <div className="flex items-center gap-3 text-error">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-ink">
              Are you sure you want to delete this homework? This is a permanent action.
            </p>
            <div className="bg-error/10 text-error p-3 rounded text-xs font-semibold">
              ⚠️ WARNING: Deleting this homework will permanently lose {submissionCount} student submission{submissionCount !== 1 ? "s" : ""}.
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={loading}>
                Delete Permanently
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
