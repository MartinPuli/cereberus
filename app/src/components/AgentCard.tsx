import Link from "next/link";
import type { Agent } from "@/lib/types";
import { TierBadge } from "./TierBadge";

const TIER_COLOR: Record<string, string> = {
  simple:   "var(--tier-haiku)",
  moderate: "var(--tier-sonnet)",
  complex:  "var(--tier-opus)",
};
const TIER_BG: Record<string, string> = {
  simple:   "var(--tier-haiku-bg)",
  moderate: "var(--tier-sonnet-bg)",
  complex:  "var(--tier-opus-bg)",
};
const TIER_BAR: Record<string, string> = {
  simple:   "tier-bar-haiku",
  moderate: "tier-bar-sonnet",
  complex:  "tier-bar-opus",
};

export function AgentCard({ agent }: { agent: Agent }) {
  const avgTokens   = agent.metrics.avg_tokens_per_task[agent.default_tier] ?? 1000;
  const initials    = agent.name.slice(0, 2).toUpperCase();
  const isGitHub    = agent.source === "github";
  const tierColor   = TIER_COLOR[agent.default_tier] ?? "var(--accent)";
  const tierBg      = TIER_BG[agent.default_tier]    ?? "var(--bg-elev2)";
  const tierBarCls  = TIER_BAR[agent.default_tier]   ?? "";

  return (
    <Link
      href={`/agents/${agent.id}`}
      className={`card card-hover ${tierBarCls}`}
      style={{
        display: "flex", flexDirection: "column", gap: "0",
        textDecoration: "none", color: "inherit", overflow: "hidden",
      }}
    >
      <div style={{ padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: "13px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            {/* Avatar */}
            <div
              style={{
                width: "38px", height: "38px", borderRadius: "10px", flexShrink: 0,
                background: tierBg,
                border: `1.5px solid ${tierColor}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: "0.8125rem",
                color: tierColor,
                letterSpacing: "0.05em",
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", letterSpacing: "-0.01em" }}>
                {agent.name}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", marginTop: "1px" }}>
                {agent.handle}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}>
            <TierBadge tier={agent.default_tier} />
            <span
              style={{
                fontSize: "0.5625rem", textTransform: "uppercase", letterSpacing: "0.07em",
                color: isGitHub ? "var(--savings)" : "var(--text-muted)",
                background: isGitHub ? "var(--tier-haiku-bg)" : "var(--bg-elev2)",
                border: `1px solid ${isGitHub ? "var(--tier-haiku-border)" : "var(--border)"}`,
                padding: "1px 6px", borderRadius: "4px",
              }}
            >
              {isGitHub ? "GitHub" : "Fixture"}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "0.8125rem", color: "var(--text-dim)", lineHeight: 1.58,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0,
          }}
        >
          {agent.description}
        </p>

        {/* Skills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {agent.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              style={{
                fontSize: "0.625rem", background: "var(--bg-elev2)",
                border: "1px solid var(--border)", borderRadius: "5px",
                padding: "2px 7px", color: "var(--text-dim)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {s.replace(/_/g, " ")}
            </span>
          ))}
          {agent.skills.length > 4 && (
            <span
              style={{
                fontSize: "0.625rem", background: "var(--bg-elev2)",
                border: "1px solid var(--border)", borderRadius: "5px",
                padding: "2px 7px", color: "var(--text-muted)",
              }}
            >
              +{agent.skills.length - 4}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div
          style={{
            borderTop: "1px solid var(--border)", paddingTop: "12px",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px",
          }}
        >
          {[
            { label: "Tokens",  value: avgTokens.toLocaleString() },
            { label: "Success", value: `${(agent.metrics.success_rate * 100).toFixed(0)}%` },
            { label: "Quality", value: agent.quality.toFixed(2) },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.875rem", fontWeight: 700,
                  fontFamily: "JetBrains Mono, monospace", color: "var(--text)",
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-muted)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Quality bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ flex: 1, height: "3px", background: "var(--bg-elev3)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%", borderRadius: "3px",
                background: `linear-gradient(to right, ${tierColor}88, ${tierColor})`,
                width: `${agent.quality * 100}%`,
                transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>
          <span
            style={{ fontSize: "0.625rem", color: tierColor, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, minWidth: "28px", textAlign: "right" }}
          >
            {(agent.quality * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </Link>
  );
}
