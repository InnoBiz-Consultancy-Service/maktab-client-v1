"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  ListChecks,
  Lock,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { extractYouTubeId, youTubeThumbnail } from "@/lib/utils/youtube";
import { createLessonAction } from "@/actions/teacher/lesson/create-lesson";
import { updateLessonAction } from "@/actions/teacher/lesson/update-lesson";
import type {
  CreateLessonInput,
  LessonStatus,
  TeacherLessonDetail,
  UpdateLessonInput,
} from "@/types/lesson";

interface LocalOption {
  text: string;
  isCorrect: boolean;
}
interface LocalQuestion {
  key: string;
  text: string;
  options: LocalOption[];
}

interface Props {
  mode: "create" | "edit";
  batches: { id: string; name: string }[];
  lesson?: TeacherLessonDetail;
}

let uid = 0;
const newKey = () => `q_${uid++}`;
const blankQuestion = (): LocalQuestion => ({
  key: newKey(),
  text: "",
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function LessonForm({ mode, batches, lesson }: Props) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const initialVideoUrl = lesson?.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}`
    : "";
  const initialDate = lesson?.date ? lesson.date.slice(0, 10) : todayISO();

  const [batchId, setBatchId] = useState(lesson?.batch?.id ?? "");
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [date, setDate] = useState(initialDate);
  const [status, setStatus] = useState<LessonStatus>(lesson?.status ?? "DRAFT");
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);

  const [quizEnabled, setQuizEnabled] = useState(false);
  const [passMark, setPassMark] = useState<string>("1");
  const [questions, setQuestions] = useState<LocalQuestion[]>([
    blankQuestion(),
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const videoId = useMemo(() => extractYouTubeId(videoUrl), [videoUrl]);
  const videoLooksInvalid = videoUrl.trim().length > 0 && !videoId;

  const updateQuestion = (i: number, patch: Partial<LocalQuestion>) =>
    setQuestions((qs) =>
      qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)),
    );

  const updateOption = (qi: number, oi: number, text: string) =>
    setQuestions((qs) =>
      qs.map((q, idx) =>
        idx === qi
          ? {
              ...q,
              options: q.options.map((o, j) => (j === oi ? { ...o, text } : o)),
            }
          : q,
      ),
    );

  const setCorrect = (qi: number, oi: number) =>
    setQuestions((qs) =>
      qs.map((q, idx) =>
        idx === qi
          ? {
              ...q,
              options: q.options.map((o, j) => ({ ...o, isCorrect: j === oi })),
            }
          : q,
      ),
    );

  const addQuestion = () => setQuestions((qs) => [...qs, blankQuestion()]);
  const removeQuestion = (i: number) =>
    setQuestions((qs) =>
      qs.length > 1 ? qs.filter((_, idx) => idx !== i) : qs,
    );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (isEdit) return submitEdit();
    return submitCreate();
  }

  async function submitCreate() {
    const quiz = quizEnabled
      ? {
          passMark: Number(passMark),
          questions: questions.map((q) => ({
            text: q.text.trim(),
            options: q.options.map((o) => ({
              text: o.text.trim(),
              isCorrect: o.isCorrect,
            })),
          })),
        }
      : null;

    const payload: CreateLessonInput = {
      batchId,
      title: title.trim(),
      description: description.trim() || null,
      videoUrl: videoUrl.trim() || undefined,
      date,
      status,
      quiz,
    };

    setPending(true);
    const res = await createLessonAction(payload);
    setPending(false);

    if (!res.success) {
      setErrors(res.fieldErrors ?? {});
      toast.error(res.formError ?? "Could not create lesson.");
      return;
    }
    toast.success(status === "PUBLISHED" ? "Lesson published" : "Draft saved");
    router.push("/dashboard/teacher/lessons");
    router.refresh();
  }

  async function submitEdit() {
    if (!lesson) return;

    const diff: UpdateLessonInput = {};
    if (title.trim() !== (lesson.title ?? "")) diff.title = title.trim();
    if ((description.trim() || null) !== (lesson.description ?? null))
      diff.description = description.trim() || null;
    if (date !== lesson.date.slice(0, 10)) diff.date = date;
    if (status !== lesson.status) diff.status = status;

    const nextVideo = videoUrl.trim();
    if (nextVideo !== initialVideoUrl) diff.videoUrl = nextVideo || null;

    if (Object.keys(diff).length === 0) {
      toast.message("Nothing to update", {
        description: "You haven't changed anything yet.",
      });
      return;
    }

    setPending(true);
    const res = await updateLessonAction(lesson.id, diff);
    setPending(false);

    if (!res.success) {
      setErrors(res.fieldErrors ?? {});
      toast.error(res.formError ?? "Could not update lesson.");
      return;
    }
    toast.success("Lesson updated");
    router.push("/dashboard/teacher/lessons");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card className="space-y-5">
        <h2 className="font-display text-xl font-bold text-night-900">
          {isEdit ? "Edit lesson" : "New lesson"}
        </h2>

        {isEdit ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-night-900">Batch</span>
            <div className="min-h-[44px] rounded-sm border border-cream-200 bg-cream-100 px-4 py-2.5 text-[15px] text-ink-soft">
              {lesson?.batch?.name ?? "—"}
            </div>
            <p className="text-xs text-ink-soft">
              A lesson can't move between batches.
            </p>
          </div>
        ) : (
          <Select
            label="Batch"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            error={errors.batchId}
          >
            <option value="">Select a batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        )}

        <Input
          label="Title"
          placeholder="e.g. Surah Al-Fatihah — Tafsir"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          maxLength={200}
        />

        <Textarea
          label="Description (optional)"
          placeholder="A short summary of what this lesson covers"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          maxLength={2000}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Lesson date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />
          <StatusToggle value={status} onChange={setStatus} />
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-quran" aria-hidden />
          <h3 className="font-display text-lg font-bold text-night-900">
            Video
          </h3>
        </div>
        <Input
          label="YouTube link (optional)"
          placeholder="Paste any YouTube link"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          error={
            errors.videoUrl ??
            (videoLooksInvalid
              ? "That doesn't look like a YouTube link."
              : undefined)
          }
        />
        {videoId && (
          <div className="flex items-center gap-3 rounded-sm border border-cream-200 bg-cream-50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={youTubeThumbnail(videoId)}
              alt=""
              className="h-16 w-28 shrink-0 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Video linked
              </p>
              <p className="truncate text-xs text-ink-soft">
                Video id: {videoId}
              </p>
            </div>
          </div>
        )}
      </Card>

      {isEdit ? (
        <QuizReadOnly lesson={lesson!} />
      ) : (
        <Card className="space-y-4">
          <label className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-arabic" aria-hidden />
              <span className="font-display text-lg font-bold text-night-900">
                Quiz
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm text-ink-soft">
              Add a quiz
              <input
                type="checkbox"
                checked={quizEnabled}
                onChange={(e) => setQuizEnabled(e.target.checked)}
                className="h-5 w-5 accent-gold-500"
              />
            </span>
          </label>

          {!quizEnabled ? (
            <p className="text-sm text-ink-soft">
              A lesson needs a video or a quiz. Turn this on to add questions.
            </p>
          ) : (
            <div className="space-y-5">
              <div className="w-40">
                <Input
                  label="Pass mark"
                  type="number"
                  min={1}
                  max={questions.length}
                  value={passMark}
                  onChange={(e) => setPassMark(e.target.value)}
                  error={errors.passMark}
                />
                <p className="mt-1 text-xs text-ink-soft">
                  Correct answers needed to pass (out of {questions.length}).
                </p>
              </div>

              {errors.quiz && (
                <p role="alert" className="text-sm text-error">
                  {errors.quiz}
                </p>
              )}

              {questions.map((q, qi) => (
                <QuestionEditor
                  key={q.key}
                  index={qi}
                  question={q}
                  canRemove={questions.length > 1}
                  onText={(t) => updateQuestion(qi, { text: t })}
                  onOption={(oi, t) => updateOption(qi, oi, t)}
                  onCorrect={(oi) => setCorrect(qi, oi)}
                  onRemove={() => removeQuestion(qi)}
                />
              ))}

              <Button type="button" variant="ghost" onClick={addQuestion}>
                <Plus className="h-4 w-4" aria-hidden />
                Add question
              </Button>
            </div>
          )}
        </Card>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard/teacher/lessons")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {isEdit
            ? "Save changes"
            : status === "PUBLISHED"
              ? "Publish lesson"
              : "Save draft"}
        </Button>
      </div>
    </form>
  );
}

function StatusToggle({
  value,
  onChange,
}: {
  value: LessonStatus;
  onChange: (v: LessonStatus) => void;
}) {
  const opts: { v: LessonStatus; label: string }[] = [
    { v: "DRAFT", label: "Draft" },
    { v: "PUBLISHED", label: "Publish" },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-night-900">Visibility</span>
      <div className="flex rounded-sm border border-cream-200 bg-cream-50 p-1">
        {opts.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            aria-pressed={value === o.v}
            className={cn(
              "min-h-[36px] flex-1 rounded-[0.5rem] px-3 text-sm font-semibold transition-colors",
              value === o.v
                ? "bg-night-900 text-cream-50"
                : "text-ink-soft hover:text-night-900",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuestionEditor({
  index,
  question,
  canRemove,
  onText,
  onOption,
  onCorrect,
  onRemove,
}: {
  index: number;
  question: LocalQuestion;
  canRemove: boolean;
  onText: (t: string) => void;
  onOption: (oi: number, t: string) => void;
  onCorrect: (oi: number) => void;
  onRemove: () => void;
}) {
  return (
    <fieldset className="rounded-md border border-cream-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <legend className="font-display text-sm font-bold text-night-900">
          Question {index + 1}
        </legend>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-sm font-medium text-error hover:brightness-110"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Remove
          </button>
        )}
      </div>

      <Input
        placeholder="Question text"
        value={question.text}
        onChange={(e) => onText(e.target.value)}
        aria-label={`Question ${index + 1} text`}
      />

      <p className="mt-3 mb-2 text-xs font-medium text-ink-soft">
        Tap the circle to mark the correct answer.
      </p>
      <div className="space-y-2">
        {question.options.map((o, oi) => (
          <label
            key={oi}
            className={cn(
              "flex items-center gap-3 rounded-sm border px-3 py-2 transition-colors",
              o.isCorrect ? "border-success bg-success/5" : "border-cream-200",
            )}
          >
            <input
              type="radio"
              name={`correct-${question.key}`}
              checked={o.isCorrect}
              onChange={() => onCorrect(oi)}
              className="h-5 w-5 accent-success"
              aria-label={`Mark option ${oi + 1} correct`}
            />
            <input
              type="text"
              value={o.text}
              onChange={(e) => onOption(oi, e.target.value)}
              placeholder={`Option ${oi + 1}`}
              aria-label={`Question ${index + 1} option ${oi + 1}`}
              className="min-h-9 w-full bg-transparent text-[15px] text-night-900 outline-none placeholder:text-ink-soft/60"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function QuizReadOnly({ lesson }: { lesson: TeacherLessonDetail }) {
  const quiz = lesson.quiz;
  if (!quiz) {
    return (
      <Card className="space-y-2">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-arabic" aria-hidden />
          <h3 className="font-display text-lg font-bold text-night-900">
            Quiz
          </h3>
        </div>
        <p className="text-sm text-ink-soft">This lesson has no quiz.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-arabic" aria-hidden />
          <h3 className="font-display text-lg font-bold text-night-900">
            Quiz
          </h3>
        </div>
        <span className="text-sm text-ink-soft">
          Pass {quiz.passMark}/{quiz.totalQuestions}
        </span>
      </div>

      <div className="flex items-start gap-2 rounded-sm border border-cream-200 bg-cream-100 p-3 text-sm text-ink-soft">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          {quiz.isEditable
            ? "Quizzes can't be changed after a lesson is created. You can still edit the title, date, description, video and visibility above."
            : "A student has already attempted this quiz, so it's locked to protect their results. Title, date, description, video and visibility can still change."}
        </p>
      </div>

      <ol className="space-y-3">
        {quiz.questions.map((q, qi) => (
          <li key={q.id} className="rounded-md border border-cream-200 p-4">
            <p className="mb-2 font-medium text-night-900">
              {qi + 1}. {q.text}
            </p>
            <ul className="space-y-1.5">
              {q.options.map((o) => (
                <li
                  key={o.id}
                  className={cn(
                    "flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm",
                    o.isCorrect
                      ? "bg-success/10 font-semibold text-success"
                      : "text-ink-soft",
                  )}
                >
                  {o.isCorrect && (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  )}
                  {o.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Card>
  );
}
