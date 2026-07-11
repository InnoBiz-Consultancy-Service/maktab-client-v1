"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface PickerItem {
  id: string;
  /** Main line, e.g. the person's name. */
  title: string;
  /** Secondary line, e.g. "email · phone". */
  subtitle?: string;
}

interface SearchPickerProps {
  label: string;
  placeholder: string;
  /** Runs the search. Debounced by this component. */
  onSearch: (term: string) => Promise<PickerItem[]>;
  selected: PickerItem | null;
  onSelect: (item: PickerItem | null) => void;
  /** Shown under the list when a search returns nothing. */
  emptyAction?: React.ReactNode;
  error?: string;
}

/**
 * A debounced search-and-select field. Used to pick a teacher or an existing
 * parent. Fetches on typing (300ms debounce), shows results, and lets the user
 * clear the selection to search again.
 */
export function SearchPicker({
  label,
  placeholder,
  onSearch,
  selected,
  onSelect,
  emptyAction,
  error,
}: SearchPickerProps) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<PickerItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search — runs 300ms after the user stops typing.
  useEffect(() => {
    if (selected) return; // don't search while something is chosen
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
  }, [term, selected, onSearch]);

  // ---- Something is already selected: show it as a chip ----
  if (selected) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-night-900">{label}</span>
        <div className="flex items-center justify-between gap-3 rounded-md border border-success/40 bg-success/10 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-night-900">
              {selected.title}
            </p>
            {selected.subtitle && (
              <p className="truncate text-sm text-ink-soft">
                {selected.subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              setTerm("");
              setSearched(false);
            }}
            className="shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-cream-200 hover:text-night-900"
            aria-label={`Change ${label.toLowerCase()}`}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  // ---- Nothing selected yet: search box + results ----
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={`picker-${label}`}
        className="text-sm font-medium text-night-900"
      >
        {label}
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft"
          aria-hidden
        />
        <input
          id={`picker-${label}`}
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

      {/* Results */}
      {results.length > 0 && (
        <ul className="mt-1 max-h-64 divide-y divide-cream-200 overflow-y-auto rounded-md border border-cream-200 bg-cream-50">
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-cream-100"
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
                <Check className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Nothing found — offer the fallback action (e.g. "add a new parent") */}
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
