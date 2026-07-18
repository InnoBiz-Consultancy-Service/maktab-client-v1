/**
 * ⚠️ PLACEHOLDER DATA — the teacher APIs don't exist yet.
 *
 * Each export names the endpoint it should be replaced by. When the backend
 * lands, swap these for real server actions — the components take the data as
 * props, so nothing else needs to change.
 *
 * Mirrors the SRS teacher requirements:
 *   FR-TE-01  auto-relation (students come from the assigned class)
 *   FR-TE-02  view student progress
 *   FR-TE-03  enter and edit marks
 *   FR-TE-04  schedule exams, record results
 *   FR-TE-05  daily attendance (present / absent / leave)
 *   FR-TE-06  message a student's parent
 */

export type AttendanceMark = "PRESENT" | "ABSENT" | "LEAVE";

export interface MyStudent {
  id: string;
  name: string;
  studentCode: string;
  class: string;
  parentName: string;
  /** 0–100, across all modules. */
  progress: number;
  /** Average across recorded marks, 0–100. */
  average: number;
  /** Attendance rate over the term, 0–100. */
  attendanceRate: number;
}

export interface MarkEntry {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  kind: "quiz" | "assignment" | "exam";
  score: number;
  outOf: number;
  date: string;
}

export interface ExamItem {
  id: string;
  title: string;
  class: string;
  date: string;
  status: "scheduled" | "completed";
  studentCount: number;
}

/** TODO: replace with GET /api/v1/teachers/my-students (FR-TE-01, FR-TE-02) */
export const dummyMyStudents: MyStudent[] = [
  {
    id: "s1",
    name: "Abdullah Rahman",
    studentCode: "104829",
    class: "Nursery",
    parentName: "Rahim Uddin",
    progress: 72,
    average: 81,
    attendanceRate: 94,
  },
  {
    id: "s2",
    name: "Fatima Bibi",
    studentCode: "204118",
    class: "Nursery",
    parentName: "Karim Ali",
    progress: 58,
    average: 74,
    attendanceRate: 88,
  },
  {
    id: "s3",
    name: "Yusuf Khan",
    studentCode: "309442",
    class: "Nursery",
    parentName: "Salma Khatun",
    progress: 91,
    average: 93,
    attendanceRate: 100,
  },
  {
    id: "s4",
    name: "Maryam Akter",
    studentCode: "417205",
    class: "Nursery",
    parentName: "Nasir Ahmed",
    progress: 44,
    average: 62,
    attendanceRate: 76,
  },
  {
    id: "s5",
    name: "Ibrahim Hossain",
    studentCode: "588310",
    class: "Nursery",
    parentName: "Rahim Uddin",
    progress: 66,
    average: 78,
    attendanceRate: 91,
  },
];

/** TODO: replace with GET /api/v1/marks (FR-TE-03) */
export const dummyMarks: MarkEntry[] = [
  {
    id: "m1",
    studentId: "s3",
    studentName: "Yusuf Khan",
    title: "Surah Al-Fatiha recitation",
    kind: "quiz",
    score: 19,
    outOf: 20,
    date: "2 days ago",
  },
  {
    id: "m2",
    studentId: "s1",
    studentName: "Abdullah Rahman",
    title: "Surah Al-Fatiha recitation",
    kind: "quiz",
    score: 16,
    outOf: 20,
    date: "2 days ago",
  },
  {
    id: "m3",
    studentId: "s2",
    studentName: "Fatima Bibi",
    title: "Arabic letters worksheet",
    kind: "assignment",
    score: 14,
    outOf: 20,
    date: "5 days ago",
  },
  {
    id: "m4",
    studentId: "s4",
    studentName: "Maryam Akter",
    title: "Arabic letters worksheet",
    kind: "assignment",
    score: 11,
    outOf: 20,
    date: "5 days ago",
  },
];

/** TODO: replace with GET /api/v1/exams (FR-TE-04) */
export const dummyExams: ExamItem[] = [
  {
    id: "e1",
    title: "Term 1 — Quran recitation",
    class: "Nursery",
    date: "In 6 days",
    status: "scheduled",
    studentCount: 5,
  },
  {
    id: "e2",
    title: "Arabic alphabet test",
    class: "Nursery",
    date: "Last week",
    status: "completed",
    studentCount: 5,
  },
];
