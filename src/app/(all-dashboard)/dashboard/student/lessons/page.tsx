import AllLessons from "@/components/student/lessons/AllLessons";
import lessonData from "../../../../../data/mock-lessons";

const LessonsPage = () => {
 
  const lessons = lessonData.data;
  return (
    <div>
      <AllLessons lessons={lessons}></AllLessons>
    </div>
  );
};

export default LessonsPage;
