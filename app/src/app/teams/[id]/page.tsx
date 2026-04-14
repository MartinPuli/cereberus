import { notFound } from "next/navigation";
import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { ensureSeeded } from "@/lib/seed";
import { getTeam, teamAverageSuccessRate, teamGithubBackedCount, teamMembers, teamTierMix } from "@/lib/teams";

export const dynamic = "force-dynamic";

export default async function TeamDetail({ params }: { params: Promise<{ id: string }> }) {
  ensureSeeded();
  const { id } = await params;
  const team    = getTeam(id);
  if (!team) notFound();
  const members = teamMembers(team);
  const tierMix = teamTierMix(team);
  const avgSuccess = teamAverageSuccessRate(team);
  const githubBacked = teamGithubBackedCount(team);

  const STATS = [
    { label: "Avg savings",   value: `${team.avg_savings_pct.toFixed(1)}%`,  color: "var(--savings)" },
    { label: "Rent / task",   value: `${team.rent_price_eth_per_task.toFixed(4)} ETH`, color: "var(--text)" },
    { label: "Avg tokens",    value: team.avg_tokens_per_task.toLocaleString(), color: "var(--text)" },
    { label: "Tasks done",    value: team.tasks_completed.toLocaleString(),  color: "var(--text)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

      {/* Back */}
      <Link href="/" style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "none" }}>
        ← Marketplace
      </Link>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
        <div
          style={{
            width: "56px", height: "56px", borderRadius: "14px", flexShrink: 0,
            background: "var(--accent-soft)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.75rem", lineHeight: 1,
          }}
        >
          {team.cover_emoji}
        </div>
        <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "inline-flex", alignSelf: "flex-start",
              fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--accent)", background: "var(--accent-soft)",
              border: "1px solid rgba(107,92,231,0.2)",
              padding: "3px 10px", borderRadius: "999px",
            }}
          >
            {team.specialty}
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text)", margin: 0, lineHeight: 1.15 }}>
            {team.name}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-dim)", margin: 0 }}>{team.tagline}</p>
        </div>
        <Link
          href={`/orchestrate?team=${team.id}`}
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "10px 20px", borderRadius: "10px",
            background: "var(--accent)", color: "white",
            fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", flexShrink: 0,
          }}
        >
          Run this team →
        </Link>
      </header>

      <p style={{ color: "var(--text-dim)", maxWidth: "640px", lineHeight: 1.65, fontSize: "0.9375rem", margin: 0 }}>
        {team.description}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: "16px 18px" }}>
            <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "6px" }}>
              {label}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 700, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Model mix</div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>
            {tierMix.simple} simple · {tierMix.moderate} moderate · {tierMix.complex} complex
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Covers cheap formatting, balanced writing, and deep reasoning.
          </div>
        </div>
        <div className="card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Member reliability</div>
          <div style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>{(avgSuccess * 100).toFixed(0)}%</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Average success rate across specialists.
          </div>
        </div>
        <div className="card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>GitHub-backed</div>
          <div style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 700, color: "var(--text)" }}>{githubBacked}/{members.length}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Live-registered agents vs seeded fixtures.
          </div>
        </div>
      </div>

      {/* Skills */}
      <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", margin: 0 }}>
          Shared skills
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {team.skills_union.map((s) => (
            <span
              key={s}
              style={{
                fontSize: "0.75rem", fontFamily: "monospace",
                background: "var(--bg-elev2)", border: "1px solid var(--border)",
                borderRadius: "6px", padding: "3px 9px", color: "var(--text-dim)",
              }}
            >
              {s.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </section>

      {/* Members */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
          Members <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({members.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
      </section>

      {/* CTA */}
      <div
        className="card"
        style={{ padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            Ready to ship?
          </div>
          <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text)" }}>
            Hand this team your goal
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-dim)", marginTop: "2px" }}>
            Decomposes, classifies, routes, and delivers.
          </div>
        </div>
        <Link
          href={`/orchestrate?team=${team.id}`}
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "10px 22px", borderRadius: "10px",
            background: "var(--accent)", color: "white",
            fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", flexShrink: 0,
          }}
        >
          Run this team →
        </Link>
      </div>

    </div>
  );
}
