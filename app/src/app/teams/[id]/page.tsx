import { notFound } from "next/navigation";
import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { ensureSeeded } from "@/lib/seed";
import { getTeam, teamAverageSuccessRate, teamGithubBackedCount, teamMembers, teamTierMix } from "@/lib/teams";

export const dynamic = "force-dynamic";

export default async function TeamDetail({ params }: { params: Promise<{ id: string }> }) {
  ensureSeeded();
  const { id }        = await params;
  const team          = getTeam(id);
  if (!team) notFound();
  const members       = teamMembers(team);
  const tierMix       = teamTierMix(team);
  const avgSuccess    = teamAverageSuccessRate(team);
  const githubBacked  = teamGithubBackedCount(team);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

      {/* Back */}
      <Link
        href="/"
        style={{
          fontSize: "0.6875rem",
          color: "var(--ink)",
          textDecoration: "none",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
        }}
      >
        ← Marketplace
      </Link>

      {/* Hero header */}
      <header
        className="card"
        style={{ padding: "0", overflow: "hidden" }}
      >
        {/* Multicolor stripe */}
        <div
          style={{
            height: "6px",
            background:
              "linear-gradient(to right, var(--yerba) 0%, var(--terere) 33%, var(--pink) 66%, var(--blue) 100%)",
          }}
        />
        <div style={{ padding: "28px", display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "72px", height: "72px", borderRadius: "18px", flexShrink: 0,
              background: "var(--cream-2)", border: "2px solid var(--ink)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.25rem", lineHeight: 1,
              boxShadow: "var(--shadow-neo-sm)",
            }}
          >
            {team.cover_emoji}
          </div>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span className="pill-neo pill-neo-accent" style={{ alignSelf: "flex-start" }}>
              {team.specialty}
            </span>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 0.95,
                letterSpacing: "0.005em",
              }}
            >
              {team.name}
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-dim)", margin: 0, lineHeight: 1.55 }}>
              {team.tagline}
            </p>
          </div>
          <Link href={`/orchestrate?team=${team.id}`} className="btn-primary" style={{ flexShrink: 0 }}>
            Run this team →
          </Link>
        </div>
      </header>

      {/* Description */}
      <p style={{ color: "var(--text-dim)", maxWidth: "640px", lineHeight: 1.7, fontSize: "0.9375rem", margin: 0 }}>
        {team.description}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg savings",  value: `${team.avg_savings_pct.toFixed(1)}%`,            accent: "var(--yerba)"  },
          { label: "Rent / task",  value: `${team.rent_price_eth_per_task.toFixed(4)} ETH`, accent: "var(--terere)" },
          { label: "Avg tokens",   value: team.avg_tokens_per_task.toLocaleString(),        accent: "var(--pink)"   },
          { label: "Tasks done",   value: team.tasks_completed.toLocaleString(),            accent: "var(--blue)"   },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className="card"
            style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}
          >
            <div
              style={{
                fontSize: "0.625rem",
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
            <div className="num" style={{ fontSize: "1.5rem", color: "var(--ink)", lineHeight: 1.1 }}>
              {value}
            </div>
            <div
              aria-hidden
              style={{
                width: "24px",
                height: "4px",
                background: accent,
                border: "1.5px solid var(--ink)",
                borderRadius: "2px",
                marginTop: "4px",
              }}
            />
          </div>
        ))}
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model mix */}
        <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--text-muted)", fontWeight: 500 }}>
            Model mix
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "Simple",   count: tierMix.simple,   bg: "var(--tier-haiku-bg)",  color: "var(--tier-haiku)"  },
              { label: "Moderate", count: tierMix.moderate, bg: "var(--tier-sonnet-bg)", color: "var(--tier-sonnet)" },
              { label: "Complex",  count: tierMix.complex,  bg: "var(--tier-opus-bg)",   color: "var(--tier-opus)"   },
            ].map(({ label, count, bg, color }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px 4px",
                  borderRadius: "12px",
                  background: bg,
                  border: "2px solid var(--ink)",
                }}
              >
                <div className="num" style={{ fontSize: "1.25rem", color, lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: "0.5625rem", color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.18em", marginTop: "6px", fontWeight: 500 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Covers cheap formatting, balanced writing, and deep reasoning.
          </div>
        </div>

        {/* Reliability */}
        <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--text-muted)", fontWeight: 500 }}>
            Member reliability
          </div>
          <div className="num" style={{ fontSize: "2.25rem", color: "var(--yerba)", lineHeight: 1 }}>
            {(avgSuccess * 100).toFixed(0)}%
          </div>
          <div style={{ height: "8px", background: "var(--cream-2)", border: "1.5px solid var(--ink)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--yerba)", width: `${avgSuccess * 100}%` }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Average success rate across specialists.</div>
        </div>

        {/* GitHub-backed */}
        <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--text-muted)", fontWeight: 500 }}>
            GitHub-backed
          </div>
          <div className="num" style={{ fontSize: "2.25rem", color: "var(--tier-sonnet)", lineHeight: 1 }}>
            {githubBacked}/{members.length}
          </div>
          <div style={{ height: "8px", background: "var(--cream-2)", border: "1.5px solid var(--ink)", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--tier-sonnet)", width: `${members.length > 0 ? (githubBacked / members.length) * 100 : 0}%` }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Live-registered agents vs seeded fixtures.</div>
        </div>
      </div>

      {/* Skills */}
      <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <h2 style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.28em", color: "var(--ink)", margin: 0, fontWeight: 600 }}>
          § shared skills
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {team.skills_union.map((s) => (
            <span
              key={s}
              className="pill-neo"
              style={{ fontSize: "0.625rem", padding: "3px 10px", letterSpacing: "0.1em", textTransform: "none" }}
            >
              {s.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </section>

      {/* Members */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2
          className="font-display"
          style={{ fontSize: "1.5rem", color: "var(--text)", margin: 0, lineHeight: 1.1 }}
        >
          Members{" "}
          <span style={{ color: "var(--text-muted)", fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "1rem" }}>
            ({members.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
      </section>

      {/* CTA */}
      <div
        className="card"
        style={{
          padding: "28px", overflow: "hidden", position: "relative",
          background: "var(--terere-soft)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px",
        }}
      >
        <div>
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.28em", color: "var(--ink)", marginBottom: "8px", fontWeight: 600 }}>
            § ready to ship?
          </div>
          <div className="font-display" style={{ fontSize: "1.875rem", color: "var(--ink)", lineHeight: 0.95, letterSpacing: "0.005em", marginBottom: "8px" }}>
            Hand this team your goal
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>
            Decomposes · classifies · routes · delivers.
          </div>
        </div>
        <Link href={`/orchestrate?team=${team.id}`} className="btn-primary">
          Run this team →
        </Link>
      </div>

    </div>
  );
}
