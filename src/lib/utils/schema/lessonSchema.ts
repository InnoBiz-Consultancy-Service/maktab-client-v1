import { z } from "zod";

export const createLessonSchema = z.object({
  batchId: z
    .string()
    .min(1, "Please select a batch."),

  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(200, "Title must be less than 200 characters."),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  videoUrl: z
    .string()
    .trim()
    .url("Please enter a valid YouTube URL.")
    .optional()
    .or(z.literal("")),

  date: z
    .string()
    .min(1, "Please select a lesson date."),

  isPublished: z.boolean(),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;