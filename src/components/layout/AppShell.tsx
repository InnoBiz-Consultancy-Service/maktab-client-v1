import type { Session } from "@/types/auth";
import { navByRole } from "./nav-item";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { BottomNav } from "./BottomNav";


export function AppShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const { items, indexHref } = navByRole[session.role];

  return (
    <div className="flex min-h-dvh bg-cream-100">
      <Sidebar session={session} items={items} indexHref={indexHref} />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader session={session} />
        <main className="flex-1 px-4 pt-6 pb-24 md:px-8 lg:px-10 lg:pt-10 lg:pb-10">
          {children}
        </main>
      </div>

      <BottomNav items={items} indexHref={indexHref} />
    </div>
  );
}
