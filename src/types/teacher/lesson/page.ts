export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoId: string | null;
  date: string;
  hasQuiz: boolean;
  attempted: boolean;
  createdAt: string;
}