import type { PageMeta } from "@/lib/utils/unwrap";

export type LessonStatus = "DRAFT" | "PUBLISHED";

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

export interface BatchRef {
  id: string;
  name: string;
}
export interface TeacherRef {
  id: string;
  name: string;
}
export interface StudentRef {
  id: string;
  name: string;
  studentCode: string;
}

/* ── Create / Update payloads ── */
export interface CreateOptionInput {
  text: string;
  isCorrect: boolean;
}
export interface CreateQuestionInput {
  text: string;
  options: CreateOptionInput[];
}
export interface CreateQuizInput {
  passMark: number;
  questions: CreateQuestionInput[];
}
export interface CreateLessonInput {
  batchId: string;
  title: string;
  description?: string | null;
  videoUrl?: string;
  date: string; // YYYY-MM-DD
  status: LessonStatus;
  quiz?: CreateQuizInput | null;
}
export interface UpdateLessonInput {
  title?: string;
  description?: string | null;
  videoUrl?: string | null;
  date?: string;
  status?: LessonStatus;
}
export interface LessonFormState<T = unknown> {
  success: boolean;
  data?: T;
  formError?: string;
  fieldErrors?: Record<string, string>;
}

/* ── Teacher: list ── */
export interface TeacherLessonListItem {
  id: string;
  title: string;
  date: string;
  status: LessonStatus;
  batch: BatchRef;
  teacher: TeacherRef;
  hasVideo: boolean;
  hasQuiz: boolean;
  quiz: { id: string; passMark: number; totalQuestions: number } | null;
  completedCount: number;
  isOwner: boolean;
}

/* ── Teacher: detail (answer key) ── */
export interface TeacherQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}
export interface TeacherQuizQuestion {
  id: string;
  text: string;
  order: number;
  options: TeacherQuizOption[];
}
export interface TeacherQuiz {
  passMark: number;
  totalQuestions: number;
  totalAttempts: number;
  isEditable: boolean;
  questions: TeacherQuizQuestion[];
}
export interface TeacherLessonDetail {
  id: string;
  title: string;
  description: string | null;
  youtubeVideoId: string | null;
  date: string;
  status: LessonStatus;
  hasVideo: boolean;
  hasQuiz: boolean;
  isOwner: boolean;
  batch?: BatchRef;
  teacher?: TeacherRef;
  quiz: TeacherQuiz | null;
}

/* ── Teacher: results ── */
export type ResultRowStatus =
  "COMPLETED" | "PASSED" | "IN_PROGRESS" | "FAILED" | "NOT_STARTED";
export type ResultsFilter =
  "ALL" | "COMPLETED" | "PASSED" | "FAILED" | "NOT_ATTEMPTED";

export interface LessonResultsSummary {
  totalStudents: number;
  completed: number;
  videoCompleted: number;
  quizPassed: number | null;
  quizAttemptedButFailed: number;
  notStarted: number;
}
export interface StudentResultRow {
  student: StudentRef;
  isCompleted: boolean;
  completedAt?: string | null;
  video: { completed: boolean };
  quiz: { attempts: number; score: number | null; isPassed: boolean } | null;
  status: ResultRowStatus;
}
export interface LessonResults {
  lesson: {
    title: string;
    hasVideo: boolean;
    hasQuiz: boolean;
    passMark: number | null;
    totalQuestions: number | null;
  };
  summary: LessonResultsSummary;
  results: StudentResultRow[];
  meta: PageMeta;
}

export interface StudentAttemptAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}
export interface StudentAttemptDetail {
  attemptNumber: number;
  score: number;
  passMark: number;
  totalQuestions: number;
  isPassed: boolean;
  submittedAt: string;
  answers: StudentAttemptAnswer[];
}
export interface StudentResultDetail {
  student: { name: string; studentCode: string };
  progress: {
    videoCompleted: boolean;
    videoCompletedAt: string | null;
    quizPassed: boolean;
    quizPassedAt: string | null;
    isCompleted: boolean;
    completedAt: string | null;
  };
  totalAttempts: number;
  attempts: StudentAttemptDetail[];
}

/* ── Student ── */
export interface StudentLessonProgress {
  videoCompleted: boolean;
  quizPassed: boolean;
  completedAt: string | null;
}
export interface StudentLessonListItem {
  id: string;
  title: string;
  date: string;
  teacher: { name: string };
  hasVideo: boolean;
  hasQuiz: boolean;
  isLocked: boolean;
  isCompleted: boolean;
  youtubeVideoId: string | null; // null when locked
  quiz: { id: string; passMark: number; totalQuestions: number } | null;
  progress: StudentLessonProgress;
}
export interface StudentQuizOption {
  id: string;
  text: string;
  order: number;
} // no isCorrect
export interface StudentQuizQuestion {
  id: string;
  text: string;
  order: number;
  options: StudentQuizOption[];
}
export interface StudentAttemptSummary {
  attemptNumber: number;
  score: number;
  isPassed: boolean;
  submittedAt: string;
}
export interface StudentQuiz {
  id: string;
  passMark: number;
  totalQuestions: number;
  totalAttempts: number;
  hasPassed: boolean;
  questions: StudentQuizQuestion[];
  attempts: StudentAttemptSummary[];
}
export interface StudentLessonDetail {
  id: string;
  title: string;
  description: string | null;
  youtubeVideoId: string | null;
  hasVideo: boolean;
  hasQuiz: boolean;
  progress: {
    videoCompleted: boolean;
    quizPassed: boolean;
    isCompleted: boolean;
  };
  canMarkVideoComplete: boolean;
  canAttemptQuiz: boolean;
  quiz: StudentQuiz | null;
}
export interface VideoCompleteResult {
  videoCompleted: boolean;
  quizPassed: boolean;
  isCompleted: boolean;
  remaining: string | null;
}
export interface SubmitQuizInput {
  answers: { questionId: string; selectedOptionId: string }[];
}
export interface SubmitQuizResult {
  attemptNumber: number;
  score: number;
  passMark: number;
  totalQuestions: number;
  isPassed: boolean;
  submittedAt: string;
  canRetry: boolean;
  lessonCompleted: boolean;
  remaining: string | null;
}
export interface QuizAttemptsResult {
  lessonTitle: string;
  passMark: number;
  totalQuestions: number;
  totalAttempts: number;
  hasPassed: boolean;
  canAttempt: boolean;
  attempts: StudentAttemptSummary[];
}
