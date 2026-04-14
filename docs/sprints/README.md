# AgentMarket Sprint Prompts

This folder contains execution-ready sprint prompts for the current state of the AgentMarket repo.

These prompts are designed for a human+AI workflow:

- one sprint at a time
- one branch per sprint
- small, reviewable commits
- explicit acceptance criteria
- no speculative rewrites

## Recommended order

1. `sprint-01-product-alignment.md`
2. `sprint-02-runtime-hardening.md`
3. `sprint-03-data-and-registration.md`
4. `sprint-04-quality-and-testability.md`
5. `sprint-05-demo-and-launch.md`

## How to use

1. Open one sprint file.
2. Copy the prompt into your coding agent or use it as the sprint brief for the team.
3. Execute only the scoped work for that sprint.
4. Validate against the acceptance criteria before moving to the next sprint.

## Current repo assumptions

These sprints were written for the repo state where:

- the app lives in `app/`
- Next.js app routes and API routes already exist
- the product has partially pivoted from individual agents to teams
- orchestration, classification, routing, and GitHub registration are already implemented at MVP level
- persistence, tests, and demo hardening are still weak spots

## Working rule

Do not try to complete all sprints in one pass. The value of this pack is that each sprint has a tight scope and a concrete finish line.