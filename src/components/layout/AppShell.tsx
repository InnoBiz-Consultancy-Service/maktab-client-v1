import { AppHeader } from "@/components/layout/AppHeader";
import type { Session } from "@/types/auth";

export function AppShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <AppHeader session={session} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}
