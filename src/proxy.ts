import { NextResponse, type NextRequest } from "next/server";

/**
 * Roles the app knows about. The JWT's payload carries one of these.
 */
type Role = "ADMIN" | "INSTITUTE" | "TEACHER" | "PARENT" | "STUDENT";

/**
 * Decode a JWT payload WITHOUT verifying its signature.
 *
 * Middleware runs on the Edge runtime, so we can't use a full JWT library here.
 * We only need to read the `role` claim to decide where to send the user —
 * the real signature check happens on the backend for every API call, so this
 * is safe for routing purposes only.
 */
function readRoleFromToken(token: string): Role | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // base64url -> base64, then decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const data = JSON.parse(json) as { role?: string; exp?: number };

    // reject an expired token
    if (data.exp && Date.now() >= data.exp * 1000) return null;

    const role = data.role?.toUpperCase();
    if (
      role === "ADMIN" ||
      role === "INSTITUTE" ||
      role === "TEACHER" ||
      role === "PARENT" ||
      role === "STUDENT"
    ) {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Routes that don't need a session — login, register, student login, etc.
 */
const PUBLIC_PATHS = ["/login", "/register", "/teacher/change-password"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const role = token ? readRoleFromToken(token) : null;

  // ---- Not signed in ----
  if (!role) {
    // trying to reach a protected page → send to login
    if (!isPublic(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // already on a public page → let them through
    return NextResponse.next();
  }

  // ---- Signed in ----
  const home = `/dashboard/${role.toLowerCase()}`; // e.g. /dashboard/institute

  // If a signed-in user lands on a public/auth page, push them to their dashboard
  if (isPublic(pathname)) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  // Guard the dashboard: a user may only be inside their own role's section.
  // e.g. a PARENT hitting /dashboard/teacher gets bounced to /dashboard/parent
  if (pathname.startsWith("/dashboard")) {
    const allowedPrefix = `/dashboard/${role.toLowerCase()}`;
    const isRoot = pathname === "/dashboard";
    const inOwnSection =
      pathname === allowedPrefix || pathname.startsWith(`${allowedPrefix}/`);

    if (isRoot || !inOwnSection) {
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Which paths the proxy runs on. We skip Next internals, static files and the
 * API so it only guards real pages.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
