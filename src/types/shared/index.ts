/** Shared primitives used across every role. */

export type Role = "ADMIN" | "INSTITUTE" | "TEACHER" | "PARENT" | "STUDENT";
export type Gender = "MALE" | "FEMALE";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

/** The backend's uniform response envelope. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Result shape returned by every server action, so the UI never sees a throw. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
