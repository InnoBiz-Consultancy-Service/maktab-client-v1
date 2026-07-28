"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmissionDetails } from "@/types/shared/homework";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { gradeSubmission } from "@/actions/homework";
import { toast } from "sonner";
import { YouTubeEmbed } from "@/components/shared/homework/YouTubeEmbed";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  AlertCircle,
  Calendar,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { formatCalendarDate } from "@/lib/utils/date";

interface GradingFormProps {
  submission: SubmissionDetails;
  homeworkId: string;
}

export function GradingForm({ submission, homeworkId }: GradingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const hw = submission?.homework;
  const isCompletionOnly = hw?.maxScore === null;

  // Grade state
  const [score, setScore] = useState<string>(
    submission?.score !== null && submission?.score !== undefined
      ? submission.score.toString()
      : "",
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    submission?.score === 1, // Complete is stored as 1, Incomplete as 0
  );
  const [feedback, setFeedback] = useState<string>(submission?.feedback || "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    let parsedScore: number | null = null;
    if (!isCompletionOnly) {
      parsedScore = Number(score);
      if (
        score === "" ||
        isNaN(parsedScore) ||
        parsedScore < 0 ||
        parsedScore > (hw?.maxScore || 0)
      ) {
        setError(`Score must be a number between 0 and ${hw?.maxScore || 0}`);
        return;
      }
      if (!Number.isInteger(parsedScore)) {
        setError(
          "Score must be a whole number (e.g. 8 or 9). Decimal scores like 8.5 are not allowed.",
        );
        return;
      }
    }

    setLoading(true);
    const result = await gradeSubmission(submission?.id, {
      score: isCompletionOnly ? null : parsedScore,
      feedback: feedback.trim() || null,
      isCompleted: isCompletionOnly ? isCompleted : undefined,
    });
    setLoading(false);

    if (result.ok) {
      toast.success("Submission graded successfully!");
      router.push(`/dashboard/teacher/homework/${homeworkId}/submissions`);
      router.refresh();
    } else {
      const msg = result.error || "Failed to grade submission";
      toast.error(msg);
      setError(msg);
    }
  };

  const formattedSubmitted = submission?.submittedAt
    ? new Date(submission.submittedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/teacher/homework/${homeworkId}/submissions`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-night-900">
            Grade Submission
          </h1>
          <p className="text-sm text-ink-soft">
            Reviewing work from{" "}
            <strong className="text-night-900">
              {submission?.student?.name || "Student"}
            </strong>{" "}
            ({submission?.student?.studentCode || ""})
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Submission & Instructions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Homework Prompt */}
          <Card className="space-y-2 border border-cream-200 p-6 shadow-soft">
            <div className="flex items-center justify-between text-xs text-ink-soft">
              <span className="rounded bg-quran-soft px-2 py-0.5 font-semibold text-quran">
                Prompt
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Due:{" "}
                {formatCalendarDate(hw?.dueDate)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-night-900">
              {hw?.title || "Homework Details"}
            </h2>
            <div className="rounded-lg border border-cream-200/50 bg-cream-50/50 p-4 text-sm whitespace-pre-wrap text-ink">
              {hw?.instruction || ""}
            </div>
          </Card>

          {/* Student's Submission Note */}
          <Card className="space-y-4 border border-cream-200 p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <h3 className="font-bold text-night-900">Student's Notes</h3>
              <span className="text-xs text-ink-soft">
                Submitted: {formattedSubmitted}
              </span>
            </div>
            {submission.note ? (
              <p className="rounded-lg border border-cream-200/50 bg-cream-50/50 p-4 text-sm whitespace-pre-wrap text-ink">
                {submission.note}
              </p>
            ) : (
              <p className="text-sm text-ink-soft italic">
                No text notes provided by student.
              </p>
            )}

            {/* Attachments Section */}
            {submission.attachments.length > 0 && (
              <div className="space-y-4 border-t border-cream-100 pt-4">
                <h4 className="text-sm font-bold text-night-900">
                  Attachments ({submission.attachments.length})
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {submission.attachments
                    .sort((a, b) => a.order - b.order)
                    .map((att) => {
                      return (
                        <div
                          key={att.id}
                          className="flex flex-col gap-2 rounded-lg border border-cream-200 bg-white p-3 shadow-sm transition-all hover:shadow"
                        >
                          <div className="mb-1 flex items-center justify-between gap-2 border-b border-cream-100 pb-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                              {att.type === "IMAGE" && (
                                <ImageIcon className="h-3.5 w-3.5 text-success" />
                              )}
                              {att.type === "PDF" && (
                                <FileText className="h-3.5 w-3.5 text-error" />
                              )}
                              {att.type === "YOUTUBE" && (
                                <LinkIcon className="h-3.5 w-3.5 text-studies" />
                              )}
                              {att.type === "LINK" && (
                                <ExternalLink className="h-3.5 w-3.5 text-arabic" />
                              )}
                              {att.type}
                            </span>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs font-bold text-quran hover:underline"
                            >
                              Open <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>

                          {att.type === "IMAGE" && (
                            <div className="relative aspect-video w-full overflow-hidden rounded border bg-cream-50">
                              <img
                                src={att.url}
                                alt={att.fileName || "Student work"}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}

                          {att.type === "YOUTUBE" && (
                            <YouTubeEmbed url={att.url} className="mt-1" />
                          )}

                          {att.fileName && (
                            <span className="text-xs font-medium break-all text-night-900">
                              {att.fileName}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Grading Control Panel */}
        <div>
          <Card className="sticky top-4 space-y-6 border border-cream-200 bg-night-900 p-6 text-cream-50 shadow-soft">
            <h3 className="border-b border-night-800 pb-3 text-lg font-bold">
              Grading Dashboard
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Grading Input */}
              {isCompletionOnly ? (
                <div className="flex items-center gap-3 rounded-lg border border-night-700 bg-night-800 p-3">
                  <input
                    type="checkbox"
                    id="isCompleted"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="h-5 w-5 rounded border-night-700 bg-night-900 text-gold-500 accent-gold-500"
                    disabled={loading}
                  />
                  <label
                    htmlFor="isCompleted"
                    className="cursor-pointer text-sm font-semibold select-none"
                  >
                    Mark as Completed
                    <span className="mt-0.5 block text-xs font-normal text-cream-100/60">
                      This homework does not require a grade score.
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Grade Score *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={hw.maxScore || 10}
                      step="0.5"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="Enter score"
                      className="w-full rounded-md border border-night-700 bg-night-800 px-4 py-2.5 text-cream-50 outline-none focus:border-gold-500"
                      disabled={loading}
                    />
                    <span className="text-lg font-bold text-cream-200">
                      / {hw.maxScore}
                    </span>
                  </div>
                  {error && (
                    <p className="flex items-center gap-1 pt-1 text-xs text-error">
                      <AlertCircle className="h-3 w-3" /> {error}
                    </p>
                  )}
                </div>
              )}

              {/* Feedback Input */}
              <div className="space-y-1">
                <label className="text-sm font-semibold">
                  Teacher Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide guidance or feedback for the student..."
                  rows={4}
                  className="w-full rounded-md border border-night-700 bg-night-800 p-3 text-sm text-cream-50 outline-none placeholder:text-cream-100/40 focus:border-gold-500"
                  disabled={loading}
                />
              </div>

              {submission.status === "GRADED" && (
                <div className="rounded bg-night-800/40 p-2 text-[11px] text-cream-100/50">
                  * Submission is already graded. Submitting again will update
                  the record.
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" loading={loading} block>
                {submission.status === "GRADED"
                  ? "Update Grade"
                  : "Submit Grade"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
