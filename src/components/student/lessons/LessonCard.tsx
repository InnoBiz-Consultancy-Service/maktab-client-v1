import { Lesson } from "@/types/teacher/lesson/page";
import Link from "next/link";

interface Props {
  lesson: Lesson;
  // onClick: () => void;
}

const LessonCard = ({ lesson }: Props) => {
  return (
    <Link
      href={`/dashboard/student/lessons/${lesson.id}`}
      // onClick={onClick}
      className="block w-full rounded-lg border p-4 text-left"
    >
      {lesson.title}
    </Link>
  );
};
export default LessonCard;
