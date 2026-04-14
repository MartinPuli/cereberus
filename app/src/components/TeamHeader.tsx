import type { Agent, SubTask } from "@/lib/types";

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

  return (
    <div
      className="card slide-up"
      style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}
    >
      <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", flexShrink: 0 }}>
        Team assembled
      </span>

      {/* Avatar stack */}
      <div style={{ display: "flex", marginLeft: "2px" }}>
        {unique.map((a, i) => (
          <div
            key={a.id}
            title={a.name}
            style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "var(--accent-soft)",
              border: "2px solid var(--bg-elev)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6875rem", fontWeight: 700, fontFamily: "monospace",
              color: "var(--accent)",
              marginLeft: i > 0 ? "-8px" : "0",
              zIndex: unique.length - i,
              position: "relative",
            }}
          >
            {a.name.slice(0, 2).toUpperCase()}
          </div>
        ))}
      </div>

      <span style={{ fontSize: "0.8125rem", fontFamily: "monospace", color: "var(--text-dim)" }}>
        {unique.length} agent{unique.length !== 1 ? "s" : ""} hired
      </span>
    </div>
  );
}
