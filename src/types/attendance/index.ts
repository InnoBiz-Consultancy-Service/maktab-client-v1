
export type AttendanceDayType = "CLASS" | "OFF_DAY";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type BatchDayState = "NOT_STARTED" | "IN_PROGRESS" | "DONE" | "OFF_DAY";

// ── GET /attendance/today ───────────────────────────────────────────

export interface TodayBatch {
  batch: { id: string; name: string };
  totalStudents: number;
  state: BatchDayState;
  /** Present when state !== NOT_STARTED */
  dayId?: string;
  takenBy?: { id: string; name: string };
  canEdit?: boolean;
  /** Only when IN_PROGRESS */
  progress?: { marked: number; total: number };
  /** Only when OFF_DAY */
  reason?: string;
}

export interface TodayResponse {
  date: string;
  batches: TodayBatch[];
}

// ── POST /attendance/days (Start) ───────────────────────────────────

export interface StartDayInput {
  batchId: string;
}

export interface AttendanceDay {
  id: string;
  batchId: string;
  teacherId: string;
  date: string;
  type: AttendanceDayType;
  reason: string | null;
  signedOff: boolean;
  teacher: { id: string; name: string };
}

// ── POST /attendance/off-days ───────────────────────────────────────

export interface OffDayInput {
  batchId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface OffDayResponse {
  created: number;
  skipped: Array<{ date: string; reason: string }>;
}

// ── GET /attendance/days/:id/roster ─────────────────────────────────

export interface RosterDay {
  id: string;
  date: string;
  type: AttendanceDayType;
  reason: string | null;
  signedOff: boolean;
  takenBy: { id: string; name: string };
  canEdit: boolean;
}

export interface RosterStudent {
  id: string;
  name: string;
  studentCode: string;
  /** null means not yet marked — display as PRESENT */
  status: AttendanceStatus | null;
  /** null if not yet saved; needed for PATCH /records/:id */
  recordId: string | null;
}

export interface RosterResponse {
  day: RosterDay;
  batch: { id: string; name: string };
  students: RosterStudent[];
}

// ── POST /attendance/days/:id/mark ──────────────────────────────────

export interface MarkRecord {
  studentId: string;
  status: AttendanceStatus;
}

export interface MarkInput {
  records: MarkRecord[];
  finalize: boolean;
}

// Mark response is the same shape as RosterResponse

// ── PATCH /attendance/records/:id ───────────────────────────────────

export interface EditRecordInput {
  status: AttendanceStatus;
  reason?: string;
}

export interface EditRecordResponse {
  id: string;
  dayId: string;
  studentId: string;
  status: AttendanceStatus;
  markedById: string;
}

// ── GET /parents/my-children ────────────────────────────────────────

export interface ChildMonthSummary {
  totalClassDays: number;
  present: number;
  late: number;
  absent: number;
  percentage: number;
}

export interface MyChild {
  student: {
    id: string;
    name: string;
    studentCode: string;
    class: string;
  };
  thisMonth: ChildMonthSummary;
}

// ── GET /attendance/students/:id/summary ────────────────────────────

export interface StudentSummary {
  student: {
    id: string;
    name: string;
    studentCode: string;
    class: string;
  };
  range: { from: string; to: string };
  totalClassDays: number;
  present: number;
  late: number;
  lateDates: string[];
  absent: number;
  notMarked: number;
  percentage: number;
}

// ── GET /attendance/students/:id/history ────────────────────────────

export interface StudentHistoryEntry {
  date: string;
  status: AttendanceStatus;
  markedBy: string;
}

// ── GET /attendance/batches/:id/report ──────────────────────────────

export interface BatchReportStudent {
  student: { id: string; name: string; studentCode: string };
  present: number;
  late: number;
  absent: number;
  notMarked: number;
  percentage: number;
}

export interface BatchReport {
  batch: { id: string; name: string };
  totalStudents: number;
  batchAverage: number;
  students: BatchReportStudent[];
}

// ── GET /attendance/institute/overview ──────────────────────────────

export interface OverviewBatch {
  batch: { id: string; name: string };
  studentCount: number;
  average: number;
  lowCount: number;
}

export interface InstituteOverview {
  totalBatches: number;
  totalStudents: number;
  instituteAverage: number;
  totalLowStudents: number;
  lowThreshold: number;
  batches: OverviewBatch[];
}

// ── GET /attendance/institute/missing-today ─────────────────────────

export interface MissingBatch {
  batch: { id: string; name: string };
  status: "NOT_STARTED" | "IN_PROGRESS";
  startedBy: string | null;
}

export interface MissingToday {
  date: string;
  missingCount: number;
  batches: MissingBatch[];
}

// ── Notifications ──────────────────────────────────────────────────

export interface NotificationPayload {
  date: string;
  batch: {
    batchId: string;
    name: string;
    status: string;
  };
}

export interface AttendanceNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  payload: NotificationPayload;
  batchId: string;
  alertDate: string;
  resolvedAt: string | null;
  isRead: boolean;
  createdAt: string;
}
