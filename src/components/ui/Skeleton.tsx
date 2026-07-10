import { cn } from "@/lib/utils/cn";

/** Shimmer placeholder for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer rounded-md", className)} aria-hidden />;
}
