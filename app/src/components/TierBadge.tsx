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
  const isMd = size === "md";

  return (
    <span
      className={`bg-tier-${m} ${animated ? "badge-pop" : ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isMd ? "6px" : "4px",
        borderRadius: "999px",
        border: "1px solid",
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: 600,
        letterSpacing: "0.04em",
        fontSize: isMd ? "0.75rem" : "0.625rem",
        padding: isMd ? "4px 10px" : "2px 7px",
        textTransform: "uppercase",
      }}
    >
      <span
        className={animated ? "pulse-dot" : ""}
        style={{
          width: isMd ? "7px" : "5px",
          height: isMd ? "7px" : "5px",
          borderRadius: "50%",
          background: "currentColor",
          opacity: 0.8,
          flexShrink: 0,
        }}
      />
      {LABEL[m]}
    </span>
  );
}
