import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "night" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** When true the button fills its container width. */
  block?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold " +
  "rounded-full transition-all duration-150 select-none " +
  "active:scale-95 hover:scale-[1.02] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 " +
  "disabled:opacity-60 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  // min-height keeps touch targets >= 44px on mobile
  sm: "min-h-[38px] px-4 text-sm",
  md: "min-h-[44px] px-6 text-[15px]",
  lg: "min-h-[52px] px-8 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-gold-500 text-night-900 shadow-soft hover:shadow-[0_0_28px_rgba(245,184,51,0.4)]",
  night: "bg-night-900 text-cream-50 shadow-soft hover:bg-night-800",
  ghost: "bg-transparent text-night-900 border border-cream-200 hover:bg-cream-50",
  danger: "bg-error text-cream-50 shadow-soft hover:brightness-105",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  block = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        sizes[size],
        variants[variant],
        block && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
