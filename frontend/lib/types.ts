export type ModelTier = "haiku" | "sonnet" | "opus";
export type TaskStatus = "queued" | "classifying" | "working" | "done" | "error";

export interface AgentMetrics {
  avg_tokens_per_task: Record<ModelTier, number>;
  success_rate: number;
  tasks_completed: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  github_url: string;
  owner: string;
  avatar: string;
  primary_tier: ModelTier;
  skills: string[];
  metrics: AgentMetrics;
  quality_score: number;
  wallet: string;
  registered_at: string;
}

export interface SubTask {
  id: string;
  description: string;
  tier: ModelTier | null;
  tier_reason: string;
  status: TaskStatus;
  agent: Agent | null;
  actual_tokens: number;
  cost_eth: number;
  naive_cost_eth: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface Orchestration {
  id: string;
  goal: string;
  status: "running" | "completed" | "error";
  tasks: SubTask[];
  naive_cost_eth: number;
  actual_cost_eth: number;
  saved_pct: number;
  tx_hash: string | null;
  created_at: string;
}

export interface SavingsStats {
  naive_eth: number;
  actual_eth: number;
  saved_pct: number;
}

export const MODEL_RATES: Record<ModelTier, number> = {
  haiku: 0.000001,
  sonnet: 0.000003,
  opus: 0.000015,
};

export const USD_PER_ETH = 3200;

export function ethToUsd(eth: number): string {
  return (eth * USD_PER_ETH).toFixed(4);
}

export function formatEth(eth: number): string {
  return eth.toFixed(6);
}
