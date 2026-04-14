import { ethToUsd } from "@/lib/pricing";

export function SavingsPanel({
  naive,
  actual,
  savedPct,
  live,
}: {
  naive: number;
  actual: number;
  savedPct: number;
  live: boolean;
}) {
  const fmt      = (n: number) => n.toFixed(6);
  const ratio    = naive > 0 ? actual / naive : 0.28;
  const savedEth = Math.max(0, naive - actual);
  return (
    <div
      className="card"
      style={{ overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text)" }}>
          Cost comparison
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {live && (
            <>
              <span
                className="pulse-dot"
                style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--savings)" }}
              />
              <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "monospace" }}>live</span>
            </>
          )}
          {!live && savedPct > 0 && (
            <span
              style={{
                fontSize: "0.6875rem", fontFamily: "monospace",
                background: "var(--tier-haiku-bg)", color: "var(--tier-haiku)",
                padding: "2px 8px", borderRadius: "6px",
                border: "1px solid rgba(5,150,105,0.2)",
              }}
            >
              complete
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Big number */}
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div
            className="counter-up"
            style={{
              fontSize: "3.25rem", fontWeight: 900, fontFamily: "monospace",
              lineHeight: 1, letterSpacing: "-0.02em",
              color: savedPct >= 50 ? "var(--savings)" : "#D97706",
            }}
          >
            {savedPct.toFixed(1)}%
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-dim)", marginTop: "8px" }}>
            cheaper than Opus-for-everything
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", fontFamily: "monospace" }}>
            saved {fmt(savedEth)} ETH
          </div>
        </div>

        {/* Bar comparison */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Naive bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-dim)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(220,38,38,0.5)", flexShrink: 0 }} />
                Naive — all Opus
              </div>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-dim)" }}>{fmt(naive)} ETH</span>
            </div>
            <div style={{ height: "5px", background: "var(--bg-elev2)", borderRadius: "3px" }}>
              <div style={{ height: "100%", borderRadius: "3px", background: "rgba(220,38,38,0.3)", width: "100%" }} />
            </div>
          </div>

          {/* Routed bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-dim)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--savings)", flexShrink: 0 }} />
                Routed — Nomos
              </div>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--savings)", fontWeight: 600 }}>{fmt(actual)} ETH</span>
            </div>
            <div style={{ height: "5px", background: "var(--bg-elev2)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "3px", background: "var(--savings)", width: `${ratio * 100}%`, transition: "width 1s ease" }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "var(--accent-soft)", border: "1px solid rgba(107,92,231,0.15)",
            borderRadius: "8px", padding: "10px 14px",
            fontSize: "0.75rem", color: "var(--accent)",
          }}
        >
          At 10k tasks/day, Nomos saves{" "}
          <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
            ${((naive - actual) * 10000 * 3200).toFixed(0)}/day
          </span>
        </div>
      </div>
    </div>
  );
}
