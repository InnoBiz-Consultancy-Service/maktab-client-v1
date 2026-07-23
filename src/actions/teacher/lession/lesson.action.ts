"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { Lesson } from "@/types/teacher/lesson/page";
import { createLessonSchema } from "@/lib/utils/schema/lessonSchema";

export interface CreateLessonState {
  success: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<string, string>>;
  createdLesson?: Lesson;
  values?: Record<string, string | boolean>;
}

function unwrap<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data?: unknown }).data &&
    typeof (raw as { data?: unknown }).data === "object"
  ) {
    return (raw as { data: T }).data;
  }

  return raw as T;
}

type CreateLessonPayload = {
  batchId: string;
  title: string;
  description: string;
  videoUrl: string;
  date: string;
  isPublished: boolean;
};

export async function createLessonAction(
  data: CreateLessonPayload,
): Promise<CreateLessonState> {
  const parsed = createLessonSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path[0];

      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    return {
      success: false,
      fieldErrors,
      formError: "Please fix the highlighted fields.",
      values: data,
    };
  }

  const result = await universalApi<unknown>({
    endpoint: "/api/v1/lessons",
    method: "POST",
    data: parsed.data,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      formError: result.message ?? "Could not create lesson.",
      values: data,
    };
  }

  const createdLesson = unwrap<Lesson>(result.data);

  revalidatePath("/dashboard/teacher/create-lesson");

  return {
    success: true,
    createdLesson,
  };
}


// export async function updateLessonAction({
//   lessonId,
//   data,
// }: UpdateLessonPayload): Promise<UpdateLessonState> {
//   const result = await universalApi<unknown>({
//     endpoint: `/api/v1/lessons/${lessonId}`,
//     method: "PATCH",
//     data,
//     requireAuth: true,
//   });

//   if (!result.success) {
//     return {
//       success: false,
//       formError: result.message ?? "Could not update lesson.",
//     };
//   }

//   const updatedLesson = unwrap<Lesson>(result.data);

//   revalidatePath("/dashboard/teacher/lessons");

//   return {
//     success: true,
//     updatedLesson,
//   };
// }