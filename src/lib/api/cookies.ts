import "server-only";
import { cookies } from "next/headers";
import type { AuthTokens, Session } from "@/types/auth";

// Cookie names match what universalApi reads ("accessToken").
const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const SESSION = "maktab_session";

const secure = process.env.NODE_ENV === "production";
const base = { httpOnly: true, secure, sameSite: "lax" as const, path: "/" };

export async function setAuthCookies(tokens: AuthTokens, session: Session) {
  const store = await cookies();
  store.set(ACCESS, tokens.accessToken, { ...base, maxAge: 60 * 60 });
  store.set(REFRESH, tokens.refreshToken, {
    ...base,
    maxAge: 60 * 60 * 24 * 7,
  });
  store.set(SESSION, JSON.stringify(session), {
    ...base,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function setTokenCookies(tokens: AuthTokens) {
  const store = await cookies();
  store.set(ACCESS, tokens.accessToken, { ...base, maxAge: 60 * 60 });
  store.set(REFRESH, tokens.refreshToken, {
    ...base,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH)?.value ?? null;
}

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS);
  store.delete(REFRESH);
  store.delete(SESSION);
}
