import { Card } from "@/components/ui";
import { requireSession } from "@/lib/utils/session";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <div>
      <h1 className="mb-2 text-2xl text-night-900 md:text-3xl">
        Welcome back, {session.label}.
      </h1>
      <p className="mb-8 text-ink-soft">
        You&rsquo;re signed in as{" "}
        <span className="font-medium capitalize text-night-900">
          {session.role.toLowerCase()}
        </span>
        .
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="bg-quran-soft">
          <h2 className="text-lg text-quran">Foundation is ready</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Server actions, httpOnly-cookie auth, token refresh and server-side
            route protection all work end to end.
          </p>
        </Card>
        <Card className="bg-arabic-soft">
          <h2 className="text-lg text-arabic">What&rsquo;s next</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Role dashboards — institute, teacher, parent and student — build on
            top of this in the coming days.
          </p>
        </Card>
      </div>
    </div>
  );
}
