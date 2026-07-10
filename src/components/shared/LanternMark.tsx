import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

/** Lantern mark — matches the student/parent portal shape. No faces. */
export function LanternMark(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)} aria-hidden>
      <path d="M12 2v2" />
      <path d="M8 5h8l-1 3H9L8 5Z" />
      <rect x="7" y="8" width="10" height="10" rx="3" />
      <path d="M12 8v10M9 12h6" />
      <path d="M10 21h4" />
    </svg>
  );
}

/** Star icon — used for accents on the night-sky screens. */
export function StarIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(p)} aria-hidden>
      <path d="M12 3.5 14.4 9l5.6.6-4.2 3.9 1.2 5.6L12 16.9 6.9 19l1.3-5.6L4 9.6 9.6 9 12 3.5Z" />
    </svg>
  );
}
