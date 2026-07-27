import { Session } from "@/types/auth";
import { Lesson } from "@/types/teacher/lesson/page";
import { SquarePen } from "lucide-react";
import Link from "next/link";

interface Props {
  lesson: Lesson;
  role: string;
}

const LessonCard = ({ lesson, role }: Props) => {
  return (
    <div className="flex justify-between rounded border p-4">
      <Link href={`/dashboard/${role}/lessons/${lesson.id}`}>
        {lesson.title}
      </Link>
      <Link href="/dashboard/teacher/update-lesson">
        <SquarePen className="text-sm" />
      </Link>
    </div>
  );
};
export default LessonCard;
