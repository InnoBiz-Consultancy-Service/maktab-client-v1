import AllLessons from "@/components/student/lessons/AllLessons";
import { cookies } from "next/headers";

const LessonsPage = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/lessons/student`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const result = await res.json();

  const lessons = result?.data?.lessons;

  // const lessons = lessonData.data;

  console.log("result", result);
  return (
    <div>
      <AllLessons lessons={lessons}></AllLessons>
    </div>
  );
};

export default LessonsPage;
