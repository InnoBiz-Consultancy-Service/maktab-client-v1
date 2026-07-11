export interface ParentChild {
  id: string;
  name: string;
  class: string;
  studentCode: string;
  isActive: boolean;
}

/** Parent shape returned by GET /parents?search= */
export interface ParentSearchResult {
  id: string;
  name: string;
  phone: string;
  relation: string | null;
  createdAt: string;
  user: { email: string | null } | null;
  children: ParentChild[];
}
