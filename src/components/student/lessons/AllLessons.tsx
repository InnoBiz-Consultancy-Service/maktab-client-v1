"use client";

import { Lesson } from "@/types/teacher/lesson/page";
import LessonCard from "./LessonCard";
import { useState } from "react";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { Session } from "@/types/auth";

const AllLessons = ({ lessons }: { lessons: Lesson[] }) => {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  // console.log("selectedLesson.quizId", selectedLesson.quizId)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left */}
      <div className="lg:col-span-2">
        <h2 className="mb-4 text-2xl font-bold"> {selectedLesson?.title}</h2>

        <VideoPlayer videoId={selectedLesson?.videoId ?? null} />

        <p className="mt-4 text-gray-600">{selectedLesson?.description}</p>
      </div>

      {/* Right */}
      <div className="space-y-3 rounded border p-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} role="student" />
        ))}
      </div>
    </div>
  );
};

export default AllLessons;
