# Sprint 01 - Product Alignment

## Prompt

You are working on AgentMarket, a Next.js full-stack MVP in `app/`.

The current repo has a product inconsistency: some parts describe a marketplace of individual agents, while the current UI and user journey increasingly position teams as the primary unit being rented. This sprint is about making the product legible and internally consistent without changing the core architecture.

Work only on alignment, not on deep new features.

### Goal

Make the product story coherent across UI copy, docs, navigation, and key API descriptions so a new user can immediately understand:

- what AgentMarket is
- whether they are renting teams, agents, or both
- how routing works
- what the main user flow is

### Scope

- Review the current app copy and docs.
- Decide the primary marketplace unit: `teams first, agents second`.
- Align headings, route descriptions, labels, helper text, and README content to that decision.
- Keep individual agents as a secondary pool and supporting concept.
- Make sure the homepage, orchestrate page, register page, and README tell the same story.

### Required outputs

- Updated `app/README.md`
- Updated root `README.md` only if needed for consistency
- Updated page copy in the key user-facing routes
- Clear navigation labels
- Short explanation in docs of how teams and agents relate

### Constraints

- Do not redesign the data model.
- Do not remove existing routes.
- Do not add auth, billing, or persistence.
- Do not change the orchestration logic unless necessary for copy accuracy.
- Prefer small text and structure changes over rewrites.

### Acceptance criteria

- A first-time reader can tell in under 30 seconds that AgentMarket rents teams that internally route subtasks across models.
- The role of individual agents is still visible but clearly secondary.
- README, home page, and orchestration page no longer contradict each other.
- Route descriptions match the real UI.

### Suggested work plan

1. Audit current messaging in `app/README.md`, root `README.md`, `app/src/app/page.tsx`, `app/src/app/orchestrate/page.tsx`, `app/src/app/register/page.tsx`, and nav components.
2. Define one canonical positioning sentence and reuse it everywhere.
3. Update docs and page copy.
4. Run a quick smoke pass for broken text assumptions.
5. Commit with a docs/product-alignment message.

### Definition of done

The product feels like one product again, not a half-finished pivot.