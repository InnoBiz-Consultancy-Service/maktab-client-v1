import { cn } from "@/lib/utils/cn";
import { forwardRef, type SelectHTMLAttributes, type ReactNode, useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, className, id, children, ...props }, ref) {
    const generatedId = useId();
    const selectId =
      id ?? props.name ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : generatedId);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-night-900"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "min-h-11 w-full rounded-sm border bg-cream-50 px-4 py-2.5 text-[15px] text-night-900",
            "outline-none transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold-500",
            error
              ? "border-error focus-visible:outline-error"
              : "border-cream-200 hover:border-cream-200/80",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            role="alert"
            className="text-sm text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
