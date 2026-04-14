import { Agent, Orchestration } from "./types";
import { MOCK_AGENTS, DEMO_ORCHESTRATION } from "./mock-data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === "true" || true;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Agents ──────────────────────────────────────────────────────────────────

export async function getAgents(): Promise<Agent[]> {
  if (USE_MOCK) return MOCK_AGENTS;
  return apiFetch<Agent[]>("/agents");
}

export async function getAgent(id: string): Promise<Agent | undefined> {
  if (USE_MOCK) return MOCK_AGENTS.find((a) => a.id === id);
  return apiFetch<Agent>(`/agents/${id}`);
}

export async function registerAgent(githubUrl: string): Promise<Agent> {
  if (USE_MOCK) {
    // Simulate a new agent registration
    await new Promise((r) => setTimeout(r, 1500));
    return {
      id: "new-agent-" + Date.now(),
      name: "new-registered-agent",
      description: "Freshly registered agent from GitHub.",
      github_url: githubUrl,
      owner: "github-user",
      avatar: "NA",
      primary_tier: "sonnet",
      skills: ["general", "coding"],
      metrics: {
        avg_tokens_per_task: { haiku: 400, sonnet: 1200, opus: 4000 },
        success_rate: 0.75,
        tasks_completed: 0,
      },
      quality_score: 0.6,
      wallet: "0x0000000000000000000000000000000000000000",
      registered_at: new Date().toISOString(),
    };
  }
  return apiFetch<Agent>("/register", {
    method: "POST",
    body: JSON.stringify({ github_url: githubUrl }),
  });
}

// ── Orchestration ────────────────────────────────────────────────────────────

export async function runOrchestration(goal: string): Promise<Orchestration> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { ...DEMO_ORCHESTRATION, goal, id: "orch-" + Date.now() };
  }
  return apiFetch<Orchestration>("/orchestrate", {
    method: "POST",
    body: JSON.stringify({ goal }),
  });
}

// SSE stream for real-time orchestration updates
export function streamOrchestration(
  goal: string,
  onEvent: (event: Partial<Orchestration>) => void,
  onDone: () => void,
): () => void {
  const ctrl = new AbortController();

  fetch(`${BASE_URL}/orchestrate/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal }),
    signal: ctrl.signal,
  })
    .then((res) => {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      function read() {
        reader?.read().then(({ done, value }) => {
          if (done) { onDone(); return; }
          const text = decoder.decode(value);
          const lines = text.split("\n").filter((l) => l.startsWith("data:"));
          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(5));
              onEvent(data);
            } catch {}
          }
          read();
        });
      }
      read();
    })
    .catch(() => {});

  return () => ctrl.abort();
}
