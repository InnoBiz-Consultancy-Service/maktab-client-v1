"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ComplaintPagination } from "@/types/shared/complaint";

interface PaginationControlsProps {
  pagination: ComplaintPagination;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const LIMIT_OPTIONS = [10, 20, 50];

export function PaginationControls({
  pagination,
  onPageChange,
  onLimitChange,
}: PaginationControlsProps) {
  const { page, totalPages, total, limit } = pagination;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      {/* Items count */}
      <p className="text-sm text-ink-soft">
        Showing{" "}
        <span className="font-semibold text-night-900">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-night-900">{total}</span>{" "}
        complaints
      </p>

      <div className="flex items-center gap-3">
        {/* Items per page */}
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="complaint-limit"
              className="text-sm text-ink-soft"
            >
              Per page:
            </label>
            <select
              id="complaint-limit"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-sm border border-cream-200 bg-cream-50 px-2 py-1 text-sm text-night-900 outline-none focus-visible:outline-2 focus-visible:outline-gold-500"
            >
              {LIMIT_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prev / Page indicator / Next */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="h-9 w-9 rounded-full p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-[80px] text-center text-sm font-medium text-night-900">
            {page} / {totalPages || 1}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="h-9 w-9 rounded-full p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
