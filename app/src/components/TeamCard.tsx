import Link from "next/link";
import type { Team } from "@/lib/types";

const VERTICAL_LABEL: Record<string, string> = {
  legal: "Legal",
  content: "Content",
  marketing: "Marketing",
  research: "Research",
  localization: "Localization",
  support: "Support",
  operations: "Operations",
  design: "Design",
  data: "Data",
  accounting: "Accounting",
};

export function TeamCard({ team }: { team: Team }) {
  const startingTier = team.tiers[0];
  return (
    <Link
      href={`/squads/${team.slug}`}
      className="card card-hover p-5 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl leading-none">{team.cover_emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 rounded px-1.5 py-0.5">
              {VERTICAL_LABEL[team.vertical] ?? team.vertical}
            </span>
            <span className="text-[10px] text-[var(--text-dim)]">
              {team.languages.join(" · ").toUpperCase()}
            </span>
          </div>
          <div className="font-semibold truncate">{team.name}</div>
          <div className="text-xs text-[var(--text-dim)] truncate">
            {team.tagline}
          </div>
        </div>
      </div>
      <p className="text-sm text-[var(--text-dim)] line-clamp-2">
        {team.description}
      </p>
      <div className="flex items-center gap-3 text-[10px] text-[var(--text-dim)]">
        <span>★ {team.avg_rating.toFixed(1)}</span>
        <span>·</span>
        <span>{team.active_subscriptions} active subs</span>
        <span>·</span>
        <span>{team.avg_turnaround_hours}h avg turnaround</span>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--border)]">
        <div>
          <div className="text-[10px] uppercase text-[var(--text-dim)]">From</div>
          <div className="font-mono text-lg font-bold">
            ${startingTier.monthly_price_usd}
            <span className="text-xs text-[var(--text-dim)] font-normal">/mo</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-[var(--text-dim)]">SLA</div>
          <div className="font-mono text-sm">{startingTier.sla_hours}h</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-[var(--text-dim)]">Retention</div>
          <div className="font-mono text-sm">{(team.retention_rate * 100).toFixed(0)}%</div>
        </div>
      </div>
    </Link>
  );
}
