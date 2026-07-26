import { universalApi } from "@/actions/universal-api";

type SubmitQuizPayload = {
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
};

export async function submitQuizAction(
  quizId: string,
  data: SubmitQuizPayload
) {
  return universalApi({
    endpoint: `/api/v1/quizzes/${quizId}/attempt`,
    method: "POST",
    data,
    requireAuth: true,
  });
}