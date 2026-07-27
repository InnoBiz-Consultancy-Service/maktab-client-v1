"use server";

import { universalApi } from "@/actions/universal-api";
import { pickArray, unwrap, unwrapList, unwrapMeta } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type {
  Paginated,
  StudentLessonDetail,
  StudentLessonListItem,
} from "@/types/lesson";

export interface StudentLessonQuery {
  batchId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getStudentLessonsAction(
  q: StudentLessonQuery = {},
): Promise<ActionResult<Paginated<StudentLessonListItem>>> {
  const params = new URLSearchParams();
  if (q.batchId) params.set("batchId", q.batchId);
  if (q.search?.trim()) params.set("search", q.search.trim());
  params.set("page", String(q.page ?? 1));
  params.set("limit", String(q.limit ?? 20));

  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/student?${params.toString()}`,
      method: "GET",
    });
    if (!res.success) {
      return { ok: false, error: res.message ?? "Could not load lessons." };
    }
    return {
      ok: true,
      data: {
        items: pickArray<StudentLessonListItem>(res.data, ["lessons"]),
        meta: unwrapMeta(res.data),
      },
    };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Could not load lessons." };
  }
}

export async function getStudentLessonAction(
  id: string,
): Promise<ActionResult<StudentLessonDetail>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/student/${id}`,
      method: "GET",
    });
    if (!res.success) {
      return { ok: false, error: res.message ?? "Could not load lesson." };
    }
    return { ok: true, data: unwrap<StudentLessonDetail>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Could not load lesson." };
  }
}
