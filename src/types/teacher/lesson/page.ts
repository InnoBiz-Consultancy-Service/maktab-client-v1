export interface Lesson {
  id: string;
  batchId: string;
  title: string;
  description: string | null;
  videoId?: string | null;
  date: string;
  hasQuiz: boolean;
  attempted: boolean;
  createdAt: string;
  quizId?: string;
  status: "PUBLISHED" | "DRAFT";
}