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

// Teacher Homework List Item (GET /homeworks/teacher)
export interface TeacherHomeworkListItem {
  id: string;
  title: string;
  instruction: string;
  batch: Batch;
  assignedDate: string;
  dueDate: string;
  status: HomeworkStatus;
  publishedAt: string | null;
  maxScore: number | null;
  allowLateSubmission: boolean;
  targetType: TargetType;
  hasLesson: boolean;
  totalAssigned: number;
  totalSubmitted: number;
  totalOnTime: number;
  totalLate: number;
  totalGraded: number;
  totalNotSubmitted: number;
  submissionRate: number;
  isOverdue: boolean;
}

// Teacher Homework Detail (GET /homeworks/teacher/:id)
export interface TeacherHomeworkDetail extends Homework {
  publishedAt: string | null;
  assignedStudents: Student[];
  totalSubmitted: number;
  totalOnTime: number;
  totalLate: number;
  totalGraded: number;
  canEditTargets: boolean;
  canDelete: boolean;
}

// Student Homework List Item (GET /homeworks/student)
export interface StudentHomeworkListItem {
  assignmentId: string;
  status: AssignmentStatus;
  submittedAt: string | null;
  isLate: boolean;
  score: number | null;
  feedback: string | null;
  chip: "NOT_SUBMITTED" | "OVERDUE" | "SUBMITTED" | "SUBMITTED_LATE" | "GRADED" | "GRADED_LATE";
  isOverdue: boolean;
  homework: {
    id: string;
    title: string;
    dueDate: string;
    maxScore: number | null;
    allowLateSubmission: boolean;
    teacher: Teacher;
    hasLesson: boolean;
    batch: Batch;
  };
}

// Student Homework Detail (GET /homeworks/student/:homeworkId)
export interface StudentHomeworkDetail {
  homework: Homework;
  submission: Submission | null;
  canSubmit: boolean;
  submitBlockedReason: string | null;
}

// Teacher Submissions Roster (GET /homeworks/teacher/:id/submissions)
export interface HomeworkSubmissionSummary {
  homework: {
    id: string;
    title: string;
    instruction: string;
    lesson: Lesson | null;
    dueDate: string;
    maxScore: number | null;
  };
  summary: {
    totalAssigned: number;
    submitted: number;
    onTime: number;
    late: number;
    notSubmitted: number;
    graded: number;
    submissionRate: number;
    punctualityRate: number;
  };
  results: {
    assignmentId: string;
    student: Student;
    status: AssignmentStatus;
    submissionId: string | null;
    submittedAt: string | null;
    isLate: boolean;
    gradedAt: string | null;
    score: number | null;
    attachmentCount: number;
    chip: "NOT_SUBMITTED" | "OVERDUE" | "SUBMITTED" | "SUBMITTED_LATE" | "GRADED" | "GRADED_LATE";
  }[];
}

// Teacher Submissions Detail (GET /homeworks/teacher/submissions/:submissionId)
export interface SubmissionDetails extends Submission {
  student: Student;
  homework: Homework;
  isCompleted: boolean | null;
}

// Date-wise History (GET /homeworks/teacher/history)
export interface HistoryResponse {
  range: {
    from: string;
    to: string;
  };
  days: {
    date: string;
    homeworkCount: number;
    totalAssigned: number;
    totalSubmitted: number;
    totalNotSubmitted: number;
    totalGraded: number;
    totalLate: number;
    submissionRate: number;
    homeworks: {
      id: string;
      title: string;
      batch: Batch;
      maxScore: number | null;
      totalAssigned: number;
      totalSubmitted: number;
      totalNotSubmitted: number;
      totalGraded: number;
      totalLate: number;
    }[];
  }[];
}

// Teacher Overview (GET /homeworks/teacher/overview)
export interface TeacherOverviewResponse {
  month: string;
  batch: Batch | null;
  summary: {
    totalHomeworks: number;
    publishedHomeworks: number;
    draftHomeworks: number;
    totalAssigned: number;
    totalSubmitted: number;
    totalNotSubmitted: number;
    totalOnTime: number;
    totalLate: number;
    totalGraded: number;
    submissionRate: number;
    punctualityRate: number;
  };
  topStudents: {
    student: Student;
    assigned: number;
    submitted: number;
    notSubmitted: number;
    submissionRate: number;
    averageScorePercent: number | null;
  }[];
  needsAttention: {
    student: Student;
    assigned: number;
    submitted: number;
    notSubmitted: number;
    submissionRate: number;
    averageScorePercent: number | null;
  }[];
}

// Student Overview (GET /homeworks/student/overview)
export interface StudentOverviewResponse {
  month: string;
  summary: {
    assigned: number;
    submitted: number;
    notSubmitted: number;
    graded: number;
    late: number;
    overdue: number;
    submissionRate: number;
    averageScorePercent: number | null;
  };
  upcoming: {
    assignmentId: string;
    homework: {
      id: string;
      title: string;
      dueDate: string;
      maxScore: number | null;
    };
    daysLeft: number;
  }[];
}

// Parent Overview (GET /homeworks/parent/overview)
export interface ParentOverviewResponse {
  month: string;
  children: {
    student: Student;
    batch: Batch;
    summary: {
      assigned: number;
      submitted: number;
      notSubmitted: number;
      graded: number;
      late: number;
      overdue: number;
      submissionRate: number;
      averageScorePercent: number | null;
    };
    recent: {
      homework: {
        id: string;
        title: string;
        dueDate: string;
        maxScore: number | null;
      };
      status: AssignmentStatus;
      isLate: boolean;
      score: number | null;
      feedback: string | null;
    }[];
  }[];
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

