"use client";

import Link from "next/link";
import { Agent, MODEL_RATES } from "@/lib/types";
import { ModelTierBadge } from "./ModelTierBadge";
import { TIER_COLORS, formatUsd, scoreToPercent, cn } from "@/lib/utils";

// Stable pastel initials colors per avatar
const AVATAR_BG: Record<string, string> = {
  PA: "bg-opus-soft text-opus-text",
  CP: "bg-sonnet-soft text-sonnet-text",
  SS: "bg-gnomo-soft text-gnomo",
  FF: "bg-haiku-soft text-haiku-text",
  TT: "bg-sonnet-soft text-sonnet-text",
};

function Avatar({ avatar, tier }: { avatar: string; tier: Agent["primary_tier"] }) {
  const cls = AVATAR_BG[avatar] ?? `bg-${tier}-soft text-${tier}-text`;
  return (
    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs font-mono flex-shrink-0", cls)}>
      {avatar}
    </div>
  );
}

export function AgentCard({ agent }: { agent: Agent }) {
  const tc = TIER_COLORS[agent.primary_tier];
  const tokens = agent.metrics.avg_tokens_per_task[agent.primary_tier];
  const pricePerTask = tokens * MODEL_RATES[agent.primary_tier];

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="card p-5 flex flex-col gap-4 h-full cursor-pointer group">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar avatar={agent.avatar} tier={agent.primary_tier} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink font-mono truncate">{agent.name}</p>
              <p className="text-xs text-ink-3 truncate">@{agent.owner}</p>
            </div>
          </div>
          <ModelTierBadge tier={agent.primary_tier} size="sm" />
        </div>

        {/* Description */}
        <p className="text-xs text-ink-2 leading-relaxed line-clamp-2 flex-1">
          {agent.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {agent.skills.slice(0, 3).map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-md bg-subtle border border-line text-2xs text-ink-3 font-mono">
              {s}
            </span>
          ))}
          {agent.skills.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-subtle border border-line text-2xs text-ink-3">
              +{agent.skills.length - 3}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="divider" />
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className={cn("text-sm font-semibold font-mono", tc.text)}>{tokens.toLocaleString()}</p>
            <p className="text-2xs text-ink-3 mt-0.5">tokens</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{scoreToPercent(agent.metrics.success_rate)}</p>
            <p className="text-2xs text-ink-3 mt-0.5">success</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{formatUsd(pricePerTask)}</p>
            <p className="text-2xs text-ink-3 mt-0.5">per task</p>
          </div>
        </div>

        {/* Quality bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-0.5 rounded-full bg-ui overflow-hidden">
            <div
              className={cn("h-full rounded-full", tc.dot, "transition-all duration-700")}
              style={{ width: `${agent.quality_score * 100}%` }}
            />
          </div>
          <span className="text-2xs text-ink-3">{scoreToPercent(agent.quality_score)}</span>
        </div>

      </div>
    </Link>
  );
}
