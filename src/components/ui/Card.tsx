import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-cream-50 p-5 shadow-soft sm:p-6",
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}
