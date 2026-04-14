import Link from "next/link";
import type { Team } from "@/lib/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="card card-hover"
      style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", textDecoration: "none", color: "inherit" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          style={{
            width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
            background: "var(--accent-soft)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.375rem", lineHeight: 1,
          }}
        >
          {team.cover_emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)" }}>{team.name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {team.tagline}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: "0.8125rem", color: "var(--text-dim)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {team.description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span
          style={{
            fontSize: "0.6875rem", fontWeight: 500,
            background: "var(--accent-soft)", color: "var(--accent)",
            padding: "2px 8px", borderRadius: "999px",
            border: "1px solid rgba(107,92,231,0.2)",
          }}
        >
          {team.specialty}
        </span>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
          {team.member_ids.length} agents · {team.tasks_completed.toLocaleString()} tasks
        </span>
      </div>

      {/* Metrics */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "monospace", color: "var(--savings)" }}>
            {team.avg_savings_pct.toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>savings</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, fontFamily: "monospace", color: "var(--text)" }}>
            {team.rent_price_eth_per_task.toFixed(4)}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "2px" }}>ETH / task</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, fontFamily: "monospace", color: "var(--text)" }}>
            {team.quality.toFixed(2)}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "2px" }}>quality</div>
        </div>
      </div>
    </Link>
  );
}
