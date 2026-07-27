"use server";

import { universalApi } from "@/actions/universal-api";
import { unwrap } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type { StudentResultDetail } from "@/types/lesson";

export async function getStudentResultAction(
  lessonId: string,
  studentId: string,
): Promise<ActionResult<StudentResultDetail>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/teacher/${lessonId}/results/${studentId}`,
      method: "GET",
    });
    if (!res.success) {
      return {
        ok: false,
        error: res.message ?? "Could not load student result.",
      };
    }
    return { ok: true, data: unwrap<StudentResultDetail>(res.data) };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message ?? "Could not load student result.",
    };
  }
}
