/**
 * ⚠️ PLACEHOLDER DATA — the backend for these features is still being built.
 *
 * Everything here is fake. Each export is marked with the endpoint it should be
 * replaced by, so swapping in the real server action later is a one-line change
 * at the call site.
 *
 * Real data (teachers, parents, students) does NOT live here — that comes from
 * the actions in src/actions/.
 */

export interface AttendanceToday {
  present: number;
  absent: number;
  notTaken: number;
}

export interface ActivityEntry {
  id: string;
  kind: "attendance" | "marks" | "enrolment" | "payment";
  text: string;
  /** Human-friendly relative time, e.g. "2 hours ago". */
  when: string;
}

export interface ClassSummary {
  id: string;
  name: string;
  students: number;
  teacher: string;
}

/** TODO: replace with GET /api/v1/attendance/today */
export const dummyAttendanceToday: AttendanceToday = {
  present: 18,
  absent: 3,
  notTaken: 5,
};

/** TODO: replace with GET /api/v1/activity */
export const dummyActivity: ActivityEntry[] = [
  {
    id: "a1",
    kind: "attendance",
    text: "Ustad Kamal took attendance for Nursery",
    when: "2 hours ago",
  },
  {
    id: "a2",
    kind: "marks",
    text: "Marks added for 6 students in Hifz",
    when: "5 hours ago",
  },
  {
    id: "a3",
    kind: "enrolment",
    text: "Fatima Bibi enrolled in Class 1",
    when: "Yesterday",
  },
  {
    id: "a4",
    kind: "payment",
    text: "Payment received from Rahim Uddin",
    when: "2 days ago",
  },
];

/** TODO: replace with GET /api/v1/batches (the Batch model already exists) */
export const dummyClasses: ClassSummary[] = [
  { id: "c1", name: "Nursery", students: 12, teacher: "Ustad Kamal" },
  { id: "c2", name: "Class 1", students: 9, teacher: "Ustad Kamrul" },
  { id: "c3", name: "Hifz", students: 5, teacher: "Ustad Kamal" },
];
