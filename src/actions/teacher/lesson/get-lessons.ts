"use server";

import { universalApi } from "@/actions/universal-api";
import { pickArray, unwrap, unwrapList, unwrapMeta } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type {
  LessonStatus,
  Paginated,
  TeacherLessonDetail,
  TeacherLessonListItem,
} from "@/types/lesson";

export interface TeacherLessonQuery {
  batchId?: string;
  status?: LessonStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getTeacherLessonsAction(
  q: TeacherLessonQuery = {},
): Promise<ActionResult<Paginated<TeacherLessonListItem>>> {
  const params = new URLSearchParams();
  if (q.batchId) params.set("batchId", q.batchId);
  if (q.status) params.set("status", q.status);
  if (q.search?.trim()) params.set("search", q.search.trim());
  params.set("page", String(q.page ?? 1));
  params.set("limit", String(q.limit ?? 20));

  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/teacher?${params.toString()}`,
      method: "GET",
    });
    if (!res.success) {
      return { ok: false, error: res.message ?? "Could not load lessons." };
    }
    return {
      ok: true,
      data: {
        items: pickArray<TeacherLessonListItem>(res.data, ["lessons"]),
        meta: unwrapMeta(res.data),
      },
    };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Could not load lessons." };
  }
}

export async function getTeacherLessonAction(
  id: string,
): Promise<ActionResult<TeacherLessonDetail>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/teacher/${id}`,
      method: "GET",
    });
    if (!res.success) {
      return { ok: false, error: res.message ?? "Could not load lesson." };
    }
    return { ok: true, data: unwrap<TeacherLessonDetail>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Could not load lesson." };
  }
}
