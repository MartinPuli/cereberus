# Sprint 02 - Runtime Hardening

## Prompt

You are working on AgentMarket, a Next.js full-stack MVP in `app/` with live orchestration, classifier calls, GitHub registration, and SSE streaming.

This sprint is about making the existing flow resilient enough for repeated demos and day-to-day development. Focus on failure handling, runtime safety, and predictable fallback behavior.

### Goal

Harden the runtime path so the app fails gracefully when Anthropic, GitHub, or user input behaves badly.

### Scope

- Validate request payloads on key API routes.
- Improve error messages returned to the frontend.
- Add safe fallback behavior where it already makes sense.
- Ensure SSE orchestration failures do not leave the UI in a confusing state.
- Review environment handling and make local setup less fragile.

### Priority areas

- `app/src/app/api/orchestrate/route.ts`
- `app/src/app/api/register/route.ts`
- `app/src/app/api/classify/route.ts`
- `app/src/lib/classifier.ts`
- `app/src/lib/orchestrator.ts`
- `app/src/lib/github.ts`
- `app/src/lib/config.ts`

### Required outputs

- Better request validation for `goal`, `team_id`, and `github_url`
- Consistent JSON error shape across APIs
- More robust handling of malformed classifier output and GitHub fetch failures
- Clear documentation of required and optional env vars
- Safer demo flags such as `MOCK_MODE` and `FORCE_ROUTING`

### Constraints

- Do not add a database.
- Do not replace SSE.
- Do not add heavyweight dependencies if small local utilities are enough.
- Do not hide errors silently unless that behavior is deliberate and documented.

### Acceptance criteria

- Invalid request payloads return actionable 4xx responses.
- GitHub registration fails with understandable messages instead of generic crashes.
- Classifier or orchestrator output edge cases do not break the whole run path.
- Local developers can understand env setup from docs without reading the source.

### Suggested work plan

1. Audit current API route error handling.
2. Standardize validation and response shapes.
3. Harden library-level parsing and network failure paths.
4. Update setup docs and examples.
5. Run smoke checks for register, classify, and orchestrate.

### Definition of done

The app is no longer demo-fragile in obvious ways.