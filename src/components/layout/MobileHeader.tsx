import { LanternMark } from "@/components/shared/LanternMark";
import { SignOutButton } from "@/components/layout/SignOutButton";
import type { Session } from "@/types/auth";

/**
 * Compact top bar for phones. Sticky and night-coloured so it blends into the
 * status bar (themeColor is night-900 in the root layout) — that's what sells
 * the "native app" feel when scrolling.
 */
export function MobileHeader({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-20 bg-night-900 text-cream-50 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <LanternMark className="animate-float text-gold-400" />
          <span className="font-display text-lg font-bold">Maktab</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-cream-100/70 sm:inline">
            {session.label}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
