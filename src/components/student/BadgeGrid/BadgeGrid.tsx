import {
  Flame,
  Star,
  Trophy,
  BookOpen,
  Moon,
  Sparkles,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Badge } from "@/lib/dummy/student";

const icons: Record<Badge["icon"], LucideIcon> = {
  flame: Flame,
  star: Star,
  trophy: Trophy,
  book: BookOpen,
  moon: Moon,
  sparkles: Sparkles,
};

/**
 * Badges. The *unearned* ones matter as much as the earned ones — seeing a
 * locked "Perfect score" badge is what makes a child want to retake the quiz.
 */
export function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {badges.map((b) => {
        const Icon = icons[b.icon];
        return (
          <li key={b.id} className="flex flex-col items-center text-center">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border-2 transition-transform",
                b.earned
                  ? "border-gold-500 bg-gold-500 text-night-900 hover:scale-105"
                  : "border-cream-200 bg-cream-50 text-cream-200",
              )}
              style={
                b.earned
                  ? { filter: "drop-shadow(0 0 14px rgba(245,184,51,0.45))" }
                  : undefined
              }
              title={b.description}
            >
              {b.earned ? (
                <Icon className="h-7 w-7" aria-hidden />
              ) : (
                <Lock className="h-5 w-5" aria-hidden />
              )}
            </div>
            <p
              className={cn(
                "mt-2 text-xs font-semibold leading-tight",
                b.earned ? "text-night-900" : "text-ink-soft/60",
              )}
            >
              {b.title}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
