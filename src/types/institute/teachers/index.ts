import { Gender } from "@/types/shared";

export interface TeacherSearchResult {
  id: string;
  name: string;
  gender: Gender;
  education: string;
  phone: string;
  address: string;
  createdAt: string;
  user: { email: string | null } | null;
}

