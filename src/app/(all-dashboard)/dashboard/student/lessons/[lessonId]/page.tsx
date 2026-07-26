import LessonCard from "@/components/student/lessons/LessonCard";
import { Button } from "@/components/ui";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { Lesson } from "@/types/teacher/lesson/page";
import { cookies } from "next/headers";
import Link from "next/link";

interface PageProps {
  params: {
    lessonId: string;
  };
}

const lessonDetailsPage = async ({ params }: PageProps) => {
  const { lessonId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/lessons/student/${lessonId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const result = await res.json();
  const lesson = result?.data;
  console.log("lesson", lesson);

  const lessonRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/lessons/student`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const lessonResult = await lessonRes.json();

  const lessons = lessonResult?.data?.lessons;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left */}
      <div className="lg:col-span-2">
        <h2 className="mb-4 text-2xl font-bold">{lesson?.title}</h2>
        <VideoPlayer videoId={lesson?.videoId} />
        <p className="mt-4 text-gray-600">{lesson?.description}</p>

        <Link href={`/dashboard/student/quiz/q1...`}>
          <Button className="mt-5">Quiz</Button>
        </Link>
      </div>

      {/* Right */}
      <div className="space-y-3 rounded border p-3">
        {lessons?.map((lesson: Lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} role="student" />
        ))}
      </div>
    </div>
  );
};

export default lessonDetailsPage;
