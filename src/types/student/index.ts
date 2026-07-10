import type { Gender } from "@/types/shared";

export interface Student {
  id: string;
  studentCode: string;
  instituteId: string;
  teacherId: string;
  parentId: string | null;
  name: string;
  class: string;
  dob: string;
  gender: Gender;
  allergies: string | null;
  photoConsent: boolean;
  isActive: boolean;
}

export interface CreateStudentInput {
  name: string;
  class: string;
  dob: string;
  gender: Gender;
  allergies?: string;
  photoConsent: boolean;
  teacherId: string;
  parentId?: string;
}
