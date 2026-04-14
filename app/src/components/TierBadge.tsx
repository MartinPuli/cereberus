import type { Tier, ModelId } from "@/lib/types";

const LABEL: Record<ModelId, string> = {
  haiku:  "Haiku",
  sonnet: "Sonnet",
  opus:   "Opus",
};

const TIER_TO_MODEL: Record<Tier, ModelId> = {
  simple:   "haiku",
  moderate: "sonnet",
  complex:  "opus",
};

export function TierBadge({
  tier,
  model,
  size = "sm",
  animated = false,
}: {
  tier?: Tier;
  model?: ModelId;
  size?: "sm" | "md";
  animated?: boolean;
}) {
  const m: ModelId = model ?? (tier ? TIER_TO_MODEL[tier] : "sonnet");
  const sz = size === "md"
    ? { fontSize: "0.75rem", padding: "3px 10px" }
    : { fontSize: "0.6875rem", padding: "2px 7px" };

  return (
    <span
      className={`bg-tier-${m} ${animated ? "badge-pop" : ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        borderRadius: "999px",
        border: "1px solid",
        fontFamily: "monospace",
        fontWeight: 600,
        letterSpacing: "0.03em",
        ...sz,
      }}
    >
      <span
        className="pulse-dot"
        style={{
          width: size === "md" ? "7px" : "5px",
          height: size === "md" ? "7px" : "5px",
          borderRadius: "50%",
          background: "currentColor",
          opacity: 0.75,
          flexShrink: 0,
        }}
      />
      {LABEL[m]}
    </span>
  );
}
