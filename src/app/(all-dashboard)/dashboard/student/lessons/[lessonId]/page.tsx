import LessonCard from "@/components/student/lessons/LessonCard";
import VideoPlayer from "@/components/ui/VideoPlayer";
import lessonData from "../../../../../../data/mock-lessons";

interface PageProps {
  params: {
    lessonId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { lessonId } = await params;
    const res = await fetch(`http://localhost:5000/lessons/${lessonId}`)
    const lesson = await res.json();
     console.log("lessonData", lessonData.data);
      const lessons = lessonData.data;


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left */}
      <div className="lg:col-span-2">
        <h2 className="mb-4 text-2xl font-bold">{lesson?.title}</h2>

        <VideoPlayer videoId={lesson?.videoId} />

        <p className="mt-4 text-gray-600">{lesson?.description}</p>
      </div>

      {/* Right */}
      <div className="space-y-3 rounded-lg border p-3">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            // onClick={() => handleLessonClick(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
