import { User, Hash } from "lucide-react";
import { getSession } from "@/lib/api/cookies";
import { getStudentOverviewAction } from "@/actions/student/overview";
import { Card } from "@/components/ui";

export default async function StudentSettingsPage() {
  const session = await getSession();
  const res = await getStudentOverviewAction();
  const profile = res.ok ? res.data.profile : null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-night-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Your account.</p>
      </header>

      <Card>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-quran-soft font-display text-xl font-bold text-quran">
            {(profile?.name ?? session?.label ?? "S").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold text-night-900">
              {profile?.name ?? session?.label ?? "Student"}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <Hash className="h-3.5 w-3.5" aria-hidden />
              {profile?.studentCode ?? "—"}
            </p>
          </div>
        </div>

        <p className="mt-5 border-t border-cream-200 pt-4 text-sm text-ink-soft">
          Your student code is how you sign in. Keep it safe — if you forget it,
          ask your teacher or parent.
        </p>
      </Card>

      <Card className="mt-4">
        <div className="flex items-start gap-3">
          <User className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" aria-hidden />
          <div>
            <p className="font-semibold text-night-900">Need help?</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Your teacher can help with anything about your lessons.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
