import { getBatchesAction } from "@/actions/institute/batch/get-batches";
import CreateLesson from "@/components/teacher/lesson/CreateLesson";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const LessonsPage = async () => {
  const res = await getBatchesAction();

  console.log("res", res);

  return (
    <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/dashboard/teacher"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>
      <CreateLesson batch={res.ok ? res.data : []}></CreateLesson>
    </div>
  );
};

export default LessonsPage;
