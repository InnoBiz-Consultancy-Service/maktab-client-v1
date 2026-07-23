"use client";

import { submitQuizAction } from "@/actions/student/quizzes/quizzesAction";
import { Button } from "@/components/ui";
import { useState } from "react";

interface QuizProps {
  quiz: any;
}

const Quizzes = ({ quiz }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<
    {
      questionId: string;
      selectedOptionId: string;
    }[]
  >([]);

  const question = quiz.questions[currentQuestion];

  const allQuestionsAnswered = answers.length === quiz.questions.length;

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const exist = prev.find((q) => q.questionId === questionId);

      if (exist) {
        return prev.map((item) =>
          item.questionId === questionId
            ? { ...item, selectedOptionId: optionId }
            : item,
        );
      }

      return [
        ...prev,
        {
          questionId,
          selectedOptionId: optionId,
        },
      ];
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async() => {
    console.log(answers);

    await submitQuizAction(quiz.quizId, {
      answers,
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-lg border p-6">
      <div>
        <h2 className="text-2xl font-bold">{quiz.title}</h2>

        <p className="mt-2 text-sm text-gray-500">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      <div className="rounded-lg border p-5">
        <h3 className="mb-5 text-lg font-semibold">
          {currentQuestion + 1}. {question.text}
        </h3>

        <div className="space-y-3">
          {question.options.map((option: any) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded border p-3 hover:bg-gray-50"
            >
              <input
                type="radio"
                name={question.id}
                checked={
                  answers.find((item) => item.questionId === question.id)
                    ?.selectedOptionId === option.id
                }
                onChange={() => handleSelect(question.id, option.id)}
              />

              {option.text}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="rounded bg-gray-200 px-5 py-2 disabled:opacity-40"
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`rounded px-5 py-2 text-white transition 
             
                `}
          >
            Submit Quiz
          </Button>
        ) : (
          <button
            onClick={handleNext}
            className="rounded bg-blue-600 px-5 py-2 text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
