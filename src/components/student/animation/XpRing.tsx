/** Circular XP ring with a gold gradient — shows progress to the next rank. */
export function XpRing({
  progress,
  xp,
  size = 104,
}: {
  progress: number;
  xp: number;
  size?: number;
}) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label={`${xp} XP, ${clamped}% to the next rank`}
    >
      <defs>
        <linearGradient id="xpGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd66b" />
          <stop offset="100%" stopColor="#f5b833" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#ece0c8"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#xpGold)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white font-display font-bold"
        fontSize={size * 0.22}
      >
        {xp}
      </text>
      <text
        x="50%"
        y="63%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white"
        fontSize={size * 0.12}
      >
        XP
      </text>
    </svg>
  );
}
