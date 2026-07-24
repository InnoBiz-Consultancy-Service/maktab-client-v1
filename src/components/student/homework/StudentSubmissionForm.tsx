"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Homework, Submission } from "@/types/shared/homework";
import { Button, Card, Input, Textarea, Select } from "@/components/ui";
import { submitStudentHomework } from "@/actions/homework";
import { toast } from "sonner";
import { StatusChip } from "@/components/shared/homework/StatusChip";
import { YouTubeEmbed } from "@/components/shared/homework/YouTubeEmbed";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Trash2,
  AlertTriangle,
  Play,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface StudentSubmissionFormProps {
  homework: Homework;
  canSubmit: boolean;
  submission: Submission | null;
  studentId: string;
}

export function StudentSubmissionForm({
  homework,
  canSubmit,
  submission,
  studentId,
}: StudentSubmissionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Submit states
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<{
    type: "IMAGE" | "PDF" | "YOUTUBE" | "LINK";
    url: string;
    fileName: string | null;
  }[]>([]);

  // Local state for adding single attachment
  const [attType, setAttType] = useState<"IMAGE" | "PDF" | "YOUTUBE" | "LINK">("IMAGE");
  const [attUrl, setAttUrl] = useState("");
  const [attName, setAttName] = useState("");
  const [attError, setAttError] = useState<string | null>(null);

  // Simulation upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddAttachment = () => {
    setAttError(null);

    if (attachments.length >= 10) {
      setAttError("Maximum 10 attachments allowed");
      return;
    }

    if (attType === "IMAGE" || attType === "PDF") {
      if (!attName.trim()) {
        setAttError("Please enter a file name");
        return;
      }
      // Simulate file upload
      setUploading(true);
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setAttachments((prev) => [
                ...prev,
                {
                  type: attType,
                  url: attType === "IMAGE" 
                    ? "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop"
                    : "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                  fileName: attName.trim(),
                },
              ]);
              setAttName("");
              setUploading(false);
              toast.success("File uploaded successfully (simulated)");
            }, 300);
            return 100;
          }
          return p + 30;
        });
      }, 150);
    } else {
      if (!attUrl.trim()) {
        setAttError("Please enter a valid URL");
        return;
      }

      if (attType === "YOUTUBE") {
        const id = parseYoutubeId(attUrl);
        if (!id || id.length !== 11) {
          setAttError("Please enter a valid YouTube link (e.g. watch?v=ID or youtu.be/ID)");
          return;
        }
      }

      setAttachments((prev) => [
        ...prev,
        {
          type: attType,
          url: attUrl.trim(),
          fileName: attType === "YOUTUBE" ? "YouTube Video" : attName.trim() || "Web Link",
        },
      ]);
      setAttUrl("");
      setAttName("");
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!note.trim() && attachments.length === 0) {
      toast.error("Please add a note or at least one attachment");
      return;
    }

    setLoading(true);
    const result = await submitStudentHomework(studentId, homework.id, {
      note: note.trim() || null,
      attachments,
    });
    setLoading(false);

    if (result.ok) {
      toast.success("Homework submitted successfully!");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  function parseYoutubeId(url: string): string | null {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    } catch {
      return null;
    }
  }

  // Formatting date helper
  const formattedDueDate = new Date(homework.dueDate).toLocaleDateString("en-US", {
    dateStyle: "long",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/student/homework"
          className="mb-3 inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-night-900">Assignment Details</h1>
          <p className="text-sm text-ink-soft">Review homework details and submit your work.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Homework card & prompt */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-cream-200 shadow-soft space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-100 pb-3">
              <span className="text-xs font-semibold text-quran bg-quran-soft px-2.5 py-1 rounded">
                {homework.batch.name}
              </span>
              <span className="text-xs text-ink-soft flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Due Date: {formattedDueDate}
              </span>
            </div>

            <h2 className="text-xl font-bold text-night-900">{homework.title}</h2>
            
            {/* Clamped show-more instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Instructions</h4>
              <div className="text-sm text-ink bg-cream-50 p-4 rounded-lg border border-cream-200/50 whitespace-pre-wrap leading-relaxed">
                {homework.instruction}
              </div>
            </div>

            {/* Lesson details if linked */}
            {homework.lesson && (
              <div className="bg-arabic-soft/20 border border-arabic/10 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-arabic uppercase tracking-wider">Linked Lesson Reference</h4>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-arabic" />
                    <span className="text-sm font-semibold text-night-900">{homework.lesson.title}</span>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${homework.lesson.youtubeVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-arabic hover:underline"
                  >
                    View video lesson <Play className="h-3 w-3 fill-arabic" />
                  </a>
                </div>
                <YouTubeEmbed url={`https://www.youtube.com/watch?v=${homework.lesson.youtubeVideoId}`} className="max-w-md mx-auto" />
              </div>
            )}
          </Card>

          {/* Student Work View / Form */}
          {submission ? (
            /* ==================== SUBMISSION PRESENT: STATES 3 & 4 ==================== */
            <Card className="p-6 border border-cream-200 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                <h3 className="font-bold text-night-900">Your Submission</h3>
                <div className="flex items-center gap-2">
                  <StatusChip
                    status={submission.status}
                    isLate={submission.isLate}
                    dueDate={homework.dueDate}
                  />
                </div>
              </div>

              {/* Note */}
              {submission.note && (
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft">My Notes</h4>
                  <p className="text-sm text-ink whitespace-pre-wrap bg-cream-50/30 p-4 rounded-lg border border-cream-200/50 leading-relaxed">
                    {submission.note}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {submission.attachments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft">My Attachments</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {submission.attachments
                      .sort((a, b) => a.order - b.order)
                      .map((att) => (
                        <div
                          key={att.id}
                          className="flex flex-col gap-2 rounded-lg border border-cream-200 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-cream-100 pb-2 mb-1">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                              {att.type === "IMAGE" && <ImageIcon className="h-3.5 w-3.5 text-success" />}
                              {att.type === "PDF" && <FileText className="h-3.5 w-3.5 text-error" />}
                              {att.type === "YOUTUBE" && <LinkIcon className="h-3.5 w-3.5 text-studies" />}
                              {att.type === "LINK" && <ExternalLink className="h-3.5 w-3.5 text-arabic" />}
                              {att.type}
                            </span>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-quran flex items-center gap-1 hover:underline"
                            >
                              Open <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>

                          {att.type === "IMAGE" && (
                            <div className="relative aspect-video w-full rounded border overflow-hidden bg-cream-50">
                              <img
                                src={att.url}
                                alt={att.fileName || "Uploaded file"}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}

                          {att.type === "YOUTUBE" && (
                            <YouTubeEmbed url={att.url} />
                          )}

                          {att.fileName && (
                            <span className="text-xs font-medium text-night-900 break-all">
                              {att.fileName}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          ) : canSubmit ? (
            /* ==================== STATE 1: ACTIVE SUBMIT FORM ==================== */
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6 border border-cream-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between border-b border-cream-100 pb-3">
                  <h3 className="font-bold text-night-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gold-500" />
                    <span>Submit Your Homework</span>
                  </h3>
                  <span className="text-xs text-ink-soft italic">
                    Requires notes or at least 1 attachment
                  </span>
                </div>

                {/* Submission note */}
                <div className="space-y-1">
                  <Textarea
                    label="Submission Notes"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a message, answer details, or notes here..."
                    rows={4}
                    disabled={loading || uploading}
                  />
                </div>

                {/* Attachments Section */}
                <div className="space-y-4 pt-3 border-t border-cream-100">
                  <h4 className="text-sm font-bold text-night-900">Attachments</h4>

                  {/* Added Attachments List */}
                  {attachments.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-cream-200 bg-cream-50/30"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {att.type === "IMAGE" && <ImageIcon className="h-4 w-4 text-success shrink-0" />}
                            {att.type === "PDF" && <FileText className="h-4 w-4 text-error shrink-0" />}
                            {att.type === "YOUTUBE" && <LinkIcon className="h-4 w-4 text-studies shrink-0" />}
                            {att.type === "LINK" && <LinkIcon className="h-4 w-4 text-arabic shrink-0" />}
                            <span className="text-xs font-medium text-night-900 truncate">
                              {att.fileName}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(idx)}
                            className="text-ink-soft hover:text-error p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Attachment Panel */}
                  <div className="bg-cream-50/50 border border-cream-200 rounded-lg p-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-bold text-ink-soft uppercase tracking-wider">Type</label>
                        <Select
                          value={attType}
                          onChange={(e) => {
                            setAttType(e.target.value as any);
                            setAttUrl("");
                            setAttName("");
                            setAttError(null);
                          }}
                          disabled={loading || uploading}
                        >
                          <option value="IMAGE">Image File</option>
                          <option value="PDF">PDF File</option>
                          <option value="YOUTUBE">YouTube Video</option>
                          <option value="LINK">Web Link</option>
                        </Select>
                      </div>

                      {/* URL input for YouTube/Links, File name for Files */}
                      {(attType === "IMAGE" || attType === "PDF") ? (
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-ink-soft uppercase tracking-wider">File Name</label>
                          <Input
                            placeholder="e.g. homework-page-1"
                            value={attName}
                            onChange={(e) => setAttName(e.target.value)}
                            disabled={loading || uploading}
                          />
                        </div>
                      ) : (
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-ink-soft uppercase tracking-wider">
                            {attType === "YOUTUBE" ? "YouTube Video URL" : "Web URL"}
                          </label>
                          <Input
                            placeholder={
                              attType === "YOUTUBE"
                                ? "e.g. https://www.youtube.com/watch?v=..."
                                : "e.g. https://my-blog-resource.com"
                            }
                            value={attUrl}
                            onChange={(e) => setAttUrl(e.target.value)}
                            disabled={loading || uploading}
                          />
                        </div>
                      )}
                    </div>

                    {attError && <p className="text-xs text-error">{attError}</p>}

                    {/* Progress Bar for Mock Uploading */}
                    {uploading && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-ink-soft font-semibold">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gold-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleAddAttachment}
                      disabled={loading || uploading}
                      className="flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{(attType === "IMAGE" || attType === "PDF") ? "Upload File" : "Add Link"}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button type="submit" loading={loading} disabled={uploading} className="px-8">
                    Submit Homework
                  </Button>
                </div>
              </Card>
            </form>
          ) : (
            /* ==================== STATE 2: LOCKED PAST DUE ==================== */
            <Card className="p-6 border border-error/20 bg-error/5 shadow-soft flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-error shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-error">Late Submissions Blocked</h3>
                <p className="text-sm text-ink leading-relaxed">
                  This homework is past the due date ({formattedDueDate}) and late submissions are disabled by your teacher. You can no longer submit work for this assignment.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Right column: Feedback panel / status */}
        <div className="space-y-6">
          <Card className="p-6 border border-cream-200 shadow-soft bg-night-900 text-cream-50 space-y-4">
            <h3 className="text-lg font-bold border-b border-night-800 pb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-gold-500" />
              <span>Assessment Summary</span>
            </h3>

            {submission && submission.status === "GRADED" ? (
              <div className="space-y-5">
                <div className="bg-night-800 p-4 rounded-lg border border-night-700 text-center space-y-1">
                  <span className="text-xs text-cream-100/60 uppercase tracking-wider block">Graded Result</span>
                  {homework.maxScore !== null ? (
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-4xl font-extrabold text-success">{submission.score}</span>
                      <span className="text-sm text-cream-100/50">/ {homework.maxScore}</span>
                    </div>
                  ) : (
                    <div className="text-success flex items-center justify-center gap-2 font-bold text-lg">
                      <CheckCircle2 className="h-6 w-6" /> Completed
                    </div>
                  )}
                  <span className="text-[10px] text-cream-100/40 block mt-2">
                    Graded on {new Date(submission.gradedAt!).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </span>
                </div>

                {submission.feedback && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-cream-100/60 uppercase tracking-wider">Teacher's Feedback</h4>
                    <p className="text-sm text-cream-50 bg-night-800 p-3.5 rounded-lg border border-night-700 whitespace-pre-wrap leading-relaxed">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </div>
            ) : submission ? (
              <div className="space-y-4 text-center py-6 text-cream-100/70">
                <Clock className="h-10 w-10 text-warn mx-auto animate-pulse" />
                <div>
                  <p className="font-bold text-white text-base">Awaiting Grading</p>
                  <p className="text-xs mt-1">Your homework has been submitted. Your teacher will grade it soon.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-6 text-cream-100/50">
                <AlertTriangle className="h-10 w-10 text-gold-500 mx-auto" />
                <div>
                  <p className="font-bold text-white text-base">Not Submitted</p>
                  <p className="text-xs mt-1">Submit your work using the form on the left to receive feedback.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
