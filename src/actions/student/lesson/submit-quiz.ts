"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { unwrap } from "@/lib/utils/unwrap";
import type { ActionResult } from "@/types/shared";
import type {
  QuizAttemptsResult,
  SubmitQuizInput,
  SubmitQuizResult,
} from "@/types/lesson";

export async function submitQuizAction(
  lessonId: string,
  input: SubmitQuizInput,
): Promise<ActionResult<SubmitQuizResult>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/student/${lessonId}/quiz/submit`,
      method: "POST",
      data: input,
    });
    if (!res.success) {
      return { ok: false, error: res.message ?? "Could not submit quiz." };
    }
    revalidatePath("/dashboard/student/lessons");
    revalidatePath(`/dashboard/student/lessons/${lessonId}`);
    return { ok: true, data: unwrap<SubmitQuizResult>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Could not submit quiz." };
  }
}

export async function getQuizAttemptsAction(
  lessonId: string,
): Promise<ActionResult<QuizAttemptsResult>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/student/${lessonId}/quiz/attempts`,
      method: "GET",
    });
    if (!res.success) {
      return { ok: false, error: res.message ?? "Could not load attempts." };
    }
    return { ok: true, data: unwrap<QuizAttemptsResult>(res.data) };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? "Could not load attempts." };
  }
}
