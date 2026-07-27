"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import { Input, Skeleton } from "@/components/ui";
import { StudentLessonCard } from "./StudentLessonCard";
import { getStudentLessonsAction } from "@/actions/student/lesson/get-lessons";
import type { Paginated, StudentLessonListItem } from "@/types/lesson";

export function StudentLessonList({
  initial,
}: {
  initial: Paginated<StudentLessonListItem>;
}) {
  const [data, setData] = useState(initial);
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
        const res = await getStudentLessonsAction({
          search: search || undefined,
          page,
        });
        if (res.ok) setData(res.data);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [search, page]);

  const { items, meta } = data;

  const continueLesson =
    page === 1 && !search
      ? items.find((l) => !l.isLocked && !l.isCompleted)
      : undefined;

  return (
    <div>
      {continueLesson && (
        <Link
          href={`/dashboard/student/lessons/${continueLesson.id}`}
          className="mb-5 flex items-center gap-4 rounded-lg bg-night-900 p-4 text-cream-50 shadow-soft transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500 text-night-900">
            <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gold-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Continue learning
            </p>
            <p className="truncate font-display text-lg font-bold">
              {continueLesson.title}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
        </Link>
      )}

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search lessons"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          icon={<Search className="h-4 w-4" aria-hidden />}
          aria-label="Search lessons"
        />
      </div>

      {pending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-cream-200 bg-cream-50 px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-night-900">
            {search ? "No lessons match your search" : "No lessons yet"}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {search
              ? "Try a different word."
              : "Your teacher hasn't published any lessons yet. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((lesson) => (
            <StudentLessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || pending}
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
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
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-cream-200 px-4 text-sm font-semibold text-night-900 transition-colors hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
