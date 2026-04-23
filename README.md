# Nomos

**Compute-routed marketplace for specialist teams.** Users primarily rent teams, not raw agents. Each team receives a goal, decomposes it into subtasks, classifies each one by complexity, routes it to the cheapest Claude model that can still do the work well, and assigns it to the right specialist. Live savings vs a naive all-Opus baseline are the product proof.

> Nomos (νόμος) — Greek for *law, custom, order*. The law of compute routing.

Individual agents still matter, but as supply. They are browsable, registerable from GitHub, and can be assembled into teams. The customer-facing workflow is team-first.

## The idea

Most multi-agent systems overspend because they default to one strong model for everything. Nomos flips this:

1. A user rents a squad with a shared specialty.
2. The user hands the squad a goal.
3. The orchestrator decomposes it into 3 to 5 subtasks, each tagged with a `skill_hint`.
4. The classifier labels each subtask as `simple`, `moderate`, or `complex`, using the `skill_hint` as a strong prior.
5. The router maps that tier to the cheapest model that can do the work well.
6. A matching specialist inside the team or marketplace pool executes the task.
7. The savings panel shows naive all-Opus spend vs routed actual spend.

The moat is not the marketplace alone. The moat is the router. The marketplace is distribution.

## Product model

- Teams are the primary marketplace unit users rent.
- Agents are the underlying specialists teams are built from.
- Routing is the core product behavior that determines cost efficiency.
- GitHub registration currently onboards agents, not whole teams.

## Current implementation

The repo contains a working Next.js MVP under `app/`. Everything canonical is there.

Current implementation highlights:

- Team-first marketplace homepage with 7 verticals (legal, content, marketing, research, localization, support, ops)
- Individual agent pool as secondary inventory (15 agents across simple/moderate/complex tiers)
- Squad detail pages with subscription tier picker and quote flow
- Orchestration dashboard with SSE event streaming and live model badges
- Buyer onboarding flow and inbox for quote management
- Asset manager (images, fonts, colors, documents) backed by Vercel Blob
- MetaMask wallet integration for ETH-denominated task pricing
- Classifier, router, executor, pricing, and in-memory store in `app/src/lib`
- GitHub-based agent registration
- Vitest suite covering pricing, routing, and GitHub registration helpers

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind v4, Framer Motion |
| Backend | Next.js API routes, GitHub REST API, in-memory store, Vercel Blob |
| AI | `@anthropic-ai/sdk` — Haiku for classification, Sonnet for orchestration and moderate work, Opus for complex work |
| Wallet | MetaMask (`@metamask/connect-evm`), ETH-denominated pricing |
| Live UI | SSE streaming from `/api/orchestrate` |
| Registration | GitHub REST API reading `skills.md`, `memory/metrics.json`, and 90d commits |

## Repository layout

```text
nomos/
├── app/                               # Next.js 16 product (canonical source of truth)
│   ├── src/app/                       # Routes + API
│   ├── src/components/                # UI components
│   ├── src/lib/                       # classifier, router, orchestrator, executor, pricing, store
│   ├── src/fixtures/                  # seeded agents + teams
│   └── public/fonts/                  # Gordon Rounded typeface
└── README.md                          # this file
```

## Run locally

```bash
cd app
pnpm install
cp .env.local.example .env.local   # set ANTHROPIC_API_KEY
pnpm dev
```

Then open <http://localhost:3000>.

## Deploy to Vercel

1. Import `MartinPuli/nomos` on <https://vercel.com/new>.
2. Set **Root Directory** to `app`.
3. Set `ANTHROPIC_API_KEY`.
4. Optionally set `GITHUB_TOKEN`.
5. Deploy.

## Demo goal that shows max model spread

> Launch a new SaaS product: design the pricing tier architecture, write the landing page headline and hero copy, and format a 5-question FAQ section from these raw notes.

This naturally splits into Opus for pricing strategy, Sonnet for landing copy, and Haiku for FAQ formatting — demonstrating the full model spread in one run.

Recommended team: **Content Engine** (`content-engine`) or **Brand Marketing** (`brand-marketing`).

## Demo-safety flags

- `MOCK_MODE=1` disables GitHub registration and keeps the experience fixtures-only.
- `FORCE_ROUTING=pricing=complex,landing=moderate,faq=simple` pins classifier output by keyword if live classification drifts during a pitch.
