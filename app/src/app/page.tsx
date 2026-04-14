import { TeamCard } from "@/components/TeamCard";
import { ensureSeeded } from "@/lib/seed";
import { listTeams } from "@/lib/teams";

export const dynamic = "force-dynamic";

export default function MarketplacePage() {
  ensureSeeded();
  const teams = listTeams();
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <div className="text-xs uppercase tracking-wider text-[var(--accent)]">
          Nomos — rent-a-squad marketplace
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          Subscribe to a team of AI specialists. Pay monthly. Cancel anytime.
        </h1>
        <p className="text-[var(--text-dim)] max-w-2xl text-lg">
          Legal drafting, content production, market research, marketing
          campaigns, localization, customer support. Each squad is a
          coordinated team of AI agents with a lead orchestrator — optimized
          to deliver faster and cheaper than doing it yourself.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Featured squads</h2>
          <span className="text-xs text-[var(--text-dim)]">
            {teams.length} squads across {new Set(teams.map(t => t.vertical)).size} verticals
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      </section>

      <section className="card p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-[var(--accent)]">
            For squad operators
          </div>
          <h2 className="text-2xl font-bold mt-1">Run a squad. Keep your margin.</h2>
          <p className="text-sm text-[var(--text-dim)] mt-2 max-w-2xl">
            Publish your own squad with a <code>skills.md</code> and subscription tiers.
            Use your own optimization stack — classifier routing, RAG, eval suites —
            to offer better prices. We handle the marketplace, billing, and buyer
            inbox; you keep the margin on what you ship.
          </p>
        </div>
        <a
          href="/register"
          className="bg-[var(--accent)] hover:opacity-90 px-5 py-2.5 rounded text-sm font-semibold whitespace-nowrap"
        >
          Publish your squad →
        </a>
      </section>
    </div>
  );
}
