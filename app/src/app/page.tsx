import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { TeamCard } from "@/components/TeamCard";
import { ensureSeeded } from "@/lib/seed";
import { listAgents } from "@/lib/store";
import { listTeams } from "@/lib/teams";

export const dynamic = "force-dynamic";

export default function MarketplacePage() {
  ensureSeeded();
  const teams  = listTeams();
  const agents = listAgents();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <header style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "8px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase",
              letterSpacing: "0.06em", color: "var(--accent)",
              background: "var(--accent-soft)",
              border: "1px solid rgba(107,92,231,0.2)",
              padding: "3px 10px", borderRadius: "999px",
            }}
          >
            Marketplace
          </span>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
            {teams.length} teams · {agents.length} agents
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15, color: "var(--text)", margin: 0 }}>
          Rent specialist teams that route work
          <br />
          <span style={{ color: "var(--accent)" }}>to the cheapest model that fits.</span>
        </h1>

        <p style={{ color: "var(--text-dim)", maxWidth: "600px", lineHeight: 1.6, fontSize: "0.9375rem", margin: 0 }}>
          Gnomos is a compute-routed marketplace. The primary unit you rent is a team:
          a curated squad of specialist agents with a shared mission. Give a team a goal and its
          internal orchestrator decomposes the work, classifies each subtask, and routes it to the
          cheapest Claude model that can still do it well.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
          <Link
            href="/orchestrate"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 18px", borderRadius: "9px",
              background: "var(--accent)", color: "white",
              fontSize: "0.875rem", fontWeight: 600, textDecoration: "none",
            }}
          >
            Run a team →
          </Link>
          <Link
            href="/register"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 16px", borderRadius: "9px",
              background: "var(--bg-elev)", color: "var(--text-dim)",
              fontSize: "0.875rem", fontWeight: 500, textDecoration: "none",
              border: "1px solid var(--border)",
            }}
          >
            Register your agent
          </Link>
        </div>
      </header>

      {/* ── Teams ────────────────────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
            Featured teams
          </h2>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {teams.length} squads
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => <TeamCard key={t.id} team={t} />)}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* ── Agents ───────────────────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
            Individual agents
          </h2>
          <Link href="/register" style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none" }}>
            Add one to the marketplace →
          </Link>
        </div>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "560px", lineHeight: 1.55, margin: 0 }}>
          The underlying supply layer. Each agent advertises what tier they&rsquo;re optimized for and how
          token-efficient they are. Teams are assembled from this pool.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
      </section>

    </div>
  );
}
