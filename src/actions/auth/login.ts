"use server";

import { redirect } from "next/navigation";
import { universalApi } from "@/actions/universal-api";
import { setAuthCookies, clearAuthCookies } from "@/lib/api/cookies";
import {
  loginSchema,
  studentLoginSchema,
  registerParentSchema,
} from "@/lib/utils/validation";
import type { Role, ActionResult } from "@/types/shared";
import type {
  Session,
  UserLoginResponse,
  StudentLoginResponse,
} from "@/types/auth";

// Order matters: most common role first, rarest last.
const loginAttempts: Array<{
  role: Exclude<Role, "STUDENT">;
  endpoint: string;
}> = [
  { role: "PARENT", endpoint: "/auth/login/parent" },
  { role: "TEACHER", endpoint: "/auth/login/teacher" },
  { role: "INSTITUTE", endpoint: "/auth/login/institute" },
  { role: "ADMIN", endpoint: "/auth/login/admin" },
];

/**
 * universalApi puts the raw parsed JSON into `result.data`. The useful payload
 * is either that object directly ({ accessToken, user, ... }) or nested one
 * level under a { success, message, data } envelope. This unwraps both.
 */
function unwrap<T>(raw: unknown): T {
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    (raw as { data?: unknown }).data &&
    typeof (raw as { data?: unknown }).data === "object"
  ) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

/**
 * Unified login. The user just gives email/phone + password — they don't pick
 * a role. We try each role's endpoint in order until one succeeds.
 *
 *  - A 401 from an endpoint means "not this role" → try the next one.
 *  - A 429 (rate limit) or network error is a real problem → stop and report it,
 *    so the user isn't told "wrong credentials" when the real issue is different.
 *  - If every endpoint returns 401 → the credentials are genuinely wrong.
 */
export async function loginAction(raw: {
  email?: string;
  phone?: string;
  password: string;
}): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    password: raw.password,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check your details",
    };
  }

  const body = {
    password: parsed.data.password,
    ...(parsed.data.email ? { email: parsed.data.email } : {}),
    ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
  };

  for (const attempt of loginAttempts) {
    const result = await universalApi<unknown>({
      endpoint: attempt.endpoint,
      method: "POST",
      data: body,
      requireAuth: false,
    });

    // Success — this is the user's role. Set cookies and finish.
    if (result.success) {
      const payload = unwrap<UserLoginResponse>(result.data);
      if (!payload?.accessToken || !payload?.user) {
        return { ok: false, error: "Unexpected response from server." };
      }
      const session: Session = {
        kind: "user",
        id: payload.user.id,
        role: payload.user.role as Exclude<Role, "STUDENT">,
        label:
          payload.user.email ??
          payload.user.phone ??
          attempt.role.toLowerCase(),
      };
      await setAuthCookies(
        {
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        },
        session,
      );
      return { ok: true, data: undefined };
    }

    // Rate limited — stop immediately, don't burn the remaining endpoints.
    if (result.retryAfter !== undefined) {
      return {
        ok: false,
        error:
          result.message ?? "Too many attempts. Please wait and try again.",
      };
    }

    // A 401/unauthorized just means "not this role" → keep trying the next one.
    if (result.unauthorized) {
      continue;
    }

    // Any other failure (network, 500, etc.) is a real error → stop and report.
    return { ok: false, error: result.message ?? "Could not sign in." };
  }

  // Every endpoint said 401 — the credentials really are wrong.
  return { ok: false, error: "Wrong email or password." };
}

/** Login for students (studentCode only) — separate, unchanged. */
export async function loginStudentAction(raw: {
  studentCode: string;
}): Promise<ActionResult> {
  const parsed = studentLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Enter your code",
    };
  }

  const result = await universalApi<unknown>({
    endpoint: "/auth/login/student",
    method: "POST",
    data: parsed.data,
    requireAuth: false,
  });

  if (!result.success) {
    return { ok: false, error: result.message ?? "Could not sign in." };
  }

  const payload = unwrap<StudentLoginResponse>(result.data);
  if (!payload?.accessToken || !payload?.student) {
    return { ok: false, error: "Unexpected response from server." };
  }

  const session: Session = {
    kind: "student",
    id: payload.student.id,
    role: "STUDENT",
    label: payload.student.name,
  };
  await setAuthCookies(
    { accessToken: payload.accessToken, refreshToken: payload.refreshToken },
    session,
  );
  return { ok: true, data: undefined };
}

/** Parent self-registration. No tokens returned — they log in afterwards. */
export async function registerParentAction(
  raw: unknown,
): Promise<ActionResult> {
  const parsed = registerParentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check your details",
    };
  }

  const result = await universalApi({
    endpoint: "/auth/register/parent",
    method: "POST",
    data: parsed.data,
    requireAuth: false,
  });

  if (!result.success) {
    return { ok: false, error: result.message ?? "Could not register." };
  }
  return { ok: true, data: undefined };
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/login");
}
