import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  /** Tailwind classes for the icon tile, e.g. "bg-quran-soft text-quran". */
  tone: string;
  /** Optional — makes the whole card a link. */
  href?: string;
  /** Small note under the value, e.g. "3 absent today". */
  note?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
  note,
}: StatCardProps) {
  const body = (
    <Card interactive={Boolean(href)} className="h-full">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${tone}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="font-display text-2xl font-bold text-night-900">
            {value}
          </p>
          <p className="truncate text-sm text-ink-soft">{label}</p>
          {note && (
            <p className="mt-0.5 truncate text-xs text-ink-soft/80">{note}</p>
          )}
        </div>
      </div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}
