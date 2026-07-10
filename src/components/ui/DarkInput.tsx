import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes } from "react";

interface DarkInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Input styled for the dark night-sky auth screens — matches the student and
 * parent portals: midnight-teal field, cream text, gold focus ring.
 */
export const DarkInput = forwardRef<HTMLInputElement, DarkInputProps>(
  function DarkInput({ label, error, className, id, ...props }, ref) {
    const inputId =
      id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <label className="mb-4 block text-sm font-medium text-cream-100/80">
        {label}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "mt-1.5 min-h-12 w-full rounded-(--radius-md) border-2 bg-night-800 px-4 py-3",
            "text-cream-50 placeholder:text-cream-100/40 outline-none transition-colors",
            "focus:border-gold-400 focus-visible:outline-none",
            error ? "border-error" : "border-night-600",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </label>
    );
  },
);
