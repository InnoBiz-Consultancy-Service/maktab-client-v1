export interface ApiSuccessEnvelope<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  message: string;
  errorSources?: { path: string; message: string }[];
}

export interface PaginatedData<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  result: T[];
}

export interface ProgressRates {
  lessonCompletionRate: number;
  homeworkSubmissionRate: number;
  attendanceRate: number;
}

/* ---------------- Institute Dashboard ---------------- */

export interface InstituteOverviewData {
  counts: {
    teachers: number;
    students: number;
    batches: number;
    activeBatches: number;
    completedBatches: number;
  };
  progress: ProgressRates;
}

export interface InstituteBatchItem {
  id: string;
  name: string;
  status: "ACTIVE" | "COMPLETED";
  completedAt: string | null;
  teachers: { id: string; name: string }[];
  studentCount: number;
  progress: ProgressRates;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  batchId?: string;
  class?: string;
  isActive?: boolean;
  sortBy?: "name" | "class" | "createdAt" | "joinDate" | "rank";
  sortOrder?: "asc" | "desc";
}

export interface DashboardStudentItem {
  id: string;
  studentCode: string;
  name: string;
  class: string;
  dob?: string;
  gender?: "MALE" | "FEMALE";
  joinDate?: string;
  address?: string;
  allergies?: string;
  medicalConditions?: string;
  medications?: string;
  additionalNotes?: string;
  photoConsent?: boolean;
  isActive?: boolean;
  createdAt?: string;
  batches: { id: string; name: string }[];
  teacher?: { id: string; name: string } | null;
  parent?: { id: string; name: string; phone?: string } | null;
  progress: ProgressRates;
  points: number;
}

export interface PointsBreakdown {
  lessonPoints: number;
  homeworkPoints: number;
  attendancePoints: number;
}

export interface FullStudentProgress {
  lesson: { completed: number; total: number; rate: number };
  homework: {
    submitted: number;
    total: number;
    onTime: number;
    late: number;
    avgScore: number;
    rate: number;
  };
  attendance: {
    present: number;
    late: number;
    absent: number;
    totalDays: number;
    rate: number;
  };
  overallRate: number;
}

export interface StudentDetailData {
  profile: DashboardStudentItem;
  progress: FullStudentProgress;
  points: number;
  pointsBreakdown: PointsBreakdown;
  records: {
    lessons: unknown[];
    attendance: unknown;
  };
}

export interface DashboardTeacherItem {
  id: string;
  name: string;
  gender?: "MALE" | "FEMALE";
  education?: string;
  phone?: string;
  address?: string;
  jobTitle?: string;
  startDate?: string;
  notes?: string;
  assignedClasses?: string[];
  createdAt?: string;
  batches: { id: string; name: string; studentCount: number }[];
  totalStudents: number;
  activity: {
    lastHomeworkAt: string | null;
    daysSinceLastHomework: number;
    homeworksPublished: number;
    homeworksDraft: number;
    homeworkSubmissionRate: number;
    lessonsCreated: number;
    lessonsPublished: number;
  };
}

export interface TeacherDetailData extends DashboardTeacherItem {
  studentProgress?: ProgressRates;
  batchStatuses?: { id: string; name: string; status: "ACTIVE" | "COMPLETED" }[];
}

/* ---------------- Teacher Dashboard ---------------- */

export interface TeacherOverviewData {
  counts: {
    batches: number;
    students: number;
  };
  progress: {
    lessonRate: number;
    homeworkRate: number;
    attendanceRate: number;
  };
}

/* ---------------- Parent Dashboard ---------------- */

export interface ParentChildOverviewItem {
  id: string;
  name: string;
  studentCode: string;
  class: string;
  batch: { id: string; name: string };
  progress: {
    lessonRate: number;
    homeworkRate: number;
    attendanceRate: number;
  };
  points: number;
  rank: {
    rank: number;
    totalStudents: number;
    points: number;
  };
}

export interface ParentChildDetailData {
  student: {
    id: string;
    name: string;
    studentCode: string;
    class: string;
    batch: { id: string; name: string };
  };
  progress: FullStudentProgress;
  points: number;
  pointsBreakdown: PointsBreakdown;
  rank: {
    rank: number;
    totalStudents: number;
    points: number;
  };
  records?: {
    lessons: unknown[];
    attendance: unknown;
  };
}

/* ---------------- Leaderboard ---------------- */

export interface LeaderboardQueryParams {
  scope: "batch" | "institute";
  batchId?: string;
  period?: "weekly" | "monthly" | "alltime";
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  points: number;
  breakdown: PointsBreakdown;
  tiebreak: {
    lessonsCompleted: number;
    homeworkOnTime: number;
    attendanceCount: number;
  };
  isCurrentUser: boolean;
}

export interface LeaderboardData {
  scope: "batch" | "institute";
  period: "weekly" | "monthly" | "alltime";
  batchId?: string;
  generatedAt: string;
  entries: LeaderboardEntry[];
}

export interface BatchCompleteData {
  batchId: string;
  status: "COMPLETED";
  completedAt: string;
  finalLeaderboardCount: number;
}

export interface FinalLeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  studentCode: string;
  totalPoints: number;
  lessonCount: number;
  homeworkOnTime: number;
  attendanceCount: number;
}

export interface FinalLeaderboardData {
  batchId: string;
  finalizedAt: string;
  entries: FinalLeaderboardEntry[];
}
