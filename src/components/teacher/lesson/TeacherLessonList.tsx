"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { Input, Select, Skeleton } from "@/components/ui";
import { TeacherLessonCard } from "./TeacherLessonCard";
import { getTeacherLessonsAction } from "@/actions/teacher/lesson/get-lessons";
import type {
  BatchRef,
  LessonStatus,
  Paginated,
  TeacherLessonListItem,
} from "@/types/lesson";

interface Props {
  initial: Paginated<TeacherLessonListItem>;
  batches: Pick<BatchRef, "id" | "name">[];
}

type StatusFilter = "" | LessonStatus;

export function TeacherLessonList({ initial, batches }: Props) {
  const [data, setData] = useState(initial);
  const [batchId, setBatchId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      startTransition(async () => {
        const res = await getTeacherLessonsAction({
          batchId: batchId || undefined,
          status: status || undefined,
          search: search || undefined,
          page,
        });
        if (res.ok) setData(res.data);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [batchId, status, search, page]);

  function onFilter<T>(setter: (v: T) => void) {
    return (v: T) => {
      setPage(1);
      setter(v);
    };
  }

  const { items, meta } = data;

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px]">
        <Input
          placeholder="Search lessons"
          value={search}
          onChange={(e) => onFilter(setSearch)(e.target.value)}
          icon={<Search className="h-4 w-4" aria-hidden />}
          aria-label="Search lessons"
        />
        <Select
          value={batchId}
          onChange={(e) => onFilter(setBatchId)(e.target.value)}
          aria-label="Filter by batch"
        >
          <option value="">All batches</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(e) => onFilter(setStatus)(e.target.value as StatusFilter)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </Select>
      </div>

      {pending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState hasFilters={Boolean(batchId || status || search)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((lesson) => (
            <TeacherLessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || pending}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Prev
          </button>
          <span className="text-sm font-medium text-ink-soft">
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages || pending}
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-cream-200 bg-cream-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-300/40 text-gold-600">
        <BookOpen className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="mb-1 font-display text-lg font-bold text-night-900">
        {hasFilters ? "No lessons match those filters" : "No lessons yet"}
      </h3>
      <p className="mb-5 max-w-sm text-sm text-ink-soft">
        {hasFilters
          ? "Try clearing the search or choosing a different batch."
          : "Create your first lesson with a video, a quiz, or both."}
      </p>
      {!hasFilters && (
        <Link
          href="/dashboard/teacher/create-lesson"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gold-500 px-6 font-display text-sm font-semibold text-night-900 shadow-soft transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Create a lesson
        </Link>
      )}
    </div>
  );
}
