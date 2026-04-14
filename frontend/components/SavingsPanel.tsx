"use client";

import { useEffect, useRef, useState } from "react";
import { formatEth, formatUsd, cn } from "@/lib/utils";

interface Props {
  naiveEth:  number;
  actualEth: number;
  savedPct:  number;
  animate?:  boolean;
}

function useCountUp(target: number, ms = 1100, go = true) {
  const [v, setV] = useState(go ? 0 : target);
  const raf = useRef(0);
  useEffect(() => {
    if (!go) { setV(target); return; }
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / ms, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(target * ease);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms, go]);
  return v;
}

export function SavingsPanel({ naiveEth, actualEth, savedPct, animate = false }: Props) {
  const pct    = useCountUp(savedPct, 1100, animate);
  const saved  = useCountUp(naiveEth - actualEth, 1100, animate);
  const ratio  = naiveEth > 0 ? actualEth / naiveEth : 0.28;

  return (
    <div className="card-flat rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-line">
        <p className="text-sm font-medium text-ink">Cost comparison</p>
        <span className="text-2xs font-mono text-ink-3 bg-subtle px-2 py-0.5 rounded-md border border-line">
          live
        </span>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Big savings number */}
        <div className="text-center">
          <p
            className={cn(
              "text-5xl font-black font-mono tabular-nums leading-none",
              pct >= 50 ? "text-haiku-text" : "text-warn",
            )}
          >
            {pct.toFixed(1)}%
          </p>
          <p className="text-sm text-ink-2 mt-2">cheaper than Opus-for-everything</p>
          <p className="text-xs text-ink-3 mt-1 font-mono">
            saved {formatEth(saved)} · {formatUsd(saved)}
          </p>
        </div>

        {/* Bar comparison */}
        <div className="space-y-3">
          {/* Naive */}
          <div>
            <div className="flex justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs text-ink-2">
                <span className="w-2 h-2 rounded-full bg-bad/50 flex-shrink-0" />
                Naive — all Opus
              </div>
              <span className="text-xs font-mono text-ink-2">{formatEth(naiveEth)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-ui">
              <div className="h-full rounded-full bg-bad/30 w-full" />
            </div>
          </div>

          {/* Routed */}
          <div>
            <div className="flex justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs text-ink-2">
                <span className="w-2 h-2 rounded-full bg-haiku flex-shrink-0" />
                Routed — Gnomos
              </div>
              <span className="text-xs font-mono text-haiku-text font-medium">{formatEth(actualEth)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-ui overflow-hidden">
              <div
                className="h-full rounded-full bg-haiku transition-all duration-1000"
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="callout bg-gnomo-soft border-gnomo/15 text-gnomo text-xs py-2.5">
          <span>
            At 10k tasks/day → saves{" "}
            <span className="font-semibold font-mono">
              {formatUsd((naiveEth - actualEth) * 10000)}/day
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
