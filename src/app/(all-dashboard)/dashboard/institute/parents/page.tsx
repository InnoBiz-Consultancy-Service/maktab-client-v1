import { Inbox } from "lucide-react";
import { Card } from "@/components/ui";
import { searchParentsAction } from "@/actions/institute/parent/get-parents";

export default async function ParentsPage() {
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

  const parents = res.data;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-night-900">Parents</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {parents.length} linked to your institute
        </p>
      </header>

      <Card className="p-0">
        {parents.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <Inbox className="h-8 w-8 text-cream-200" aria-hidden />
            <p className="text-sm text-ink-soft">
              No parents yet. They appear here once you enrol a student.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-cream-200">
            {parents.map((p) => (
              <li key={p.id} className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-duas-soft font-display text-sm font-bold text-duas">
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-night-900">
                      {p.name}
                    </p>
                    <p className="truncate text-sm text-ink-soft">
                      {[p.user?.email, p.phone].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {p.relation && (
                    <span className="hidden shrink-0 rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium text-ink-soft sm:block">
                      {p.relation}
                    </span>
                  )}
                </div>

                {/* Their children in this institute */}
                {p.children.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5 sm:pl-13">
                    {p.children.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-full bg-quran-soft px-2.5 py-1 text-xs font-medium text-quran"
                      >
                        {c.name} · {c.class}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
