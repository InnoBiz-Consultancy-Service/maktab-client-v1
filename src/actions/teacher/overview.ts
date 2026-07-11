"use server";

import {
  dummyMyStudents,
  dummyTodaySessions,
  dummyMarks,
  dummyExams,
  type MyStudent,
  type TodaySession,
  type MarkEntry,
  type ExamItem,
} from "@/lib/dummy/teacher";
import type { ActionResult } from "@/types/shared";

export interface TeacherOverview {
  counts: {
    students: number;
    /** Sessions today that still need attendance taken. */
    attendancePending: number;
    /** Class average across all recorded marks, 0–100. */
    classAverage: number;
  };
  students: MyStudent[];
  todaySessions: TodaySession[];
  recentMarks: MarkEntry[];
  exams: ExamItem[];
}

/**
 * ⚠️ Returns PLACEHOLDER data — the teacher endpoints don't exist yet.
 *
 * It's shaped like a real action (async, ActionResult) so that when the API
 * lands, only the body of this function changes — no caller has to move.
 */
export async function getTeacherOverviewAction(): Promise<
  ActionResult<TeacherOverview>
> {
  const students = dummyMyStudents;

  const classAverage =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.average, 0) / students.length,
        )
      : 0;

  return {
    ok: true,
    data: {
      counts: {
        students: students.length,
        attendancePending: dummyTodaySessions.filter((s) => !s.attendanceTaken)
          .length,
        classAverage,
      },
      students,
      todaySessions: dummyTodaySessions,
      recentMarks: dummyMarks,
      exams: dummyExams,
    },
  };
}
