"use client";

import { ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { shortenHash, cn } from "@/lib/utils";

export function TxHashLink({ hash, confirmed = true, className }: { hash: string; confirmed?: boolean; className?: string }) {
  return (
    <a
      href={`https://sepolia.etherscan.io/tx/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
        "bg-subtle border border-line hover:border-line-strong",
        "text-xs font-mono text-ink-2 hover:text-ink",
        "transition-colors duration-150 group",
        className,
      )}
    >
      {confirmed
        ? <CheckCircle2 className="w-3.5 h-3.5 text-ok flex-shrink-0" />
        : <Loader2 className="w-3.5 h-3.5 text-warn animate-spin flex-shrink-0" />
      }
      <span>tx {shortenHash(hash)}</span>
      <ExternalLink className="w-3 h-3 text-ink-3 group-hover:text-gnomo transition-colors" />
    </a>
  );
}
