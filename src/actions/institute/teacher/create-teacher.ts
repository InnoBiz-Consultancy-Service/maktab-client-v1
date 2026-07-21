"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { registerTeacherSchema } from "@/lib/utils/validation";
import type { Teacher } from "@/types/teacher";

/**
 * State returned by the create-teacher form action. Designed for use with
 * React's `useActionState` so the form can show:
 *  - `fieldErrors` — inline, per-field messages from zod
 *  - `formError`   — a single top-level message (e.g. duplicate email from API)
 *  - `success`     — the created teacher, so the UI can confirm and reset
 */
export interface CreateTeacherState {
  success: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<string, string>>;
  createdTeacher?: Teacher;
  values?: Record<string, string>;
}

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

export async function createTeacherAction(
  _prev: CreateTeacherState,
  formData: FormData,
): Promise<CreateTeacherState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    gender: String(formData.get("gender") ?? ""),
    education: String(formData.get("education") ?? "").trim(),
    jobTitle: String(formData.get("jobTitle") ?? "").trim(),
    startDate: String(formData.get("startDate") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
  };

  const parsed = registerTeacherSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      success: false,
      fieldErrors,
      formError: "Please fix the highlighted fields.",
      values,
    };
  }

  console.log("parsed.data", parsed.data)

  // instituteId is NOT sent — backend derives it from the logged-in token.
  const result = await universalApi<unknown>({
    endpoint: "/teachers",
    method: "POST",
    data: parsed.data,
    requireAuth: true,
  });

  if (!result.success) {
    const msg = result.message ?? "Could not create the teacher.";
    const lower = msg.toLowerCase();
    const fieldErrors: Record<string, string> = {};
    if (lower.includes("email")) fieldErrors.email = "This email is already in use.";
    if (lower.includes("phone")) fieldErrors.phone = "This phone number is already in use.";

    return {
      success: false,
      formError: Object.keys(fieldErrors).length ? "Please fix the highlighted fields." : msg,
      fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
      values,
    };
  }

  const createdTeacher = unwrap<Teacher>(result.data);
  revalidatePath("/dashboard/institute");
  return { success: true, createdTeacher };
}