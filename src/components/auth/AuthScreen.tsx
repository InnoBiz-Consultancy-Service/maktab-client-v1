import { StarField } from "@/components/shared/StarField";
import { LanternMark } from "@/components/shared/LanternMark";

/**
 * Night-sky auth backdrop — matches the student & parent portals.
 * Deep midnight-teal field, twinkling stars, and a glowing lantern crest.
 * Works edge-to-edge on mobile and centers on desktop.
 */
export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-night-900 px-6 py-10">
      <StarField className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        {/* Glowing lantern crest */}
        <div className="animate-glow flex h-20 w-20 items-center justify-center rounded-(--radius-xl) bg-linear-to-br from-gold-300 to-gold-500 text-night-900">
          <LanternMark width={44} height={44} />
        </div>

        <h1 className="mt-6 text-center font-display text-3xl font-bold text-cream-50">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-center text-cream-100/70">{subtitle}</p>
        )}

        <div className="mt-8 w-full">{children}</div>
      </div>
    </main>
  );
}
