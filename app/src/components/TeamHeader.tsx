import type { Agent, SubTask } from "@/lib/types";

const AVATAR_COLORS = [
  { bg: "var(--tier-haiku-bg)",  color: "var(--tier-haiku)"  },
  { bg: "var(--tier-sonnet-bg)", color: "var(--tier-sonnet)" },
  { bg: "var(--tier-opus-bg)",   color: "var(--tier-opus)"   },
  { bg: "var(--accent-soft)",    color: "var(--accent)"      },
];

export function TeamHeader({
  subtasks,
  agentsById,
}: {
  subtasks: SubTask[];
  agentsById: Map<string, Agent>;
}) {
  const hired  = subtasks.map((st) => agentsById.get(st.agent_id)).filter((a): a is Agent => !!a);
  const unique = Array.from(new Map(hired.map((a) => [a.id, a])).values());
  if (unique.length === 0) return null;

  const doneCount    = subtasks.filter((s) => s.status === "done").length;
  const workingCount = subtasks.filter((s) => s.status === "working").length;

  return (
    <div
      className="card slide-up"
      style={{
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: "14px",
        background: "var(--blue-soft)",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: "0.625rem",
          textTransform: "uppercase",
          letterSpacing: "0.24em",
          color: "var(--ink)",
          flexShrink: 0,
          fontWeight: 600,
        }}
      >
        team
      </span>

      {/* Avatar stack */}
      <div style={{ display: "flex" }}>
        {unique.map((a, i) => {
          const palette = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div
              key={a.id}
              title={a.name}
              style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: palette.bg,
                border: "2px solid var(--bg-elev)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.625rem", fontWeight: 700,
                fontFamily: "JetBrains Mono, monospace",
                color: palette.color,
                marginLeft: i > 0 ? "-7px" : "0",
                zIndex: unique.length - i,
                position: "relative",
              }}
            >
              {a.name.slice(0, 2).toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* Count */}
      <span style={{ fontSize: "0.8125rem", color: "var(--text-dim)", fontFamily: "JetBrains Mono, monospace" }}>
        {unique.length} agent{unique.length !== 1 ? "s" : ""}
      </span>

      {/* Progress */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
        <div style={{ flex: 1, height: "3px", background: "var(--bg-elev3)", borderRadius: "3px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%", background: "var(--savings)", borderRadius: "3px",
              width: `${subtasks.length > 0 ? (doneCount / subtasks.length) * 100 : 0}%`,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <span style={{ fontSize: "0.6875rem", fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)", flexShrink: 0 }}>
          {doneCount}/{subtasks.length}
        </span>
      </div>

      {/* Working indicator */}
      {workingCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
          <span className="pulse-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--tier-sonnet)", flexShrink: 0 }} />
          <span style={{ fontSize: "0.6875rem", color: "var(--tier-sonnet)", fontFamily: "JetBrains Mono, monospace" }}>
            {workingCount} running
          </span>
        </div>
      )}
    </div>
  );
}
