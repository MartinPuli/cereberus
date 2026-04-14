"use client";

import { useState, useRef } from "react";
import { Orchestration, SubTask, ModelTier } from "@/lib/types";
import { DEMO_ORCHESTRATION } from "@/lib/mock-data";
import { TaskRow } from "@/components/TaskRow";
import { SavingsPanel } from "@/components/SavingsPanel";
import { TxHashLink } from "@/components/TxHashLink";
import { ModelTierBadge } from "@/components/ModelTierBadge";
import { TIER_DESC, formatEth, cn } from "@/lib/utils";
import { Play, Loader2, RotateCcw, CheckCircle2, ChevronRight } from "lucide-react";

type State = "idle" | "running" | "done";

const SAMPLES = [
  "Launch a new SaaS product: design the pricing architecture, write the landing page copy, and format the FAQ section.",
  "Create developer docs: outline the system architecture, write the getting-started guide, and format the quick-reference cheatsheet.",
  "Build a marketing campaign: develop the brand strategy, write the email sequence, and format the social media schedule.",
];

function simulate(
  goal: string,
  setOrch: React.Dispatch<React.SetStateAction<Orchestration | null>>,
  setDone: () => void,
) {
  const base = DEMO_ORCHESTRATION;
  const empty: SubTask[] = base.tasks.map((t) => ({
    ...t, status: "queued", tier: null, actual_tokens: 0, cost_eth: 0,
  }));

  setOrch({ ...base, goal, id: "orch-" + Date.now(), status: "running", tasks: empty, naive_cost_eth: 0, actual_cost_eth: 0, saved_pct: 0, tx_hash: null });

  const patch = (fn: (prev: Orchestration | null) => Orchestration | null) => setOrch(fn);

  const steps: [number, () => void][] = [
    [350,  () => patch((p) => p ? { ...p, tasks: p.tasks.map((t, i) => i === 0 ? { ...t, status: "classifying" } : t) } : p)],
    [900,  () => patch((p) => p ? { ...p, tasks: p.tasks.map((t, i) => i === 0 ? { ...t, status: "working", tier: base.tasks[0].tier, tier_reason: base.tasks[0].tier_reason } : i === 1 ? { ...t, status: "classifying" } : t) } : p)],
    [1600, () => patch((p) => p ? { ...p, tasks: p.tasks.map((t, i) => i === 0 ? { ...t, status: "done", tier: base.tasks[0].tier, actual_tokens: base.tasks[0].actual_tokens, cost_eth: base.tasks[0].cost_eth, naive_cost_eth: base.tasks[0].naive_cost_eth } : i === 1 ? { ...t, status: "working", tier: base.tasks[1].tier } : i === 2 ? { ...t, status: "classifying" } : t) } : p)],
    [2600, () => patch((p) => p ? { ...p, tasks: p.tasks.map((t, i) => i === 1 ? { ...t, status: "done", tier: base.tasks[1].tier, actual_tokens: base.tasks[1].actual_tokens, cost_eth: base.tasks[1].cost_eth, naive_cost_eth: base.tasks[1].naive_cost_eth } : i === 2 ? { ...t, status: "working", tier: base.tasks[2].tier } : t) } : p)],
    [3400, () => {
      patch((p) => p ? { ...p, status: "completed", tasks: p.tasks.map((t, i) => i === 2 ? { ...t, status: "done", tier: base.tasks[2].tier, actual_tokens: base.tasks[2].actual_tokens, cost_eth: base.tasks[2].cost_eth, naive_cost_eth: base.tasks[2].naive_cost_eth } : t), naive_cost_eth: base.naive_cost_eth, actual_cost_eth: base.actual_cost_eth, saved_pct: base.saved_pct, tx_hash: base.tx_hash } : p);
      setDone();
    }],
  ];

  steps.forEach(([ms, fn]) => setTimeout(fn, ms));
}

