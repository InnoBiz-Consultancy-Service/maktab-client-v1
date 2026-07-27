"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { unwrap } from "@/lib/utils/unwrap";
import { createLessonSchema } from "@/lib/utils/schema/lessonSchema";
import type {
  CreateLessonInput,
  LessonFormState,
  TeacherLessonDetail,
} from "@/types/lesson";

/**
 * POST /lessons
 * Creates a lesson with an optional inline quiz (questions + 4 options + the
 * correct one, all in a single payload). Server requires a video OR a quiz.
 */
export async function createLessonAction(
  input: CreateLessonInput,
): Promise<LessonFormState<TeacherLessonDetail>> {
  const parsed = createLessonSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    console.error("createLesson validation failed:", parsed.error.issues);
    // Surface the first concrete problem so the teacher knows exactly what to fix.
    const first = parsed.error.issues[0];
    const path = first?.path?.join(".") || "form";
    return {
      success: false,
      fieldErrors,
      formError: first
        ? `${first.message} (${path})`
        : "Please fix the highlighted fields.",
    };
  }

  try {
    const res = await universalApi<any>({
      endpoint: "/lessons",
      method: "POST",
      data: parsed.data,
    });

    if (!res.success) {
      const fieldErrors: Record<string, string> = {};
      for (const e of res.errorSource ?? []) fieldErrors[e.path] = e.message;
      return {
        success: false,
        formError: res.message ?? "Could not create lesson.",
        fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
      };
    }

    revalidatePath("/dashboard/teacher/lessons");
    return { success: true, data: unwrap<TeacherLessonDetail>(res.data) };
  } catch (error: any) {
    return {
      success: false,
      formError: error?.message ?? "Could not create lesson.",
    };
  }
}
