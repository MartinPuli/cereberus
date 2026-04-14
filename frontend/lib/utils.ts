import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ModelTier } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TIER_LABELS: Record<ModelTier, string> = {
  haiku:  "Haiku",
  sonnet: "Sonnet",
  opus:   "Opus",
};

export const TIER_COLORS: Record<
  ModelTier,
  { text: string; bg: string; border: string; dot: string; soft: string }
> = {
  haiku:  { text: "text-haiku-text", bg: "bg-haiku/10",  border: "border-haiku/25",  dot: "bg-haiku",  soft: "bg-haiku-soft"  },
  sonnet: { text: "text-sonnet-text", bg: "bg-sonnet/10", border: "border-sonnet/25", dot: "bg-sonnet", soft: "bg-sonnet-soft" },
  opus:   { text: "text-opus-text",   bg: "bg-opus/10",   border: "border-opus/25",   dot: "bg-opus",   soft: "bg-opus-soft"   },
};

export const TIER_MODEL_NAMES: Record<ModelTier, string> = {
  haiku:  "claude-haiku-4-5",
  sonnet: "claude-sonnet-4-6",
  opus:   "claude-opus-4-6",
};

export const TIER_DESC: Record<ModelTier, string> = {
  haiku:  "Formatting, extraction, simple tasks",
  sonnet: "Writing, analysis, code generation",
  opus:   "Reasoning, architecture, strategy",
};

export function formatEth(n: number): string {
  if (n === 0) return "0 ETH";
  if (n < 0.000001) return "<0.000001 ETH";
  return n.toFixed(6) + " ETH";
}

export function formatUsd(eth: number, ethPrice = 3200): string {
  const usd = eth * ethPrice;
  if (usd < 0.001) return "<$0.001";
  if (usd < 0.01)  return "$" + usd.toFixed(4);
  return "$" + usd.toFixed(3);
}

export function scoreToPercent(score: number): string {
  return Math.round(score * 100) + "%";
}

export function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export function shortenHash(hash: string): string {
  return hash.slice(0, 10) + "…" + hash.slice(-8);
}
