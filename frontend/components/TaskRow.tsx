"use client";

import { SubTask, TaskStatus } from "@/lib/types";
import { ModelTierBadge } from "./ModelTierBadge";
import { TIER_COLORS, formatEth, cn } from "@/lib/utils";
import { CheckCircle2, Clock3, Loader2, AlertCircle, Zap } from "lucide-react";

const STATUS: Record<TaskStatus, { icon: React.ReactNode; label: string; color: string }> = {
  queued:      { icon: <Clock3   className="w-3.5 h-3.5" />, label: "Queued",       color: "text-ink-3"        },
  classifying: { icon: <Loader2  className="w-3.5 h-3.5 animate-spin" />, label: "Classifying…", color: "text-warn" },
  working:     { icon: <Loader2  className="w-3.5 h-3.5 animate-spin" />, label: "Working…",     color: "text-gnomo"    },
  done:        { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Done",        color: "text-haiku-text"   },
  error:       { icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Error",       color: "text-bad"          },
};

export function TaskRow({ task, index, animated = false }: { task: SubTask; index: number; animated?: boolean }) {
  const s = STATUS[task.status];
  const tc = task.tier ? TIER_COLORS[task.tier] : null;
  const savings = task.naive_cost_eth - task.cost_eth;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border border-line bg-page",
        "hover:border-line-strong transition-all duration-150",
        animated && "animate-slide-up",
      )}
      style={{ animationDelay: animated ? `${index * 70}ms` : undefined }}
    >
      {/* Index */}
      <span className="w-5 h-5 rounded-full bg-subtle text-ink-3 text-2xs font-mono flex items-center justify-center flex-shrink-0">
        {index + 1}
      </span>

      {/* Description */}
      <p className="flex-1 text-sm text-ink-2 min-w-0 leading-snug">{task.description}</p>

      {/* Tier */}
      <div className="w-20 flex-shrink-0 flex justify-end">
        {task.tier
          ? <ModelTierBadge tier={task.tier} size="sm" animated={task.status === "done" && animated} />
          : <span className="text-ink-4 text-xs font-mono">—</span>
        }
      </div>

      {/* Status */}
      <div className={cn("flex items-center gap-1 text-xs flex-shrink-0 w-28 justify-end", s.color)}>
        {s.icon}
        <span className="font-mono">{s.label}</span>
      </div>

      {/* Tokens */}
      {task.actual_tokens > 0 && (
        <div className="flex items-center gap-1 text-xs text-ink-3 font-mono flex-shrink-0 w-20 justify-end">
          <Zap className="w-3 h-3" />
          {task.actual_tokens.toLocaleString()}
        </div>
      )}

      {/* Cost + savings */}
      {task.status === "done" && tc && (
        <div className="flex flex-col items-end flex-shrink-0 min-w-[72px]">
          <span className={cn("text-xs font-mono font-medium", tc.text)}>
            {formatEth(task.cost_eth)}
          </span>
          {savings > 0.000001 && (
            <span className="text-2xs text-haiku-text font-mono">
              -{formatEth(savings)} saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
