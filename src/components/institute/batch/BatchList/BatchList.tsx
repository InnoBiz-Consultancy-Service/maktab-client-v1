"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Layers,
  Search,
  Loader2,
  Inbox,
  GraduationCap,
  Baby,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui";
import { getBatchesAction } from "@/actions/institute/batch/get-batches";
import type { Batch } from "@/types/institute/batch";

export function BatchList({ initialBatches }: { initialBatches: Batch[] }) {
  const [term, setTerm] = useState("");
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    // Skip the debounce on mount — we already have server-rendered data.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      startTransition(async () => {
        const res = await getBatchesAction(term);
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        setBatches(res.data);
      });
    }, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [term]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft"
          aria-hidden
        />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search batches by name…"
          autoComplete="off"
          className="min-h-[44px] w-full rounded-sm border border-cream-200 bg-cream-50 py-2.5 pl-11 pr-10 text-[15px] text-night-900 outline-none transition-colors placeholder:text-ink-soft/60 focus-visible:outline-2 focus-visible:outline-gold-500"
        />
        {pending && (
          <Loader2
            className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold-500"
            aria-hidden
          />
        )}
      </div>

      <Card className="p-0">
        {batches.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <Inbox className="h-8 w-8 text-cream-200" aria-hidden />
            <p className="text-sm text-ink-soft">
              {term ? `No batches match “${term}”.` : "No batches yet."}
            </p>
            {!term && (
              <Link
                href="/dashboard/institute/batches/new"
                className="inline-flex min-h-[40px] items-center rounded-full bg-gold-500 px-5 text-sm font-semibold text-night-900"
              >
                Create the first batch
              </Link>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-cream-200">
            {batches.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/dashboard/institute/batches/${b.id}`}
                  className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-cream-100"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-600">
                    <Layers className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-night-900">
                      {b.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-3 truncate text-sm text-ink-soft">
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                        {b.teachers.length}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Baby className="h-3.5 w-3.5" aria-hidden />
                        {b.students.length}
                      </span>
                    </p>
                  </div>
                  <span
                    className={
                      b.isActive
                        ? "shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success"
                        : "shrink-0 rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-ink-soft"
                    }
                  >
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
