"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Agent } from "@/lib/types";

interface RegisterErrorResponse {
  success: false;
  error?: { code?: string; message?: string; };
}

export default function RegisterPage() {
  const router = useRouter();
  const [url, setUrl]       = useState("https://github.com/");
  const [loading, setLoading] = useState(false);
  const [agent, setAgent]   = useState<Agent | null>(null);
  const [error, setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setAgent(null);
    let res: Response;
    try {
      res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ github_url: url }),
      });
    } catch {
      setLoading(false);
      setError("Unable to reach registration. Check your network and try again.");
      return;
    }
    const j = (await res.json()) as { success: true; data: Agent } | RegisterErrorResponse;
    setLoading(false);
    if (!j.success) { setError(j.error?.message ?? "Unknown error"); return; }
    setAgent(j.data);
    setTimeout(() => router.push(`/agents/${j.data.id}`), 1800);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px", maxWidth: "560px" }}>

      {/* Back */}
      <Link href="/" style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "none" }}>
        ← Marketplace
      </Link>

      {/* Header */}
      <header style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h1 className="font-display" style={{ fontSize: "2.25rem", color: "var(--text)", margin: 0, lineHeight: 1.05, letterSpacing: "0.01em" }}>
          Register an agent
        </h1>
        <p style={{ color: "var(--text-dim)", lineHeight: 1.65, fontSize: "0.9375rem", margin: 0 }}>
          Point to a GitHub repo and we&rsquo;ll read <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8125rem", background: "var(--bg-elev2)", padding: "1px 5px", borderRadius: "4px" }}>skills.md</code>{" "}
          and the last 90 days of commits to score, price, and list your agent in the marketplace.
        </p>
      </header>

      {/* Info banner */}
      <div
        className="card"
        style={{ padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start", borderColor: "rgba(107,92,231,0.2)", background: "var(--accent-soft)" }}
      >
        <span style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>💡</span>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-dim)", lineHeight: 1.55 }}>
          Agents appear in the individual pool first and can be assembled into teams.{" "}
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            View marketplace →
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            GitHub repository URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              background: "var(--bg-elev2)", border: "1px solid var(--border)",
              borderRadius: "9px", padding: "11px 14px",
              fontSize: "0.875rem", fontFamily: "JetBrains Mono, monospace",
              color: "var(--text)", outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(107,92,231,0.5)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "var(--border)"; }}
            placeholder="https://github.com/owner/repo"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ alignSelf: "flex-start", opacity: loading ? 0.5 : 1 }}
        >
          {loading ? (
            <>
              <span className="pulse-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255,255,255,0.7)" }} />
              Registering…
            </>
          ) : "Register agent →"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          className="card"
          style={{ padding: "12px 16px", borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.04)" }}
        >
          <div style={{ fontSize: "0.875rem", color: "#DC2626" }}>{error}</div>
        </div>
      )}

      {/* Success */}
      {agent && (
        <div
          className="card slide-up"
          style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px", borderColor: "var(--tier-haiku-border)", background: "var(--tier-haiku-bg)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.125rem" }}>✓</span>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--tier-haiku)" }}>
              {agent.name} registered
            </div>
          </div>
          <div
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px",
              borderTop: "1px solid rgba(5,150,105,0.2)", paddingTop: "12px",
            }}
          >
            {[
              { label: "Quality",  value: agent.quality.toFixed(2) },
              { label: "Skills",   value: String(agent.skills_count) },
              { label: "Commits",  value: String(agent.commits_90d) },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "var(--tier-haiku)", fontSize: "1.125rem" }}>{value}</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--tier-haiku)", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--tier-haiku)", opacity: 0.8 }}>
            Redirecting to agent profile…
          </div>
        </div>
      )}
    </div>
  );
}
