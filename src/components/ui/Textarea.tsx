import { cn } from "@/lib/utils/cn";
import {
  forwardRef,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  /** Optional leading icon (e.g. a lucide icon element). */
  icon?: ReactNode;
}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(
  { label, error, icon, className, id, ...props },
  ref,
) {
  const textareaId =
    id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={textareaId}
        className="text-sm font-medium text-night-900"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-4 text-ink-soft">
            {icon}
          </span>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "min-h-[120px] w-full rounded-sm border bg-cream-50 px-4 py-2.5 text-[15px] text-night-900 resize-y",
            "placeholder:text-ink-soft/60 outline-none transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-gold-500",
            icon ? "pl-11" : "",
            error
              ? "border-error focus-visible:outline-error"
              : "border-cream-200 hover:border-cream-200/80",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
      </div>

      {error && (
        <p
          id={`${textareaId}-error`}
          role="alert"
          className="text-sm text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
});