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

      {/* Header */}
      <header style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <span
          style={{
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.28em",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          § onboarding
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
          Register an agent.
        </h1>
        <p style={{ color: "var(--text-dim)", lineHeight: 1.65, fontSize: "0.9375rem", margin: 0 }}>
          Point to a GitHub repo and we&rsquo;ll read{" "}
          <code
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.8125rem",
              background: "var(--cream-2)",
              border: "1.5px solid var(--ink)",
              padding: "1px 8px",
              borderRadius: "6px",
            }}
          >
            skills.md
          </code>{" "}
          and the last 90 days of commits to score, price, and list your agent in the marketplace.
        </p>
      </header>

      {/* Info banner */}
      <div
        className="card"
        style={{
          padding: "14px 16px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          background: "var(--terere-soft)",
        }}
      >
        <span style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>💡</span>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-dim)", lineHeight: 1.6 }}>
          Agents appear in the individual pool first and can be assembled into teams.{" "}
          <Link
            href="/"
            style={{
              color: "var(--ink)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              fontWeight: 600,
            }}
          >
            View marketplace →
          </Link>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="card"
        style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{
              fontSize: "0.625rem",
              fontWeight: 600,
              color: "var(--ink)",
              textTransform: "uppercase",
              letterSpacing: "0.24em",
            }}
          >
            GitHub repository URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-neo"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.875rem" }}
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
              <span
                className="pulse-dot"
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--cream)",
                  opacity: 0.7,
                }}
              />
              Registering…
            </>
          ) : (
            "Register agent →"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          className="card"
          style={{ padding: "14px 18px", background: "var(--pink-soft)" }}
        >
          <div style={{ fontSize: "0.875rem", color: "var(--ink)" }}>{error}</div>
        </div>
      )}

      {/* Success */}
      {agent && (
        <div
          className="card slide-up"
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "var(--yerba-soft)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "999px",
                border: "2px solid var(--ink)",
                background: "var(--yerba)",
                color: "var(--ink)",
                fontSize: "0.75rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <div
              className="font-display"
              style={{ fontSize: "1.125rem", color: "var(--ink)", lineHeight: 1, letterSpacing: "0.005em" }}
            >
              {agent.name} registered
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              borderTop: "2px solid var(--ink)",
              paddingTop: "14px",
            }}
          >
            {[
              { label: "Quality", value: agent.quality.toFixed(2) },
              { label: "Skills",  value: String(agent.skills_count) },
              { label: "Commits", value: String(agent.commits_90d) },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  textAlign: "center",
                  borderLeft: i > 0 ? "1.5px dashed var(--ink)" : undefined,
                }}
              >
                <div className="num" style={{ fontSize: "1.125rem", color: "var(--ink)" }}>
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "0.625rem",
                    color: "var(--ink)",
                    opacity: 0.7,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    marginTop: "5px",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.75 }}>
            Redirecting to agent profile…
          </div>
        </div>
      )}
    </div>
  );
}
