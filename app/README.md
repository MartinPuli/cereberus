# Nomos

Compute-routed marketplace for specialist teams. Users primarily rent pre-assembled teams; each team decomposes a goal, classifies each subtask by complexity (using a `skill_hint` as a strong prior), routes it to the cheapest Claude model that can still do the work well, assigns it to the right specialist, and shows live savings vs a naive all-Opus baseline.

This directory is the canonical Nomos product.

Individual agents exist in the marketplace as the supply layer. They can be browsed, registered from GitHub, and assembled into teams, but the main customer-facing workflow is team-first.

## Setup

```bash
pnpm install
cp .env.local.example .env.local   # set ANTHROPIC_API_KEY
pnpm dev
```

Open http://localhost:3000.

## Verification

```bash
pnpm test
```

Runs the Vitest suite covering pricing, routing, and GitHub registration helpers.

## Environment

- `ANTHROPIC_API_KEY` — required for classify, orchestrate, and subagent execution.
- `GITHUB_TOKEN` — optional but recommended for `/api/register`; without it, GitHub rate limits to 60 req/hr.
- `MOCK_MODE=1` — disables live GitHub registration, keeps the app in fixtures-only mode.
- `FORCE_ROUTING=pricing=complex,landing=moderate,faq=simple` — pins classifier output by keyword for demo safety.

## Routes

- `/` — marketplace homepage: teams (primary) + individual agents (secondary)
- `/squads/[slug]` — squad detail with member list, subscription tiers, and CTA
- `/squads/[slug]/quote` — subscription quote and checkout flow
- `/orchestrate` — live orchestration dashboard, SSE-streamed; accepts `?team=<id>`
- `/inbox` — buyer inbox: pending quotes and active subscriptions
- `/onboarding` — multi-step buyer context form
- `/assets` — asset manager (images, fonts, colors, documents) backed by Vercel Blob
- `/agents/[id]` — agent detail with per-tier token metrics and pricing
- `/teams/[id]` — team detail (legacy alias; prefer `/squads/[slug]`)
- `/register` — register any GitHub repo as an agent in the marketplace pool

## API

- `GET /api/teams` — list squads sorted by quality
- `GET /api/teams/[id]` — team detail with members
- `GET /api/agents` — list agents sorted by quality
- `GET /api/agents/[id]` — agent detail
- `GET /api/runs` — list past orchestration runs (in-memory, resets on cold start)
- `GET /api/assets` — list uploaded assets
- `POST /api/assets` — upload a new asset (multipart/form-data)
- `GET /api/assets/[id]` — asset detail
- `POST /api/classify` — `{description, skill_hint?}` → `{tier, reason, estimated_tokens}`
- `POST /api/orchestrate` — `{goal, team_id?}` → SSE stream of events (`run_created`, `decomposed`, `classified`, `agent_assigned`, `task_started`, `task_completed`, `run_completed`). When `team_id` is set, routing is scoped to that team's members.
- `POST /api/register` — `{github_url}` → agent record (reads `skills.md`, `memory/metrics.json`, 90d commits)

Error shape for JSON routes:

```json
{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "goal is required"
  }
}
```

## Product model

- Teams are the primary marketplace unit users rent.
- Agents are the underlying specialists teams are built from.
- Routing is the core product behavior that determines cost efficiency.
- Registration currently onboards agents, not whole teams.
- Agents are visually distinguished as fixture-backed or GitHub-backed in the marketplace.

## Demo goal

> Launch a new SaaS product: design the pricing tier architecture, write the landing page headline and hero copy, and format a 5-question FAQ section from these raw notes.

Recommended team: **Content Engine** (`content-engine`) or **Brand Marketing** (`brand-marketing`).

## Demo flow

1. User lands on `/` and picks a squad, e.g. *Content Engine*
2. Clicks the team CTA on the squad detail page
3. On `/orchestrate?team=content-engine`, pastes the goal above
4. Runs the team
5. Watches tasks classify live (OPUS / SONNET / HAIKU badges) and the savings panel tick up

## Deploy

```bash
vercel --prod
```

Set `ANTHROPIC_API_KEY` (required) and optionally `GITHUB_TOKEN` in the Vercel project. Root Directory must be `app/` since the Next.js project is a subdirectory of the monorepo.

## Architecture

```text
goal + team_id ──▶ orchestrator (Sonnet, tool_use) ──▶ 3-5 subtasks + skill_hints
                                                              │
           per subtask:                                       ▼
             classifier (Haiku, JSON) ◀── skill_hint ──▶ tier (simple|moderate|complex)
             router ──▶ model + agent FROM TEAM POOL
             subagent executor (Haiku|Sonnet|Opus) ──▶ result
                                                              │
                                                              ▼
                                                  pricing engine + savings panel
```

The `skill_hint` (e.g. `"formatting"`, `"drafting"`, `"research"`) is produced by the orchestrator and passed directly to the classifier, acting as a strong prior that prevents topic-complexity bias — a formatting task stays `simple→Haiku` even when its subject matter spans multiple jurisdictions.
