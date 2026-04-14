"use client";

import { ModelTier } from "@/lib/types";
import { TIER_COLORS, TIER_LABELS, cn } from "@/lib/utils";

interface Props {
  tier: ModelTier;
  size?: "sm" | "md";
  animated?: boolean;
  className?: string;
}

const SIZE: Record<string, string> = {
  sm: "px-2 py-0.5 text-2xs gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
};
const DOT: Record<string, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
};

export function ModelTierBadge({ tier, size = "md", animated = false, className }: Props) {
  const c = TIER_COLORS[tier];
  return (
    <span
      className={cn(
        "badge font-mono uppercase tracking-wider",
        c.text, c.bg, c.border,
        SIZE[size],
        animated && "animate-badge-pop",
        className,
      )}
    >
      <span className={cn("rounded-full flex-shrink-0", DOT[size], c.dot, "animate-pulse-dot")} />
      {TIER_LABELS[tier]}
    </span>
  );
}
