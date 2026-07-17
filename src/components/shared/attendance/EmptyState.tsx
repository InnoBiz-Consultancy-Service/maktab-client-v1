import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Centered empty state card — use when a list has no items. */
export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 py-14 text-center">
      <Icon className="h-10 w-10 text-cream-200" aria-hidden />
      <div>
        <p className="font-display font-semibold text-night-900">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-ink-soft">{description}</p>
      </div>
    </Card>
  );
}
