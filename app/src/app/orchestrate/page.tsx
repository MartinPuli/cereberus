"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ExecutionStepper } from "@/components/ExecutionStepper";
import { SavingsPanel } from "@/components/SavingsPanel";
import { TaskRow } from "@/components/TaskRow";
import { TeamHeader } from "@/components/TeamHeader";
import type { Agent, OrchestrationEvent, SubTask, Team } from "@/lib/types";

const DEFAULT_GOAL =
  "Launch a new SaaS product: design the pricing tier architecture, write the landing page headline and hero copy, and format a 5-question FAQ section from these raw notes: 'How much? Monthly. Cancel anytime. Who owns data? Customer does. Refunds? 30-day. Enterprise? Yes.'";

const DEMO_PRESETS = [
  {
    label: "Launch demo",
    value: DEFAULT_GOAL,
  },
  {
    label: "Architecture memo",
    value:
      "Evaluate a B2B analytics platform: analyze the ingestion architecture, propose a pricing and packaging model, and rewrite the customer-facing summary for the launch memo.",
  },
  {
    label: "Content ops",
    value:
      "Turn these product notes into a multilingual FAQ, summarize the support issues into 5 bullet insights, and draft a short launch thread for social channels.",
  },
];

interface TeamDetailResponse {
  team: Team;
  members: Agent[];
}

interface ApiErrorResponse {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
}

