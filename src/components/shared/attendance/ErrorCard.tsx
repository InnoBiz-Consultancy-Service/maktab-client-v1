"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui";

interface ErrorCardProps {
  title?: string;
  message: string;
  /** Show retry button. Default true. */
  retryable?: boolean;
}

/**
 * Friendly error card with optional retry.
 * Used when a server action fails on initial page load.
 */
export function ErrorCard({
  title = "Something went wrong",
  message,
  retryable = true,
}: ErrorCardProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/15">
        <AlertTriangle className="h-6 w-6 text-error" aria-hidden />
      </div>
      <div>
        <p className="font-display text-lg font-bold text-night-900">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">{message}</p>
      </div>
      {retryable && (
        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gold-500 px-6 font-display text-sm font-semibold text-night-900 shadow-soft transition-all active:scale-95 hover:scale-[1.02]"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Try again
        </button>
      )}
    </Card>
  );
}
