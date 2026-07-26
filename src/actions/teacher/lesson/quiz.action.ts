"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { Quiz } from "@/types/teacher/quiz/page";

export interface CreateQuizState {
  success: boolean;
  formError?: string;
  createdQuiz?: Quiz;
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

type CreateQuizPayload = {
  lessonId: string;
  passMark: number;
  timeLimit: number;
  questions: {
    text: string;
    marks: number;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
};

export async function createQuizAction(
  data: CreateQuizPayload,
): Promise<CreateQuizState> {
  const { lessonId, ...quizData } = data;

  const result = await universalApi<unknown>({
    endpoint: `/api/v1/lessons/${lessonId}/quiz`,
    method: "POST",
    data: quizData,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      formError: result.message ?? "Could not create quiz.",
    };
  }

  const createdQuiz = unwrap<Quiz>(result.data);

  revalidatePath("/dashboard/teacher/create-lesson");

  return {
    success: true,
    createdQuiz,
  };
}