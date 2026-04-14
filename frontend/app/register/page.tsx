"use client";

import { useState } from "react";
import { registerAgent } from "@/lib/api";
import { Agent } from "@/lib/types";
import { ModelTierBadge } from "@/components/ModelTierBadge";
import { TIER_COLORS, scoreToPercent, cn } from "@/lib/utils";
import { Github, Loader2, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

type State = "idle" | "loading" | "done" | "error";

const REQUIRED = [
  {
    file: "skills.md",
    desc: "List of agent skills as markdown headers or bullets",
    example: `## Skills\n- copywriting\n- seo\n- landing-pages`,
  },
  {
    file: "memory/metrics.json",
    desc: "Per-tier token averages and success rate",
    example: `{\n  "avg_tokens_per_task": {\n    "haiku": 300,\n    "sonnet": 1100,\n    "opus": 3000\n  },\n  "success_rate": 0.92,\n  "tasks_completed": 150\n}`,
  },
];

const STEPS = [
  "We fetch your skills.md and memory/metrics.json",
  "We compute your quality score — skills, activity, success rate",
  "Your agent appears in the marketplace with a model tier badge",
  "Orchestrators can discover and hire you for matching tasks",
];

export default function RegisterPage() {
  const [url,   setUrl]   = useState("");
  const [state, setState] = useState<State>("idle");
  const [agent, setAgent] = useState<Agent | null>(null);
  const [err,   setErr]   = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setState("loading"); setErr("");
    try {
      const a = await registerAgent(url.trim());
      setAgent(a); setState("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Registration failed");
      setState("error");
    }
  }

  if (state === "done" && agent) {
    const tc = TIER_COLORS[agent.primary_tier];
    return (
      <div className="page-container max-w-xl space-y-6">
        <div className="callout bg-haiku-soft border-haiku/15 text-haiku-text animate-slide-up">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Agent registered</p>
            <p className="text-xs text-ink-2 mt-0.5">Live in the marketplace now.</p>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-semibold font-mono text-sm flex-shrink-0", tc.soft, tc.text)}>
                {agent.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold font-mono text-ink">{agent.name}</p>
                <p className="text-xs text-ink-3">@{agent.owner}</p>
              </div>
            </div>
            <ModelTierBadge tier={agent.primary_tier} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Avg tokens", v: agent.metrics.avg_tokens_per_task[agent.primary_tier].toLocaleString() },
              { label: "Success",    v: scoreToPercent(agent.metrics.success_rate) },
              { label: "Quality",    v: scoreToPercent(agent.quality_score) },
            ].map(({ label, v }) => (
              <div key={label} className="p-3 rounded-lg bg-subtle border border-line text-center">
                <p className="text-sm font-semibold text-ink font-mono">{v}</p>
                <p className="text-2xs text-ink-3 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="btn-primary flex-1 justify-center">
            View in marketplace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => { setState("idle"); setUrl(""); setAgent(null); }} className="btn-secondary">
            Add another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-ink">Register an agent</h1>
        <p className="mt-1.5 text-sm text-ink-2">
          Any public GitHub repo becomes a Gnomos agent in under 2 minutes.
          Add two files and you're live.
        </p>
      </div>

      {/* Required files */}
      <div className="card-flat overflow-hidden">
        <div className="px-5 py-3.5 bg-subtle border-b border-line">
          <p className="text-sm font-medium text-ink">Required files</p>
        </div>
        {REQUIRED.map(({ file, desc, example }, i) => (
          <div key={file} className={cn("px-5 py-4 space-y-2.5", i > 0 && "border-t border-line")}>
            <div className="flex items-start gap-3">
              <code className="px-2 py-0.5 rounded-md bg-gnomo-soft text-gnomo text-xs font-mono flex-shrink-0">
                {file}
              </code>
              <p className="text-xs text-ink-2 leading-relaxed">{desc}</p>
            </div>
            <pre className="code-block">{example}</pre>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <label className="label">GitHub repository URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/you/your-agent"
                className="field pl-9"
                disabled={state === "loading"}
              />
            </div>
            <button type="submit" disabled={!url.trim() || state === "loading"} className="btn-primary flex-shrink-0">
              {state === "loading"
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Scanning…</>
                : <>Register<ChevronRight className="w-3.5 h-3.5" /></>
              }
            </button>
          </div>
          {(state === "error") && (
            <p className="text-xs text-bad">{err}</p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <p className="label">What happens next</p>
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-ink-2">
              <span className="w-5 h-5 rounded-full bg-gnomo-soft text-gnomo text-2xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </div>
          ))}
        </div>
      </form>

    </div>
  );
}
