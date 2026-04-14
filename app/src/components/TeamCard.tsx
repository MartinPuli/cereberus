import Link from "next/link";
import type { Team } from "@/lib/types";

const VERTICAL_LABEL: Record<string, string> = {
  legal: "Legal",
  content: "Content",
  marketing: "Marketing",
  research: "Research",
  localization: "Localization",
  support: "Support",
  operations: "Operations",
  design: "Design",
  data: "Data",
  accounting: "Accounting",
};

export function TeamCard({ team }: { team: Team }) {
  const savingsColor = team.avg_savings_pct >= 60 ? "var(--savings)" : team.avg_savings_pct >= 40 ? "#D97706" : "var(--text-dim)";

  return (
    <Link
      href={`/teams/${team.id}`}
      className="card card-hover"
      style={{
        display: "flex", flexDirection: "column", gap: "0",
        textDecoration: "none", color: "inherit", overflow: "hidden",
      }}
    >
      {/* Accent bar */}
      <div style={{ height: "3px", background: "linear-gradient(to right, var(--accent), var(--tier-opus))" }} />

      <div style={{ padding: "20px 20px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "44px", height: "44px", borderRadius: "11px", flexShrink: 0,
              background: "var(--accent-soft)",
              border: "1px solid rgba(107,92,231,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", lineHeight: 1,
            }}
          >
            {team.cover_emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)", letterSpacing: "-0.01em" }}>
              {team.name}
            </div>
            <div
              style={{
                fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "3px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {team.tagline}
            </div>
          </div>
          {/* Specialty pill */}
          <span
            style={{
              fontSize: "0.625rem", fontWeight: 500, textTransform: "uppercase",
              letterSpacing: "0.06em", color: "var(--accent)",
              background: "var(--accent-soft)", border: "1px solid rgba(107,92,231,0.2)",
              padding: "2px 8px", borderRadius: "999px", flexShrink: 0,
            }}
          >
            {team.specialty}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "0.8125rem", color: "var(--text-dim)", lineHeight: 1.6,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0,
          }}
        >
          {team.description}
        </p>

        {/* Metrics */}
        <div
          style={{
            borderTop: "1px solid var(--border)", paddingTop: "14px",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="font-display"
              style={{ fontSize: "1.625rem", color: savingsColor, lineHeight: 1 }}
            >
              {team.avg_savings_pct.toFixed(0)}%
            </div>
            <div style={{ fontSize: "0.625rem", color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              saved
            </div>
          </div>
          <div style={{ textAlign: "center", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
            <div
              style={{ fontSize: "0.9375rem", fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "var(--text)", lineHeight: 1 }}
            >
              {team.rent_price_eth_per_task.toFixed(4)}
            </div>
            <div style={{ fontSize: "0.625rem", color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              ETH / task
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "0.9375rem", fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: "var(--text)", lineHeight: 1 }}
            >
              {team.quality.toFixed(2)}
            </div>
            <div style={{ fontSize: "0.625rem", color: "var(--text-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              quality
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
            {team.member_ids.length} agents · {team.tasks_completed.toLocaleString()} tasks
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 500 }}>
            Run →
          </span>
        </div>
      </div>
    </Link>
  );
}
