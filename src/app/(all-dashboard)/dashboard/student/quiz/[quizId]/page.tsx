import Quizzes from "@/components/student/quizzes/quizzes";
import quizData from "../../../../../../data/mock-quiz";

interface PageProps {
  params: Promise<{
    quizId: string;
  }>;
}

const QuizPage = async ({ params }: PageProps) => {
  const { quizId } = await params;

  
  // const result = await getQuizByIdAction(quizId);

  const result = quizData;


  if (!result.success) {
    return <div>Quiz not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <Quizzes quiz={result.data} />
    </div>
  );
};

export default QuizPage;