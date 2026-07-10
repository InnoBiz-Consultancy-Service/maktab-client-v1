import { requireSession } from "@/lib/utils/session";
import { AppShell } from "@/components/layout/AppShell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  return <AppShell session={session}>{children}</AppShell>;
}
