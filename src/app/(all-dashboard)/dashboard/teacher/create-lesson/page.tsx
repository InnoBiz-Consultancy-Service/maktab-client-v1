import { getMyBatchesAction } from "@/actions/teacher/lesson/getMyBatch.action";
import CreateLesson from "@/components/teacher/lesson/CreateLesson";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const LessonsPage = async () => {
  const result = await getMyBatchesAction();
 
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/dashboard/teacher"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>
      <CreateLesson batch={result.ok ? result.data : []} mode="create"></CreateLesson>
    </div>
  );
};

export default LessonsPage;