export default function OrchestratePage() {
  const [goal, setGoal]   = useState(SAMPLES[0]);
  const [state, setState] = useState<State>("idle");
  const [orch, setOrch]   = useState<Orchestration | null>(null);
  const resultsRef        = useRef<HTMLDivElement>(null);

  function run() {
    if (!goal.trim() || state === "running") return;
    setState("running");
    setOrch(null);
    simulate(goal, setOrch, () => setState("done"));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
  }

  function reset() {
    setState("idle");
    setOrch(null);
  }

  const done = orch?.tasks.filter((t) => t.status === "done") ?? [];
  const liveNaive  = done.reduce((a, t) => a + t.naive_cost_eth, 0);
  const liveActual = done.reduce((a, t) => a + t.cost_eth, 0);
  const livePct    = liveNaive > 0 ? ((liveNaive - liveActual) / liveNaive) * 100 : 0;

  return (
    <div className="page-container">
      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

        {/* ── Left ─────────────────────────────── */}
        <div className="space-y-7">

          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-ink">Orchestrator</h1>
            <p className="mt-1 text-sm text-ink-2">
              Enter a goal. Gnomos decomposes it, classifies each subtask, and routes to the
              right model automatically.
            </p>
          </div>

          {/* Input */}
          <div className="space-y-3">
            <label className="label">Your goal</label>
            <textarea
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Launch a SaaS product: design pricing, write landing page, format FAQ…"
              className="field-lg resize-none"
              disabled={state === "running"}
            />

            {/* Samples */}
            <div className="flex flex-wrap gap-1.5">
              {SAMPLES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setGoal(s)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-lg border transition-colors",
                    goal === s
                      ? "bg-gnomo-soft border-gnomo/20 text-gnomo"
                      : "bg-page border-line text-ink-3 hover:text-ink-2 hover:border-line-strong",
                  )}
                >
                  Sample {i + 1}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={run} disabled={!goal.trim() || state === "running"} className="btn-primary">
                {state === "running"
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Routing…</>
                  : <><Play className="w-3.5 h-3.5" />Run<ChevronRight className="w-3.5 h-3.5" /></>
                }
              </button>
              {orch && (
                <button onClick={reset} className="btn-secondary">
                  <RotateCcw className="w-3.5 h-3.5" />Reset
                </button>
              )}
            </div>
          </div>

          {/* Tier legend */}
          <div className="flex flex-wrap gap-3 text-xs text-ink-3 border-t border-line pt-5">
            {(["haiku", "sonnet", "opus"] as ModelTier[]).map((t) => (
              <div key={t} className="flex items-center gap-2">
                <ModelTierBadge tier={t} size="sm" />
                <span>{TIER_DESC[t]}</span>
              </div>
            ))}
          </div>

          {/* Results */}
          {orch && (
            <div ref={resultsRef} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="label">Subtasks</span>
                  <span className="text-xs text-ink-3">{done.length}/{orch.tasks.length}</span>
                </div>
                {state === "done" && orch.tx_hash && <TxHashLink hash={orch.tx_hash} />}
              </div>

              {orch.tasks.map((t, i) => (
                <TaskRow key={t.id} task={t} index={i} animated />
              ))}

              {state === "done" && (
                <div className="callout bg-haiku-soft border-haiku/15 text-haiku-text animate-slide-up">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Complete — {orch.saved_pct}% cheaper</p>
                    <p className="text-xs text-ink-2 mt-0.5">
                      Actual{" "}
                      <span className="font-mono text-haiku-text">{formatEth(orch.actual_cost_eth)}</span>
                      {" "}vs naive{" "}
                      <span className="font-mono text-bad">{formatEth(orch.naive_cost_eth)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── Right: savings panel ─────────────── */}
        <div className="sticky top-16 space-y-4">
          <SavingsPanel
            naiveEth  = {orch?.naive_cost_eth  ?? liveNaive  || 0.0006923}
            actualEth = {orch?.actual_cost_eth ?? liveActual || 0.0001164}
            savedPct  = {orch?.saved_pct       ?? livePct    || 72.4}
            animate   = {state === "done"}
          />

          {/* Tier breakdown */}
          {done.length > 0 && (
            <div className="card-flat rounded-xl p-4 space-y-3">
              <p className="label">Tier breakdown</p>
              {(["opus", "sonnet", "haiku"] as ModelTier[]).map((tier) => {
                const tt = done.filter((t) => t.tier === tier);
                if (!tt.length) return null;
                return (
                  <div key={tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ModelTierBadge tier={tier} size="sm" />
                      <span className="text-xs text-ink-3">{tt.length}×</span>
                    </div>
                    <span className="text-xs font-mono text-ink-2">
                      {formatEth(tt.reduce((a, t) => a + t.cost_eth, 0))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
