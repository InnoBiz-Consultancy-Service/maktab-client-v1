"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { unwrap } from "@/lib/utils/unwrap";
import type {
  UpdateLessonInput,
  LessonFormState,
  TeacherLessonDetail,
} from "@/types/lesson";

export async function updateLessonAction(
  id: string,
  input: UpdateLessonInput,
): Promise<LessonFormState<TeacherLessonDetail>> {
  try {
    const res = await universalApi<any>({
      endpoint: `/lessons/${id}`,
      method: "PATCH",
      data: input,
    });

    if (!res.success) {
      const fieldErrors: Record<string, string> = {};
      for (const e of res.errorSource ?? []) fieldErrors[e.path] = e.message;
      return {
        success: false,
        formError: res.message ?? "Could not update lesson.",
        fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
      };
    }

    revalidatePath("/dashboard/teacher/lessons");
    revalidatePath(`/dashboard/teacher/lessons/${id}`);
    return { success: true, data: unwrap<TeacherLessonDetail>(res.data) };
  } catch (error: any) {
    return {
      success: false,
      formError: error?.message ?? "Could not update lesson.",
    };
  }
}
