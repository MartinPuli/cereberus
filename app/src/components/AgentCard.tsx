import Link from "next/link";
import type { Agent } from "@/lib/types";
import { TierBadge } from "./TierBadge";

const TIER_INITIALS_BG: Record<string, string> = {
  simple:   "var(--tier-haiku-bg)",
  moderate: "var(--tier-sonnet-bg)",
  complex:  "var(--tier-opus-bg)",
};
const TIER_INITIALS_COLOR: Record<string, string> = {
  simple:   "var(--tier-haiku)",
  moderate: "var(--tier-sonnet)",
  complex:  "var(--tier-opus)",
};

export function AgentCard({ agent }: { agent: Agent }) {
  const avgTokens   = agent.metrics.avg_tokens_per_task[agent.default_tier] ?? 1000;
  const initials    = agent.name.slice(0, 2).toUpperCase();
  const sourceLabel = agent.source === "github" ? "GitHub" : "Fixture";
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="card card-hover"
      style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", textDecoration: "none", color: "inherit" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <div
            style={{
              width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
              background: TIER_INITIALS_BG[agent.default_tier] ?? "var(--bg-elev2)",
              color: TIER_INITIALS_COLOR[agent.default_tier] ?? "var(--text-dim)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "monospace", fontWeight: 600, fontSize: "0.75rem",
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>{agent.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{agent.handle}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TierBadge tier={agent.default_tier} />
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
            {sourceLabel}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: "0.8125rem", color: "var(--text-dim)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {agent.description}
      </p>

      {/* Skills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {agent.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            style={{
              fontSize: "0.6875rem",
              background: "var(--bg-elev2)",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              padding: "2px 6px",
              color: "var(--text-dim)",
              fontFamily: "monospace",
            }}
          >
            {s.replace(/_/g, " ")}
          </span>
        ))}
        {agent.skills.length > 4 && (
          <span
            style={{
              fontSize: "0.6875rem",
              background: "var(--bg-elev2)",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              padding: "2px 6px",
              color: "var(--text-muted)",
            }}
          >
            +{agent.skills.length - 4}
          </span>
        )}
      </div>

      {/* Metrics */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {[
          { label: "Tokens", value: avgTokens.toLocaleString() },
          { label: "Success", value: `${(agent.metrics.success_rate * 100).toFixed(0)}%` },
          { label: "Quality", value: agent.quality.toFixed(2) },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, fontFamily: "monospace", color: "var(--text)" }}>{value}</div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quality bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "2px", background: "var(--bg-elev3)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: "2px",
            background: TIER_INITIALS_COLOR[agent.default_tier] ?? "var(--accent)",
            width: `${agent.quality * 100}%`,
          }} />
        </div>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
          {(agent.quality * 100).toFixed(0)}%
        </span>
      </div>
    </Link>
  );
}
