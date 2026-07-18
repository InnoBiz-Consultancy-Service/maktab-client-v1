"use server";

import {
  dummyMyStudents,
  dummyMarks,
  dummyExams,
  type MyStudent,
  type MarkEntry,
  type ExamItem,
} from "@/lib/dummy/teacher";
import { getTodayAction } from "@/actions/attendance/get-today";
import type { ActionResult } from "@/types/shared";
import type { TodayBatch } from "@/types/attendance";

export interface TeacherOverview {
  counts: {
    students: number;
    /** Batches today that haven't finished attendance (not started or in progress). */
    attendancePending: number;
    /** Class average across all recorded marks, 0–100. */
    classAverage: number;
  };
  students: MyStudent[];
  todayBatches: TodayBatch[];
  recentMarks: MarkEntry[];
  exams: ExamItem[];
}

/**
 * ⚠️ `students`, `recentMarks`, and `exams` are still PLACEHOLDER data — those
 * teacher endpoints don't exist yet. `todayBatches` is real, backed by the
 * attendance module's GET /attendance/today.
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

  const todayRes = await getTodayAction();
  if (!todayRes.ok) {
    return { ok: false, error: todayRes.error };
  }
  const todayBatches = todayRes.data.batches;

  return {
    ok: true,
    data: {
      counts: {
        students: students.length,
        attendancePending: todayBatches.filter(
          (b) => b.state === "NOT_STARTED" || b.state === "IN_PROGRESS",
        ).length,
        classAverage,
      },
      students,
      todayBatches,
      recentMarks: dummyMarks,
      exams: dummyExams,
    },
  };
}
