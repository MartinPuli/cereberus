# Sprint 03 - Data and Registration

## Prompt

You are working on AgentMarket, where the current MVP uses in-memory data plus fixture seeding. This is enough for a short demo, but it weakens repeatability and makes GitHub registration feel temporary.

This sprint is about making marketplace data and registration flows more trustworthy without overbuilding infrastructure.

### Goal

Strengthen how agents, teams, and registrations are represented so the demo feels intentional and the data model better supports future persistence.

### Scope

- Review fixture quality and realism.
- Improve the registration flow output and resulting agent records.
- Make team composition and team-level metrics easier to understand.
- Add lightweight persistence only if it stays simple and clearly improves the MVP.

### Good targets

- cleaner fixture data
- clearer team summaries
- registration success states
- display of source repo, skills, and token metrics
- optional file-based persistence for registered agents if the implementation stays small and safe

### Constraints

- Do not introduce a full database migration layer.
- Do not build user accounts.
- Do not add payment systems.
- Keep serverless deployment constraints in mind.

### Acceptance criteria

- Registered agents feel like first-class marketplace entities, not temporary objects.
- Teams have understandable composition and performance summaries.
- Fixture data looks curated rather than placeholder.
- If persistence is added, it is documented and minimal.

### Suggested work plan

1. Audit current fixture agents and teams.
2. Review how registration populates agent fields and defaults.
3. Improve detail pages and registration UX.
4. Add minimal persistence only if the value is clear and the implementation remains simple.
5. Update docs to reflect the new data behavior.

### Definition of done

Marketplace data looks deliberate enough that a judge or early user would trust what they are seeing.