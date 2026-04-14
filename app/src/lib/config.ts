import type { Tier } from "./types";

export const MODEL_IDS = {
  haiku: "claude-haiku-4-5-20251001",
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
} as const;

export const ORCHESTRATOR_MODEL = MODEL_IDS.sonnet;
export const CLASSIFIER_MODEL = MODEL_IDS.haiku;

export const MOCK_MODE = process.env.MOCK_MODE === "1";

const VALID_TIERS = new Set<Tier>(["simple", "moderate", "complex"]);

export function parseForceRouting(): Partial<Record<string, Tier>> {
  const raw = process.env.FORCE_ROUTING;
  if (!raw) return {};
  const out: Partial<Record<string, Tier>> = {};
  for (const pair of raw.split(",")) {
    const [k, v] = pair.split("=").map((s) => s.trim());
    if (k && v && VALID_TIERS.has(v as Tier)) out[k.toLowerCase()] = v as Tier;
  }
  return out;
}
