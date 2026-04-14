/**
 * Line-art gnome hat — sits in the hero's four corners.
 * Stroke-only, hand-drawn feel with jagged fur rim and motion marks.
 */
export function GnomeHat({
  size = 140,
  flipped = false,
  style,
}: {
  size?: number;
  flipped?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 140 140"
      width={size}
      height={size}
      fill="none"
      stroke="var(--ink)"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        display: "block",
        transform: flipped ? "scaleX(-1)" : undefined,
        ...style,
      }}
      aria-hidden
    >
      {/* Hat cone */}
      <path d="M18 108 C 30 60, 48 30, 66 14 C 82 32, 98 66, 112 108 Z" />

      {/* Pom-pom at the tip */}
      <circle cx="58" cy="8" r="7" />
      <path d="M52 4 L 50 1" />
      <path d="M60 2 L 60 -1" />
      <path d="M66 4 L 70 2" />

      {/* Jagged fur rim */}
      <path d="M18 108 Q 24 102, 30 108 T 44 108 T 58 108 T 72 108 T 86 108 T 100 108 T 112 108" />

      {/* Motion marks — the "thinking" lines */}
      <path d="M116 44 L 128 38" />
      <path d="M120 58 L 132 58" />
      <path d="M118 72 L 130 76" />
    </svg>
  );
}

/**
 * Peeking gnome — used above the wordmark.
 * Fills hat with cream so it sits cleanly in front of the ( NOMOS ) text.
 */
export function GnomePeek({
  size = 160,
  style,
}: {
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 110"
      width={size}
      height={size}
      fill="none"
      stroke="var(--ink)"
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", ...style }}
      aria-hidden
    >
      {/* Hat — soft cone with slight lean */}
      <path
        d="M14 68 C 24 40, 42 14, 60 6 C 78 14, 96 40, 106 68 Z"
        fill="var(--cream)"
      />

      {/* Pom-pom */}
      <circle cx="60" cy="6" r="6" fill="var(--cream)" />
      <path d="M56 2 L 54 -1" />
      <path d="M60 0 L 60 -3" />
      <path d="M64 2 L 66 -1" />

      {/* Jagged rim */}
      <path
        d="M14 68 Q 22 62, 30 68 T 46 68 T 62 68 T 78 68 T 94 68 T 106 68"
        fill="var(--cream)"
      />

      {/* Face — just eyes + little smile peeking under */}
      <circle cx="46" cy="82" r="2.2" fill="var(--ink)" stroke="none" />
      <circle cx="74" cy="82" r="2.2" fill="var(--ink)" stroke="none" />
      <path d="M54 92 Q 60 98, 66 92" />

      {/* Tiny hands grabbing the hat rim */}
      <path d="M22 72 C 18 80, 24 86, 30 84" />
      <path d="M98 72 C 102 80, 96 86, 90 84" />

      {/* Charm sparkles */}
      <path d="M8 48 L 2 44" />
      <path d="M112 48 L 118 44" />
    </svg>
  );
}
