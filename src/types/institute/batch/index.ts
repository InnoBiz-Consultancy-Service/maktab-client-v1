/** Teacher as nested inside a batch response. */
export interface BatchTeacher {
  id: string;
  name: string;
  phone: string;
  user?: { email: string | null } | null;
}

/** Student as nested inside a batch response. */
export interface BatchStudent {
  id: string;
  name: string;
  studentCode: string;
  class: string;
}

/** Shape returned by every /batches endpoint. */
export interface Batch {
  id: string;
  instituteId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teachers: BatchTeacher[];
  students: BatchStudent[];
}
