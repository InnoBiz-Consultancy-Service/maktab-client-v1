import Link from "next/link";
import { UserPlus, Inbox } from "lucide-react";
import { Card } from "@/components/ui";
import { searchTeachersAction } from "@/actions/institute/teacher/get-teacher";

export default async function TeachersPage() {
  const res = await searchTeachersAction("");

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const teachers = res.data;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900">Teachers</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {teachers.length} in your institute
          </p>
        </div>
        <Link
          href="/dashboard/institute/teachers/new"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 font-display text-sm font-semibold text-night-900 transition-transform hover:scale-[1.02] active:scale-95"
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Add teacher</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      <Card className="p-0">
        {teachers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <Inbox className="h-8 w-8 text-cream-200" aria-hidden />
            <p className="text-sm text-ink-soft">No teachers yet.</p>
            <Link
              href="/dashboard/institute/teachers/new"
              className="inline-flex min-h-[40px] items-center rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900"
            >
              Add the first teacher
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-cream-200">
            {teachers.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-arabic-soft font-display text-sm font-bold text-arabic">
                  {t.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-night-900">
                    {t.name}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {t.user?.email ?? t.phone}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm text-ink-soft sm:block">
                  {t.education}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
