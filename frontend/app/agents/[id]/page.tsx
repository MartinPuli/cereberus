"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_AGENTS } from "@/lib/mock-data";
import { ModelTierBadge } from "@/components/ModelTierBadge";
import { TxHashLink } from "@/components/TxHashLink";
import { ModelTier, MODEL_RATES } from "@/lib/types";
import {
  TIER_COLORS, TIER_MODEL_NAMES, TIER_LABELS,
  formatEth, formatUsd, scoreToPercent, shortenAddress, cn,
} from "@/lib/utils";
import { ArrowLeft, ExternalLink, Play, Github } from "lucide-react";

export default function AgentPage({ params }: { params: { id: string } }) {
  const agent = MOCK_AGENTS.find((a) => a.id === params.id);
  if (!agent) notFound();

  const tc    = TIER_COLORS[agent.primary_tier];
  const tiers = ["haiku", "sonnet", "opus"] as ModelTier[];

  return (
    <div className="page-container space-y-7">

      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-3 hover:text-ink transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Marketplace
      </Link>

      {/* ── Identity card ─────────────────────── */}
      <div className="card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-semibold font-mono text-base flex-shrink-0", tc.soft, tc.text)}>
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-bold text-ink font-mono">{agent.name}</h1>
                <ModelTierBadge tier={agent.primary_tier} />
              </div>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="text-sm text-ink-3">@{agent.owner}</span>
                <a href={agent.github_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gnomo hover:underline">
                  <Github className="w-3 h-3" />GitHub<ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-subtle border border-line text-xs font-mono text-ink-3">
              {shortenAddress(agent.wallet)}
            </div>
            <Link href="/orchestrate" className="btn-primary">
              <Play className="w-3.5 h-3.5" />Hire agent
            </Link>
          </div>
        </div>

        <p className="text-sm text-ink-2 leading-relaxed">{agent.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {agent.skills.map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-md bg-subtle border border-line text-xs font-mono text-ink-2">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── Two columns ───────────────────────── */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Token efficiency */}
        <div className="card p-5 space-y-4">
          <p className="label">Token efficiency by tier</p>
          <div className="space-y-4">
            {tiers.map((tier) => {
              const tokens = agent.metrics.avg_tokens_per_task[tier];
              const pct    = Math.min((tokens / 4500) * 100, 100);
              const c      = TIER_COLORS[tier];
              return (
                <div key={tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ModelTierBadge tier={tier} size="sm" />
                      <span className="text-xs text-ink-3 font-mono">{TIER_MODEL_NAMES[tier]}</span>
                    </div>
                    <div className="text-right">
                      <span className={cn("text-sm font-semibold font-mono", c.text)}>{tokens.toLocaleString()}</span>
                      <span className="text-xs text-ink-3 ml-1">tok</span>
                    </div>
                  </div>
                  <div className="h-1 w-full rounded-full bg-ui overflow-hidden">
                    <div className={cn("h-full rounded-full", c.dot)} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-ink-3 font-mono">
                    <span>{formatEth(tokens * MODEL_RATES[tier])} / task</span>
                    <span>{formatUsd(tokens * MODEL_RATES[tier])}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality metrics */}
        <div className="card p-5 space-y-4">
          <p className="label">Quality metrics</p>

          {/* Score */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-subtle border border-line">
            <span className="text-sm text-ink-2">Overall quality</span>
            <span className={cn("text-3xl font-black font-mono", tc.text)}>
              {scoreToPercent(agent.quality_score)}
            </span>
          </div>

          {/* Breakdown */}
          {[
            { label: "Success rate",     v: agent.metrics.success_rate,                 display: scoreToPercent(agent.metrics.success_rate) },
            { label: "Skills richness",  v: Math.min(agent.skills.length / 20, 1),      display: `${agent.skills.length} skills` },
            { label: "Tasks completed",  v: Math.min(agent.metrics.tasks_completed / 5000, 1), display: agent.metrics.tasks_completed.toLocaleString() },
          ].map(({ label, v, display }) => (
            <div key={label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-ink-2">{label}</span>
                <span className="text-xs font-mono text-ink">{display}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-ui overflow-hidden">
                <div className="h-full rounded-full bg-gnomo/50" style={{ width: `${v * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing table ─────────────────────── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <p className="text-sm font-medium text-ink">Pricing per task</p>
          <p className="text-xs text-ink-3 mt-0.5">Base compute + {scoreToPercent(0.1 + agent.quality_score * 0.4)} agent margin</p>
        </div>
        <table className="w-full table-clean">
          <thead>
            <tr>
              {["Tier", "Model", "Avg tokens", "Base compute", "With margin", "USD"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => {
              const tokens = agent.metrics.avg_tokens_per_task[tier];
              const base   = tokens * MODEL_RATES[tier];
              const total  = base * (1 + 0.1 + agent.quality_score * 0.4);
              const c      = TIER_COLORS[tier];
              return (
                <tr key={tier} className="hover:bg-subtle/50 transition-colors">
                  <td><ModelTierBadge tier={tier} size="sm" /></td>
                  <td className="font-mono text-ink-3">{TIER_MODEL_NAMES[tier]}</td>
                  <td className="font-mono">{tokens.toLocaleString()}</td>
                  <td className="font-mono text-ink-2">{formatEth(base)}</td>
                  <td className={cn("font-mono font-medium", c.text)}>{formatEth(total)}</td>
                  <td className="font-mono text-ink-3">{formatUsd(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Registration row */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-subtle border border-line">
        <span className="text-xs text-ink-3">
          Registered {new Date(agent.registered_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <TxHashLink hash="0x7f9e1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a" />
      </div>

    </div>
  );
}
