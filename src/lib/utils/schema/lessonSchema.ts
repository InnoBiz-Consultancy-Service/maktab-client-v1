import { z } from "zod";

const optionSchema = z.object({
  text: z.string().trim().min(1, "Option text is required."),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().trim().min(1, "Question text is required."),
  options: z
    .array(optionSchema)
    .length(4, "Each question needs exactly 4 options.")
    .refine((opts) => opts.filter((o) => o.isCorrect).length === 1, {
      message: "Exactly one option must be correct.",
    })
    .refine(
      (opts) => new Set(opts.map((o) => o.text.trim())).size === opts.length,
      { message: "Options must be different from each other." },
    ),
});

const quizSchema = z
  .object({
    passMark: z
      .number({ invalid_type_error: "Pass mark must be a number." })
      .int()
      .positive("Pass mark must be at least 1."),
    questions: z.array(questionSchema).min(1, "Add at least one question."),
  })
  .refine((q) => q.passMark <= q.questions.length, {
    message: "Pass mark cannot exceed the number of questions.",
    path: ["passMark"],
  });

export const createLessonSchema = z
  .object({
    batchId: z.string().min(1, "Please select a batch."),

    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters.")
      .max(200, "Title must be less than 200 characters."),

    description: z
      .string()
      .trim()
      .max(2000, "Description must be less than 2000 characters.")
      .nullable()
      .optional(),

    videoUrl: z
      .union([
        z.string().trim().url("Please enter a valid YouTube URL."),
        z.literal(""),
      ])
      .optional()
      .transform((v) => (v ? v : undefined)),

    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),

    status: z.enum(["DRAFT", "PUBLISHED"], {
      required_error: "Please choose Draft or Published.",
    }),

    quiz: quizSchema.nullable().optional(),
  })
  .refine((d) => Boolean(d.videoUrl) || Boolean(d.quiz), {
    message: "Provide a video URL or a quiz (at least one is required).",
    path: ["videoUrl"],
  });

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
