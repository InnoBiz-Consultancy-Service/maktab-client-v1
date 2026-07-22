export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  marks: number;
  options: QuizOption[];
}

export interface Quiz {
  quizId: string;
  lessonId: string;
  title: string;
  passMark: number;
  totalMarks: number;
  timeLimit: number;
  questions: QuizQuestion[];
}