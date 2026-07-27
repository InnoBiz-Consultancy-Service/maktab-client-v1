"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { unwrap } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type { VideoCompleteResult } from "@/types/lesson";

export async function completeVideoAction(
  lessonId: string,
): Promise<ActionResult<VideoCompleteResult>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/student/${lessonId}/video/complete`,
      method: "POST",
    });
    if (!res.success) {
      return {
        ok: false,
        error: res.message ?? "Could not mark video complete.",
      };
    }
    revalidatePath("/dashboard/student/lessons");
    revalidatePath(`/dashboard/student/lessons/${lessonId}`);
    return { ok: true, data: unwrap<VideoCompleteResult>(res.data) };
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message ?? "Could not mark video complete.",
    };
  }
}
