"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PickerItem } from "@/components/shared/SearchPicker";

export type { PickerItem };

interface MultiSearchPickerProps {
  label: string;
  placeholder: string;
  /** Runs the search. Debounced by this component. */
  onSearch: (term: string) => Promise<PickerItem[]>;
  selected: PickerItem[];
  onChange: (items: PickerItem[]) => void;
  /** Shown under the list when a search returns nothing. */
  emptyAction?: React.ReactNode;
  error?: string;
}

/**
 * A debounced search field that lets the user pick several items at once —
 * used to assign multiple teachers or students to a batch in one go.
 * Selected items show as removable chips above the search box; picking a
 * result toggles it in/out of the selection without clearing the search.
 */
export function MultiSearchPicker({
  label,
  placeholder,
  onSearch,
  selected,
  onChange,
  emptyAction,
  error,
}: MultiSearchPickerProps) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<PickerItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search — runs 300ms after the user stops typing.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      startTransition(async () => {
        const items = await onSearch(term);
        setResults(items);
        setSearched(true);
      });
    }, 300);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // onSearch is stable in practice (defined in the parent), term drives this
  }, [term, onSearch]);

  const selectedIds = new Set(selected.map((s) => s.id));

  function toggle(item: PickerItem) {
    if (selectedIds.has(item.id)) {
      onChange(selected.filter((s) => s.id !== item.id));
    } else {
      onChange([...selected, item]);
    }
  }

  function remove(id: string) {
    onChange(selected.filter((s) => s.id !== id));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={`multi-picker-${label}`}
        className="text-sm font-medium text-night-900"
      >
        {label}
        {selected.length > 0 && (
          <span className="ml-1.5 font-normal text-ink-soft">
            · {selected.length} selected
          </span>
        )}
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <li key={item.id}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 py-1.5 pl-3 pr-1.5 text-sm text-night-900">
                <span className="max-w-[10rem] truncate">{item.title}</span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-full p-0.5 text-ink-soft transition-colors hover:bg-cream-200 hover:text-night-900"
                  aria-label={`Remove ${item.title}`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Search box */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft"
          aria-hidden
        />
        <input
          id={`multi-picker-${label}`}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "min-h-[44px] w-full rounded-sm border bg-cream-50 py-2.5 pl-11 pr-10 text-[15px] text-night-900",
            "placeholder:text-ink-soft/60 outline-none transition-colors",
            "focus-visible:outline-2 focus-visible:outline-gold-500",
            error ? "border-error" : "border-cream-200",
          )}
          aria-invalid={Boolean(error)}
        />
        {pending && (
          <Loader2
            className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold-500"
            aria-hidden
          />
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      {/* Results — click toggles selection, so already-picked items show a check */}
      {results.length > 0 && (
        <ul className="mt-1 max-h-64 divide-y divide-cream-200 overflow-y-auto rounded-md border border-cream-200 bg-cream-50">
          {results.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-cream-100",
                    isSelected && "bg-success/10",
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-night-900">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="block truncate text-sm text-ink-soft">
                        {item.subtitle}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-success bg-success text-cream-50"
                        : "border-cream-200 text-transparent",
                    )}
                    aria-hidden
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Nothing found — offer the fallback action (e.g. "add a new teacher") */}
      {searched && !pending && results.length === 0 && (
        <div className="mt-1 rounded-md border border-cream-200 bg-cream-50 px-4 py-4 text-center">
          <p className="text-sm text-ink-soft">
            {term ? `No match for “${term}”.` : "No results yet."}
          </p>
          {emptyAction && <div className="mt-3">{emptyAction}</div>}
        </div>
      )}
    </div>
  );
}
