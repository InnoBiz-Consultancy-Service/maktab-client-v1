export type HomeworkStatus = "DRAFT" | "PUBLISHED";
export type SubmissionStatus = "SUBMITTED" | "GRADED";
export type AssignmentStatus = "NOT_SUBMITTED" | "SUBMITTED" | "GRADED";
export type TargetType = "BATCH" | "SPECIFIC";
export type AttachmentType = "IMAGE" | "PDF" | "YOUTUBE" | "LINK";

export interface Batch {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  studentCode: string;
}

export interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string;
}

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  youtubeVideoId: string | null;
  fileName: string | null;
  order: number;
}

export interface Submission {
  id: string;
  note: string | null;
  attachments: Attachment[];
  submittedAt: string;
  isLate: boolean;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
}

export interface Homework {
  id: string;
  title: string;
  instruction: string;
  batch: Batch;
  teacher: Teacher;
  lesson: Lesson | null;
  assignedDate: string;
  dueDate: string;
  status: HomeworkStatus;
  maxScore: number | null;
  allowLateSubmission: boolean;
  targetType: TargetType;
  totalAssigned: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errorSource?: { path: string; message: string }[];
}
