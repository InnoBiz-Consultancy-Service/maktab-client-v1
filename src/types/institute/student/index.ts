import { Gender } from "@/types/shared";

/** Parent info nested in a created-student response. */
export interface CreatedStudentParent {
  id: string;
  name: string;
  phone: string;
  relation: string | null;
  user: { email: string | null } | null;
  /** Only present when the parent was created inline (Path 2), dev-mode only. */
  temporaryPassword?: string;
}

/** Shape returned by POST /students */
export interface CreatedStudent {
  id: string;
  studentCode: string;
  instituteId: string;
  teacherId: string;
  parentId: string;
  name: string;
  class: string;
  dob: string;
  gender: Gender;
  allergies: string | null;
  photoConsent: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parent: CreatedStudentParent;
}
