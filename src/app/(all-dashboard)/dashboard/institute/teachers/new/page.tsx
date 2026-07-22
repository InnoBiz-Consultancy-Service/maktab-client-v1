import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireSession } from "@/lib/utils/session";
import { CreateTeacherForm } from "@/components/institute/teacher/CreateTeacher/CreateTeacher";
import { getBatchesAction } from "@/actions/institute/batch/get-batches";
import { Batch } from '../../../../../../types/institute/batch/index';

export default async function NewTeacherPage() {
  await requireSession(["INSTITUTE"]);
  const res = await getBatchesAction();
  
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/dashboard/institute"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>
      <CreateTeacherForm batch={res.ok ? res.data : []} />
    </div>
  );
}
