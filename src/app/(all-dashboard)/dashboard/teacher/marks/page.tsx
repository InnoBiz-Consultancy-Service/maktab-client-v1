import { ClipboardList, Plus } from "lucide-react";
import { getTeacherOverviewAction } from "@/actions/teacher/overview";
import { Card } from "@/components/ui";
import { PreviewBanner } from "@/components/teacher/PreviewBanner/PreviewBanner";

const kindTone: Record<string, string> = {
  quiz: "bg-arabic-soft text-arabic",
  assignment: "bg-quran-soft text-quran",
  exam: "bg-gold-500/20 text-gold-600",
};

export default async function TeacherMarksPage() {
  const res = await getTeacherOverviewAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const { recentMarks, exams, counts } = res.data;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-night-900">Marks</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Class average {counts.classAverage}%
          </p>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex min-h-[44px] shrink-0 cursor-not-allowed items-center gap-1.5 rounded-full bg-gold-500/50 px-5 font-display text-sm font-semibold text-night-900/60"
          title="Available once the backend is ready"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Add marks</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <PreviewBanner what="Marks and exams" />

      {/* Recorded marks */}
      <section aria-label="Recorded marks" className="mb-6">
        <h2 className="mb-3 font-display text-lg font-bold text-night-900">
          Recorded marks
        </h2>
        <Card className="p-0">
          <ul className="divide-y divide-cream-200">
            {recentMarks.map((m) => {
              const pct = Math.round((m.score / m.outOf) * 100);
              return (
                <li key={m.id} className="flex items-center gap-3 px-5 py-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${kindTone[m.kind]}`}
                  >
                    <ClipboardList className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-night-900">
                      {m.studentName}
                    </p>
                    <p className="truncate text-sm text-ink-soft">
                      {m.title} · {m.date}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`font-display text-lg font-bold ${
                        pct >= 70
                          ? "text-success"
                          : pct >= 50
                            ? "text-warn"
                            : "text-error"
                      }`}
                    >
                      {m.score}
                      <span className="text-sm font-medium text-ink-soft">
                        /{m.outOf}
                      </span>
                    </p>
                    <p className="text-xs text-ink-soft">{pct}%</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      {/* Exams */}
      <section aria-label="Exams">
        <h2 className="mb-3 font-display text-lg font-bold text-night-900">
          Exams
        </h2>
        <Card className="p-0">
          <ul className="divide-y divide-cream-200">
            {exams.map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-night-900">
                    {e.title}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {e.class} · {e.studentCount} students · {e.date}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    e.status === "scheduled"
                      ? "bg-gold-500/20 text-gold-600"
                      : "bg-success/15 text-success"
                  }`}
                >
                  {e.status === "scheduled" ? "Scheduled" : "Completed"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
