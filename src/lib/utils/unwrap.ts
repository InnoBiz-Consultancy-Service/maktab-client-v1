/** Normalizes a server response into an array, whether the API returned a bare array or `{ data: [...] }`. */
export function unwrapList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    Array.isArray((raw as { data?: unknown }).data)
  ) {
    return (raw as { data: T[] }).data;
  }
  return [];
}

/** Pulls the payload object out of the `{ success, message, data }` envelope. */
export function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const EMPTY_META: PageMeta = { page: 1, limit: 20, total: 0, totalPages: 0 };

/** Reads the `meta` block from an envelope, falling back to safe defaults. */
export function unwrapMeta(raw: unknown): PageMeta {
  if (!raw || typeof raw !== "object") return EMPTY_META;
  const obj = raw as Record<string, any>;
  const candidate = obj.meta ?? obj.data?.meta; // ← nested data.meta
  if (candidate && typeof candidate === "object") {
    return { ...EMPTY_META, ...candidate };
  }
  return EMPTY_META;
}

export function pickArray<T>(raw: unknown, keys: string[] = []): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (!raw || typeof raw !== "object") return [];

  const obj = raw as Record<string, unknown>;
  const inner =
    obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)
      ? (obj.data as Record<string, unknown>)
      : obj;

  if (Array.isArray(obj.data)) return obj.data as T[];
  for (const k of keys) {
    if (Array.isArray(inner[k])) return inner[k] as T[];
  }
  for (const v of Object.values(inner)) {
    if (Array.isArray(v)) return v as T[];
  }
  return [];
}
