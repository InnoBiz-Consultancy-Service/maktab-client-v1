import { Flame } from "lucide-react";

/**
 * The streak counter — the single most motivating thing on the page.
 * A child protecting a 6-day streak comes back on day 7.
 */
export function StreakFlame({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-gold-500/20 px-3 py-1.5">
      <Flame
        className="h-[18px] w-[18px] text-gold-600"
        aria-hidden
        style={{ filter: "drop-shadow(0 0 6px rgba(245,184,51,0.6))" }}
      />
      <span className="font-display text-sm font-bold text-night-900">
        {days}
        <span className="ml-1 font-medium text-ink-soft">day streak</span>
      </span>
    </div>
  );
}
