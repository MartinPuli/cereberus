/**
 * Picks which Claude model + which agent handles a classified subtask.
 *
 * `tierToModel` is a pure tier→model lookup. `selectAgent` ranks an agent pool
 * by: exact tier match (+2) → skill-keyword overlap with the hint → efficiency
 * (lower avg_tokens = better) → overall quality score. The pool is typically
 * either a team's members or the whole marketplace.
 */
import type { Agent, ModelId, Tier } from "./types";
import { TIER_TO_MODEL } from "./pricing";

export function tierToModel(tier: Tier): ModelId {
  return TIER_TO_MODEL[tier];
}

export function selectAgent(
  agents: Agent[],
  tier: Tier,
  hint?: string,
): Agent {
  if (agents.length === 0) throw new Error("no agents available");
  const hintLower = hint?.toLowerCase() ?? "";
  const scored = agents.map((a) => {
    const tierMatch = a.default_tier === tier ? 2 : 0;
    const skillMatch = hintLower
      ? a.skills.reduce(
          (n, s) => n + (s.split("_").some((w) => hintLower.includes(w)) ? 1 : 0),
          0,
        )
      : 0;
    const avgTokens = a.metrics.avg_tokens_per_task[tier] ?? 2000;
    const efficiency = Math.max(0, 1 - avgTokens / 4000);
    const score = tierMatch + skillMatch + efficiency + a.quality;
    return { agent: a, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored[0].agent;
}
