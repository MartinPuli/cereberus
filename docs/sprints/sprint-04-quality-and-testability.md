# Sprint 04 - Quality and Testability

## Prompt

You are working on AgentMarket, a live AI-heavy MVP. The biggest current risk is not static typing; it is behavioral regressions in pricing, routing, parsing, and orchestration paths.

This sprint is about adding a thin but meaningful quality layer so the team can move faster without guessing whether the core logic still works.

### Goal

Add pragmatic automated checks around the highest-value logic and create a repeatable local verification path.

### Scope

- Add tests for pure logic first.
- Mock networked AI boundaries where needed.
- Add one or two integration-style checks for the API surface if feasible.
- Add lint or validation commands only if they help, not for ceremony.

### High-value areas to cover

- pricing calculations
- routing logic
- classifier output parsing and fallback
- GitHub URL parsing and metrics defaults
- team lookup and agent selection behavior

### Constraints

- Keep the test stack small.
- Do not try to fully simulate Anthropic.
- Do not spend the sprint on UI snapshot churn.
- Prefer deterministic tests over broad but flaky coverage.

### Acceptance criteria

- There is a documented test command in `app/package.json`.
- Core logic has meaningful automated coverage.
- The most likely regressions in pricing, routing, and parsing are caught automatically.
- The team can run one local verification command before a demo or push.

### Suggested work plan

1. Choose a minimal test runner suitable for the current stack.
2. Add tests for `pricing.ts`, `router.ts`, `github.ts`, and parsing-heavy helpers.
3. Add a small integration check for at least one API route if practical.
4. Document how to run verification locally.
5. Keep the suite fast.

### Definition of done

Core product logic can regress only if someone ignores failing checks.