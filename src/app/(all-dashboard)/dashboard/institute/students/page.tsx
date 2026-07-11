import Link from "next/link";
import { UserRoundPlus, Inbox } from "lucide-react";
import { Card } from "@/components/ui";
import { searchParentsAction } from "@/actions/institute/parent/get-parents";

export default async function StudentsPage() {
  // Students are derived from the parents' children — there's no GET /students yet.
  const res = await searchParentsAction("");

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const students = res.data.flatMap((p) =>
    p.children.map((c) => ({ ...c, parentName: p.name })),
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900">Students</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {students.length} enrolled
          </p>
        </div>
        <Link
          href="/dashboard/institute/students/new"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95"
        >
          <UserRoundPlus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Add student</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      <Card className="p-0">
        {students.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <Inbox className="h-8 w-8 text-cream-200" aria-hidden />
            <p className="text-sm text-ink-soft">No students yet.</p>
            <Link
              href="/dashboard/institute/students/new"
              className="inline-flex min-h-[40px] items-center rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900"
            >
              Add the first student
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-cream-200">
            {students.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-sm font-bold text-quran">
                  {s.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-night-900">
                    {s.name}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {s.class} · {s.parentName}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-cream-100 px-2.5 py-1 font-display text-sm font-semibold tracking-wide text-night-900">
                  {s.studentCode}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
