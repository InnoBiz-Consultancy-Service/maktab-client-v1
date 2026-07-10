import { LanternMark } from "@/components/shared/LanternMark";
import { SignOutButton } from "@/components/layout/SignOutButton";
import type { Session } from "@/types/auth";

/**
 * Top app bar. Night background, cream text. On mobile it stays compact and
 * sticky so the app-like feel holds; the role/label collapses on small screens.
 */
export function AppHeader({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-20 bg-night-900 text-cream-50 shadow-soft">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-10 md:py-4">
        <div className="flex items-center gap-2">
          <LanternMark className="text-gold-400 animate-float" />
          <span className="font-display text-lg font-bold md:text-xl">Maktab</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-cream-100/70 sm:inline">
            <span className="capitalize">{session.role.toLowerCase()}</span>
            {" · "}
            {session.label}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
