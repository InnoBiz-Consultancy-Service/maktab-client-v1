"use server";

import { TeacherSearchResult } from "@/types/institute/teachers";
import type { ActionResult } from "@/types/shared";
import { searchTeachersAction } from "./teacher/get-teacher";
import { searchParentsAction } from "./parent/get-parents";

/** A student, flattened out of the parents' `children` arrays. */
export interface OverviewStudent {
  id: string;
  name: string;
  class: string;
  studentCode: string;
  isActive: boolean;
  parentName: string;
}

export interface InstituteOverview {
  counts: {
    teachers: number;
    students: number;
    parents: number;
  };
  recentTeachers: TeacherSearchResult[];
  recentStudents: OverviewStudent[];
}

/**
 * Everything the institute dashboard needs, in one call.
 *
 * There is no GET /students endpoint yet, so students are derived from the
 * parents list — each parent carries its `children[]` scoped to this institute.
 * The two requests run in parallel.
 */
export async function getInstituteOverviewAction(): Promise<
  ActionResult<InstituteOverview>
> {
  const [teachersRes, parentsRes] = await Promise.all([
    searchTeachersAction(""),
    searchParentsAction(""),
  ]);

  if (!teachersRes.ok) {
    return { ok: false, error: teachersRes.error };
  }

  if (!parentsRes.ok) {
    return { ok: false, error: parentsRes.error };
  }

  const teachers = teachersRes.data;
  const parents = parentsRes.data;

  const students: OverviewStudent[] = parents.flatMap((p) =>
    p.children.map((c) => ({
      id: c.id,
      name: c.name,
      class: c.class,
      studentCode: c.studentCode,
      isActive: c.isActive,
      parentName: p.name,
    })),
  );

  // Teachers arrive A–Z; sort a copy newest-first for the "recent" panel.
  const recentTeachers = [...teachers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return {
    ok: true,
    data: {
      counts: {
        teachers: teachers.length,
        students: students.length,
        parents: parents.length,
      },
      recentTeachers,
      recentStudents: students.slice(0, 5),
    },
  };
}
