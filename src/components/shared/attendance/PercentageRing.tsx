import { cn } from "@/lib/utils/cn";

interface PercentageRingProps {
  /** 0–100 */
  value: number;
  /** Diameter in pixels. Default 56. */
  size?: number;
  /** Stroke width. Default 5. */
  stroke?: number;
  className?: string;
}

/**
 * SVG ring that fills up to a percentage.
 * Color shifts: ≥85 green, ≥60 amber, below red.
 */
export function PercentageRing({
  value,
  size = 56,
  stroke = 5,
  className,
}: PercentageRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 85 ? "text-success" : clamped >= 60 ? "text-warn" : "text-error";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-cream-200"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(color, "transition-[stroke-dashoffset] duration-500")}
        />
      </svg>
      <span
        className="absolute text-xs font-bold text-night-900"
        aria-label={`${Math.round(clamped)}%`}
      >
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