function OrchestrateInner() {
  const params = useSearchParams();
  const teamId = params.get("team");
  const goalParam = params.get("goal");

  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [totals, setTotals] = useState({ naive: 0, actual: 0, savedPct: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goalParam?.trim()) {
      setGoal(goalParam);
    }
  }, [goalParam]);

  useEffect(() => {
    if (teamId) {
      fetch(`/api/teams/${teamId}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.success) {
            const data = j.data as TeamDetailResponse;
            setTeam(data.team);
            setAgents(data.members);
          }
        });
    } else {
      fetch("/api/agents")
        .then((r) => r.json())
        .then((j) => setAgents(j.data ?? []));
    }
  }, [teamId]);

  const agentsById = useMemo(
    () => new Map(agents.map((a) => [a.id, a])),
    [agents],
  );

  async function run() {
    setSubtasks([]);
    setTotals({ naive: 0, actual: 0, savedPct: 0 });
    setRunning(true);
    setFinished(false);
    setError(null);

    let res: Response;
    try {
      res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ goal, team_id: teamId ?? undefined }),
      });
    } catch {
      setError("Unable to reach the orchestrator. Check your network and try again.");
      setRunning(false);
      return;
    }
    if (!res.ok || !res.body) {
      let message = "orchestrate request failed";
      try {
        const payload = (await res.json()) as ApiErrorResponse;
        message = payload.error?.message ?? message;
      } catch {
        // Keep the fallback message when the response is not JSON.
      }
      setError(message);
      setRunning(false);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop() ?? "";
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const json = line.replace(/^data:\s*/, "");
        const ev = JSON.parse(json) as OrchestrationEvent;
        setSubtasks((prev) => applyEvent(prev, ev));
        if (ev.type === "run_completed") {
          setTotals({
            naive: ev.total_naive_eth,
            actual: ev.total_actual_eth,
            savedPct: ev.saved_pct,
          });
          setFinished(true);
        } else if (ev.type === "error") {
          setError(ev.message);
        }
      }
    }
    setRunning(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <header style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", margin: 0 }}>
          Orchestrator
        </h1>
        <p style={{ color: "var(--text-dim)", maxWidth: "560px", lineHeight: 1.6, fontSize: "0.9rem", margin: 0 }}>
          Give the orchestrator a goal. It decomposes it into subtasks, classifies each by complexity,
          and routes each to the cheapest Claude model that can do it well.
        </p>
      </header>

      <div className="card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--accent)]">
              Demo presets
            </div>
            <div className="text-sm text-[var(--text-dim)]">
              Use a mixed-complexity goal to make routing and savings obvious on screen.
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setGoal(preset.value)}
                className="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg-elev2)] text-xs hover:border-[var(--accent)] hover:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-[var(--text-dim)]">
          Strongest live path: run a selected team and use the launch preset so Nomos shows Haiku, Sonnet, and Opus in one pass.
        </div>
      </div>

      <ExecutionStepper subtasks={subtasks} running={running} finished={finished} />

      {team && (
        <div
          className="card"
          style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px", borderColor: "rgba(107,92,231,0.3)" }}
        >
          <div style={{ fontSize: "1.5rem", lineHeight: 1, flexShrink: 0 }}>{team.cover_emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent)", marginBottom: "2px" }}>
              Team selected
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {team.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {agents.length} agents · avg {team.avg_savings_pct.toFixed(1)}% savings
            </div>
          </div>
          <Link
            href={`/teams/${team.id}`}
            style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none", flexShrink: 0 }}
          >
            view team →
          </Link>
        </div>
      )}

      <div className="card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={4}
          style={{
            width: "100%", background: "var(--bg-elev2)", border: "1px solid var(--border)",
            borderRadius: "8px", padding: "12px 14px", fontSize: "0.875rem",
            resize: "none", outline: "none", color: "var(--text)", lineHeight: 1.6,
            fontFamily: "inherit",
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(107,92,231,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
          placeholder="Describe your goal…"
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={run}
            disabled={running || !goal.trim()}
            style={{
              padding: "9px 20px", borderRadius: "9px",
              background: "var(--accent)", color: "white",
              fontSize: "0.875rem", fontWeight: 600, border: "none", cursor: "pointer",
              opacity: (running || !goal.trim()) ? 0.4 : 1,
            }}
          >
            {running ? "Routing…" : team ? `Run ${team.name}` : "Run orchestrator"}
          </button>
          {error && <div style={{ fontSize: "0.875rem", color: "#DC2626" }}>{error}</div>}
        </div>
        {!team && (
          <div className="text-xs text-[var(--text-dim)]">
            Marketplace mode can hire from the full pool, but the clearest demo path starts from a specific team page.
          </div>
        )}
      </div>

      {subtasks.length > 0 && (
        <SavingsPanel
          naive={totals.naive}
          actual={totals.actual}
          savedPct={totals.savedPct}
          live={running && !finished}
        />
      )}

      {subtasks.length > 0 && (
        <TeamHeader subtasks={subtasks} agentsById={agentsById} />
      )}

      <div className="flex flex-col gap-3">
        {subtasks.map((st) => (
          <TaskRow key={st.id} task={st} agent={agentsById.get(st.agent_id)} />
        ))}
      </div>
    </div>
  );
}

function applyEvent(prev: SubTask[], ev: OrchestrationEvent): SubTask[] {
  switch (ev.type) {
    case "decomposed":
      return ev.subtasks;
    case "classified":
      return prev.map((st) =>
        st.id === ev.subtask_id
          ? {
              ...st,
              classification: ev.classification,
              tier: ev.classification.tier,
              model: ev.model,
              status: "routed",
            }
          : st,
      );
    case "agent_assigned":
      return prev.map((st) =>
        st.id === ev.subtask_id ? { ...st, agent_id: ev.agent_id } : st,
      );
    case "task_started":
      return prev.map((st) =>
        st.id === ev.subtask_id ? { ...st, status: "working" } : st,
      );
    case "task_completed":
      return prev.map((st) =>
        st.id === ev.subtask_id
          ? {
              ...st,
              status: "done",
              actual_tokens: ev.actual_tokens,
              cost_eth: ev.cost_eth,
              output: ev.output,
            }
          : st,
      );
    case "task_failed":
      return prev.map((st) =>
        st.id === ev.subtask_id ? { ...st, status: "error", error: ev.error } : st,
      );
    default:
      return prev;
  }
}

export default function OrchestratePage() {
  return (
    <Suspense fallback={<div className="text-sm text-[var(--text-dim)]">Loading...</div>}>
      <OrchestrateInner />
    </Suspense>
  );
}
