"use server";

import { revalidatePath } from "next/cache";
import { universalApi } from "@/actions/universal-api";
import { createStudentSchema } from "@/lib/utils/validation";
import type { ActionResult } from "@/types/shared";
import { CreatedStudent } from "@/types/institute/student";

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

/** What the wizard sends up. Exactly one of parentId / parent must be set. */
export interface CreateStudentPayload {
  name: string;
  class: string;
  dob: string;
  joinDate: string;
  address?: string;
  medicalConditions?: string;
  medications?: string;
  additionalNotes?: string;
  gender: string;
  allergies?: string;
  photoConsent: boolean;
  teacherId: string;
  parentId?: string;
  parent?: {
    name: string;
    email: string;
    phone: string;
    relation: string;
  };
}

/**
 * Create a student. Two paths, per the API docs:
 *   Path 1 — existing parent → send `parentId` only.
 *   Path 2 — new parent      → send `parent` object; the backend creates the
 *                              account and returns a temporaryPassword.
 *
 * `instituteId` is never sent — the backend derives it from the token.
 */
export async function createStudentAction(
  payload: CreateStudentPayload,
): Promise<ActionResult<CreatedStudent>> {
  const parsed = createStudentSchema.safeParse({
    ...payload,
    // zod coerces this to a Date; keep the rest as-is
    dob: payload.dob,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  // Build the body the API expects. Send only the path that applies.
  const body: Record<string, unknown> = {
    name: parsed.data.name,
    class: parsed.data.class,
    dob: parsed.data.dob.toISOString(),
    joinDate: parsed.data.joinDate,
    address: parsed.data.address,
    medicalConditions: parsed.data.medicalConditions,
    medications: parsed.data.medications,
    additionalNotes: parsed.data.additionalNotes,
    gender: parsed.data.gender,
    photoConsent: parsed.data.photoConsent,
    teacherId: parsed.data.teacherId,
  };
  if (parsed.data.allergies) body.allergies = parsed.data.allergies;
  if (parsed.data.parentId) body.parentId = parsed.data.parentId;
  if (parsed.data.parent) body.parent = parsed.data.parent;

  const result = await universalApi<unknown>({
    endpoint: "/students",
    method: "POST",
    data: body,
    requireAuth: true,
  });

  if (!result.success) {
    return {
      ok: false,
      error: result.message ?? "Could not create the student.",
    };
  }

  revalidatePath("/dashboard/institute");
  return { ok: true, data: unwrap<CreatedStudent>(result.data) };
}
