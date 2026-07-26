import AllLessons from "@/components/student/lessons/AllLessons";
import lessonData from "../../../../../data/mock-lessons";
import Link from "next/link";
import { Plus } from "lucide-react";

const LessonsPage = async () => {
  const lessons = lessonData.data;


  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-night-900">Lessons</h1>
          <p>Access and watch all your course lessons in one place.</p>
        </div>
        <Link
          href="/dashboard/teacher/create-lesson"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Add lesson</span>
        </Link>
      </div>
      <AllLessons lessons={lessons as any}></AllLessons>
    </div>
  );
};

export default LessonsPage;
