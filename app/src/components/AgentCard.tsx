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
                width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
                background: tierBg,
                border: `2px solid var(--ink)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8125rem",
                color: "var(--ink)",
                letterSpacing: "0.02em",
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                className="font-display"
                style={{ fontSize: "1rem", color: "var(--ink)", lineHeight: 1, letterSpacing: "0.005em" }}
              >
                {agent.name}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", marginTop: "4px" }}>
                {agent.handle}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", flexShrink: 0 }}>
            <TierBadge tier={agent.default_tier} />
            <span
              className="pill-neo"
              style={{
                fontSize: "0.5625rem",
                padding: "2px 8px",
                letterSpacing: "0.14em",
                background: isGitHub ? "var(--yerba-soft)" : "var(--cream-2)",
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {agent.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="pill-neo"
              style={{ fontSize: "0.5625rem", padding: "2px 9px", letterSpacing: "0.1em", textTransform: "none" }}
            >
              {s.replace(/_/g, " ")}
            </span>
          ))}
          {agent.skills.length > 4 && (
            <span
              className="pill-neo"
              style={{ fontSize: "0.5625rem", padding: "2px 9px", letterSpacing: "0.1em", background: "var(--cream-2)" }}
            >
              +{agent.skills.length - 4}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div
          style={{
            borderTop: "2px solid var(--ink)", paddingTop: "12px",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px",
          }}
        >
          {[
            { label: "Tokens",  value: avgTokens.toLocaleString() },
            { label: "Success", value: `${(agent.metrics.success_rate * 100).toFixed(0)}%` },
            { label: "Quality", value: agent.quality.toFixed(2) },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                borderLeft: i > 0 ? "1.5px dashed var(--ink)" : undefined,
              }}
            >
              <div className="num" style={{ fontSize: "0.9375rem", color: "var(--ink)", lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "var(--text-muted)", marginTop: "5px", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Quality bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              flex: 1, height: "6px",
              background: "var(--cream-2)",
              border: "1.5px solid var(--ink)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: tierColor,
                width: `${agent.quality * 100}%`,
                transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.625rem",
              color: "var(--ink)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              minWidth: "32px",
              textAlign: "right",
              letterSpacing: "0.04em",
            }}
          >
            {(agent.quality * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </Link>
  );
}
