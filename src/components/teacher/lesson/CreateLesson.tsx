"use client";

import { createLessonAction } from "@/actions/teacher/lesson/lesson.action";
import { createQuizAction } from "@/actions/teacher/lesson/quiz.action";
import { Button, Card, Input, Select } from "@/components/ui";
import { Textarea } from "@/components/ui/Textarea";
import { Batch } from "@/types/institute/batch";
import { Lesson } from "@/types/teacher/lesson/page";
import { Quiz } from "@/types/teacher/quiz/page";
import { useState } from "react";

interface Props {
  batch: Batch[];
  mode?: "create" | "edit";
  lesson?: Lesson;
  quiz?: Quiz;
}

const CreateLesson = ({ batch, lesson, mode, quiz }: Props) => {
  const [step, setStep] = useState<"lesson" | "quiz">("lesson");

  const [formData, setFormData] = useState({
    batchId: lesson?.batchId ?? "",
    title: lesson?.title ?? "",
    description: lesson?.description ?? "",
    videoUrl: lesson?.videoId ?? "",
    date: lesson?.date ?? "",
    status: lesson?.status ? "PUBLISHED" : "DRAFT",
  });

  const [quizData, setQuizData] = useState({
    passMark: quiz?.passMark ?? 6,
    // timeLimit: quiz?.timeLimit ?? 10,
    questions: quiz?.questions ?? [
      {
        text: "",
        marks: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setStep("quiz");

    // console.log(formData);

    const payload = {
      ...formData,
      quiz: null,
    };

    if (mode === "create") {
      await createLessonAction(payload as any);
    } else {
      // await updateLessonAction(lesson!.id, formData);
    }

    setFormData({
      batchId: "",
      title: "",
      description: "",
      videoUrl: "",
      date: "",
      status: "",
    });
  };

  const handleLessonWithQuiz = async () => {
    try {
      const payload = {
        batchId: formData.batchId,
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        date: formData.date,
        status: formData.status,
        quiz: {
          passMark: quizData.passMark,
          questions: quizData.questions.map((q) => ({
            text: q.text,
            options: q.options.map((o) => ({
              text: o.text,
              isCorrect: o.isCorrect,
            })),
          })),
        },
      };

      await createLessonAction(payload as any);

      console.log(payload);

      setFormData({
      batchId: "",
      title: "",
      description: "",
      videoUrl: "",
      date: "",
      status: "",
    });

    setQuizData({
    passMark: quiz?.passMark ?? 6,
    // timeLimit: quiz?.timeLimit ?? 10,
    questions: quiz?.questions ?? [
      {
        text: "",
        marks: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ],
  })
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {step === "lesson" && (
        <Card className="mx-auto w-full max-w-2xl">
          <div className="mb-6">
            <h2>{mode === "create" ? "Add a Lesson" : "Update Lesson"} </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Batch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Select
                  label="Batch"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                >
                  <option value="">Select Batch</option>

                  {batch.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Title */}
              <div>
                <Input
                  label="Lesson Title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter lesson title"
                  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Video URL */}
              <div>
                <Input
                  label="Video URL"
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtu.be/..."
                  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <Input
                  label="Lesson Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Publish */}
            <div>
              <Select
                label="Publish Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Textarea
                label="Description"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Lesson description"
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <Button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Create Lesson
        </Button> */}
            <div className="flex gap-3 justify-end">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setStep("quiz")}
                >
                  {mode === "create" ? "Add Quiz" : "Update Quiz"}
                </Button>
              </div>

              <Button type="submit">
                {mode === "create" ? "Create Lesson" : "Update Lesson"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {step === "lesson" ? (
        ""
      ) : (
        <div>
          {quizData.questions.map((question, qIndex) => (
            <Card key={qIndex} className="mt-5 space-y-4">
              <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>

              {/* Question */}
              <Input
                label="Question"
                value={question.text}
                onChange={(e) => {
                  const updated = [...quizData.questions];
                  updated[qIndex].text = e.target.value;

                  setQuizData({
                    ...quizData,
                    questions: updated,
                  });
                }}
              />

              {/* Marks */}
              <Input
                label="Marks"
                type="number"
                value={question.marks}
                onChange={(e) => {
                  const updated = [...quizData.questions];
                  updated[qIndex].marks = Number(e.target.value);

                  setQuizData({
                    ...quizData,
                    questions: updated,
                  });
                }}
              />

              {/* Options */}
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className="grid grid-cols-1 md:grid-cols-4 items-center justify-between md:gap-3"
                >
                  <div className="md:col-span-3">
                    <Input
                      className="flex-1"
                      label={`Option ${optionIndex + 1}`}
                      value={option.text}
                      onChange={(e) => {
                        const updated = [...quizData.questions];

                        updated[qIndex].options[optionIndex].text =
                          e.target.value;

                        setQuizData({
                          ...quizData,
                          questions: updated,
                        });
                      }}
                    />
                  </div>
                  <div className="md:col-span-1 mr-auto">
                    <label className="mt-3 md:mt-6 flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={option.isCorrect}
                        onChange={() => {
                          const updated = [...quizData.questions];

                          updated[qIndex].options.forEach((item) => {
                            item.isCorrect = false;
                          });

                          updated[qIndex].options[optionIndex].isCorrect = true;

                          setQuizData({
                            ...quizData,
                            questions: updated,
                          });
                        }}
                      />
                      Correct
                    </label>
                  </div>
                </div>
              ))}

              <div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setQuizData({
                      ...quizData,
                      questions: [
                        ...quizData.questions,
                        {
                          text: "",
                          marks: 1,
                          options: [
                            { text: "", isCorrect: false },
                            { text: "", isCorrect: false },
                            { text: "", isCorrect: false },
                            { text: "", isCorrect: false },
                          ],
                        },
                      ],
                    })
                  }
                >
                  Add Question
                </Button>
              </div>
            </Card>
          ))}

          <div className="mt-10 flex gap-2 justify-end">
            <Button
              variant="night"
              type="button"
              onClick={() => setStep("lesson")}
            >
              Previous
            </Button>

            <Button type="button" onClick={handleLessonWithQuiz}>
              {mode === "create" ? "Create Lesson" : "Update Lesson"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateLesson;
