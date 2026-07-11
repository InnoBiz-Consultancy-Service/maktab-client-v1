import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateStudentWizard } from "@/components/institute/student/CreateStudent/CreateStudent";

export default function NewStudentPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href="/dashboard/institute"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-night-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to dashboard
      </Link>

      <CreateStudentWizard />
    </div>
  );
}
