// "use server";

// import { universalApi } from "@/actions/universal-api";
// import { unwrap, unwrapMeta } from "@/lib/utils/unwrap";
// import type { ActionResult } from "@/types/shared";
// import type { LessonResults, ResultsFilter } from "@/types/lesson";

// export interface LessonResultsQuery {
//   status?: ResultsFilter;
//   search?: string;
//   page?: number;
//   limit?: number;
// }

// export async function getLessonResultsAction(
//   lessonId: string,
//   q: LessonResultsQuery = {},
// ): Promise<ActionResult<LessonResults>> {
//   const params = new URLSearchParams();
//   if (q.status && q.status !== "ALL") params.set("status", q.status);
//   if (q.search?.trim()) params.set("search", q.search.trim());
//   params.set("page", String(q.page ?? 1));
//   params.set("limit", String(q.limit ?? 50));

//   try {
//     const res = await universalApi<any>({
//       endpoint: `/lessons/teacher/${lessonId}/results?${params.toString()}`,
//       method: "GET",
//     });
//     if (!res.success) {
//       return { ok: false, error: res.message ?? "Could not load results." };
//     }
//     const payload = unwrap<Omit<LessonResults, "meta">>(res.data);
//     return { ok: true, data: { ...payload, meta: unwrapMeta(res.data) } };
//   } catch (error: any) {
//     return { ok: false, error: error?.message ?? "Could not load results." };
//   }
// }

"use server";

import { universalApi } from "@/actions/universal-api";
import { pickArray, unwrap, unwrapMeta } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type {
  LessonResults,
  LessonResultsSummary,
  ResultsFilter,
  StudentResultRow,
} from "@/types/lesson";

export interface LessonResultsQuery {
  status?: ResultsFilter;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getLessonResultsAction(
  lessonId: string,
  q: LessonResultsQuery = {},
): Promise<ActionResult<LessonResults>> {
  const params = new URLSearchParams();
  if (q.status && q.status !== "ALL") params.set("status", q.status);
  if (q.search?.trim()) params.set("search", q.search.trim());
  params.set("page", String(q.page ?? 1));
  params.set("limit", String(q.limit ?? 50));

  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/teacher/${lessonId}/results?${params.toString()}`,
      method: "GET",
    });

    if (!res.success) {
      return { ok: false, error: res.message ?? "Could not load results." };
    }

    const inner = (unwrap<Record<string, any>>(res.data) ?? {}) as Record<
      string,
      any
    >;

    const emptySummary: LessonResultsSummary = {
      totalStudents: 0,
      completed: 0,
      videoCompleted: 0,
      quizPassed: null,
      quizAttemptedButFailed: 0,
      notStarted: 0,
    };

    const data: LessonResults = {
      lesson: inner.lesson ?? {
        title: "",
        hasVideo: false,
        hasQuiz: false,
        passMark: null,
        totalQuestions: null,
      },
      summary: inner.summary ?? emptySummary,
      results: pickArray<StudentResultRow>(res.data, [
        "results",
        "students",
        "rows",
      ]),
      meta: inner.meta ?? unwrapMeta(res.data),
    };

    return { ok: true, data };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Could not load results." };
  }
}
