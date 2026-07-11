import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireSession } from "@/lib/utils/session";
import { CreateTeacherForm } from "@/components/institute/teacher/CreateTeacher/CreateTeacher";

export default async function NewTeacherPage() {
  await requireSession(["INSTITUTE"]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/dashboard/institute"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>
      <CreateTeacherForm />
    </div>
  );
}
