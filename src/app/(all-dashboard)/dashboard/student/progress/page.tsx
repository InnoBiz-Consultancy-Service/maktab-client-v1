import { getStudentOverviewAction } from "@/actions/student/overview";
import { StreakFlame } from "@/components/student/animation/StreakFlame";
import { XpRing } from "@/components/student/animation/XpRing";
import { BadgeGrid } from "@/components/student/BadgeGrid/BadgeGrid";
import { Card } from "@/components/ui";
import { subjects, type SubjectKey } from "@/lib/dummy/student";

export default async function ProgressPage() {
  const res = await getStudentOverviewAction();

  if (!res.ok) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="py-10 text-center text-sm text-ink-soft">
          {res.error}
        </Card>
      </div>
    );
  }

  const { profile, rank, lessons, badges, counts } = res.data;

  // Per-subject completion
  const bySubject = (Object.keys(subjects) as SubjectKey[]).map((key) => {
    const all = lessons.filter((l) => l.subject === key);
    const done = all.filter((l) => l.state === "done").length;
    return {
      subject: subjects[key],
      done,
      total: all.length,
      pct: all.length > 0 ? Math.round((done / all.length) * 100) : 0,
    };
  });

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-night-900">
          Your progress
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Keep going — every lesson counts.
        </p>
      </header>

      {/* Rank + XP */}
      <Card className="mb-6">
        <div className="flex items-center gap-5">
          <XpRing progress={rank.progress} xp={profile.xp} size={112} />
          <div className="min-w-0">
            <p className="font-display text-xl font-bold text-night-900">
              {rank.current.title}
            </p>
            {rank.next ? (
              <p className="mt-1 text-sm text-ink-soft">
                {rank.next.minXp - profile.xp} XP to{" "}
                <span className="font-semibold text-night-900">
                  {rank.next.title}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm font-medium text-gold-600">
                Highest rank reached!
              </p>
            )}
            <div className="mt-3">
              <StreakFlame days={profile.streak} />
            </div>
          </div>
        </div>
      </Card>

      {/* Per subject */}
      <section className="mb-6">
        <h2 className="mb-3 font-display text-lg font-bold text-night-900">
          By subject
        </h2>
        <Card>
          <ul className="flex flex-col gap-4">
            {bySubject.map((s) => (
              <li key={s.subject.key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className={`font-semibold ${s.subject.accent}`}>
                    {s.subject.label}
                  </span>
                  <span className="text-ink-soft">
                    {s.done}/{s.total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-cream-200">
                  <div
                    className={`h-full rounded-full transition-all ${s.subject.solid}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Badges */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-night-900">
            Badges
          </h2>
          <span className="text-sm text-ink-soft">
            {counts.badgesEarned} of {badges.length}
          </span>
        </div>
        <Card>
          <BadgeGrid badges={badges} />
        </Card>
      </section>
    </div>
  );
}
