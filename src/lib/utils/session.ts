import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/api/cookies";
import type { Role, Session } from "@/types/auth";

/** Read the session, or redirect to login. Optionally restrict to roles. */
export async function requireSession(allow?: Role[]): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login/institute");
  if (allow && !allow.includes(session.role)) redirect("/dashboard");
  return session;
}
