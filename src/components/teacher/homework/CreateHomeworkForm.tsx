"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Batch, Lesson, Student } from "@/types/shared/homework";
import { Button, Card, Input, Textarea, Select } from "@/components/ui";
import { createHomework } from "@/actions/homework";
import { toast } from "sonner";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import Link from "next/link";

interface CreateHomeworkFormProps {
  batches: Batch[];
  lessons: Lesson[];
  students: Student[];
}

export function CreateHomeworkForm({ batches, lessons, students }: CreateHomeworkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [batchId, setBatchId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [assignedDate, setAssignedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [gradingType, setGradingType] = useState<"graded" | "completion">("graded");
  const [maxScore, setMaxScore] = useState<string>("10");
  const [allowLateSubmission, setAllowLateSubmission] = useState(true);
  const [targetType, setTargetType] = useState<"BATCH" | "SPECIFIC">("BATCH");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStudentToggle = (studentId: string) => {
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

    if (targetType === "SPECIFIC" && selectedStudentIds.length === 0) {
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
      targetType,
      studentIds: targetType === "SPECIFIC" ? selectedStudentIds : null,
    });

    setLoading(false);

    if (result.ok) {
      toast.success("Homework created successfully!");
      router.push("/dashboard/teacher/homework");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/teacher/homework"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-night-900">Create New Homework</h1>
          <p className="text-sm text-ink-soft">Publish a new assignment for your students.</p>
        </div>
      </div>

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
          <p className="text-right text-xs text-ink-soft/60">{instruction.length}/5000 chars</p>
        </div>

        {/* Batch and Lesson */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-night-900">Batch *</label>
            <Select value={batchId} onChange={(e) => setBatchId(e.target.value)} disabled={loading}>
              <option value="">Select a batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
            {errors.batchId && <p className="text-xs text-error">{errors.batchId}</p>}
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

        {/* Target Type */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-night-900">Target Audience</label>
          <Select
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as any)}
            disabled={loading}
          >
            <option value="BATCH">Assign to Entire Batch</option>
            <option value="SPECIFIC">Assign to Specific Students</option>
          </Select>
        </div>

        {/* Student list if SPECIFIC */}
        {targetType === "SPECIFIC" && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-night-900">Select Students *</label>
            <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto border border-cream-200 rounded-lg p-3 bg-cream-50/20">
              {students.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <div
                    key={student.id}
                    onClick={() => !loading && handleStudentToggle(student.id)}
                    className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer select-none transition-all ${
                      isSelected
                        ? "bg-gold-500/10 border-gold-500/30 text-night-900"
                        : "bg-white border-cream-200 hover:bg-cream-50/50"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{student.name}</p>
                      <p className="text-xs text-ink-soft">{student.studentCode}</p>
                    </div>
                    {isSelected && (
                      <div className="rounded-full bg-gold-500 p-0.5 text-white">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.students && <p className="text-xs text-error">{errors.students}</p>}
          </div>
        )}

        {/* Publish status */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-night-900">Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as any)} disabled={loading}>
            <option value="PUBLISHED">Published (Visible to students immediately)</option>
            <option value="DRAFT">Draft (Only visible to you)</option>
          </Select>
        </div>
      </Card>

      <div className="flex items-center gap-3 justify-end pt-4">
        <Link
          href="/dashboard/teacher/homework"
          className="inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-150 active:scale-95 hover:scale-[1.02] bg-transparent text-night-900 border border-cream-200 hover:bg-cream-50 min-h-[44px] px-6 text-[15px]"
        >
          Cancel
        </Link>
        <Button type="submit" loading={loading} className="px-8">
          Save Assignment
        </Button>
      </div>
    </form>
  );
}
