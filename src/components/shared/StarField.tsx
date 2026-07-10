/**
 * Ambient night-sky decoration: gently twinkling gold stars over the midnight
 * teal backdrop. Purely decorative and aria-hidden.
 */
export function StarField({ className = "" }: { className?: string }) {
  const stars = [
    { x: 8, y: 20, r: 1.4, d: "0s" },
    { x: 22, y: 55, r: 1, d: "1.2s" },
    { x: 40, y: 15, r: 1.6, d: "0.6s" },
    { x: 58, y: 45, r: 1, d: "2s" },
    { x: 72, y: 25, r: 1.3, d: "0.9s" },
    { x: 86, y: 60, r: 1.1, d: "1.6s" },
    { x: 92, y: 30, r: 1.5, d: "0.3s" },
    { x: 15, y: 75, r: 1.2, d: "2.4s" },
    { x: 50, y: 70, r: 1, d: "1s" },
    { x: 33, y: 88, r: 1.2, d: "1.8s" },
    { x: 78, y: 82, r: 1, d: "0.5s" },
  ];
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="var(--color-gold-300)"
          className="animate-twinkle"
          style={{ animationDelay: s.d }}
        />
      ))}
    </svg>
  );
}
