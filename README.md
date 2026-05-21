# FlowRate

FlowRate is a documentation-first Nuxt application for manually tracking funnel counters and instantly calculating conversion rates.

The project is intentionally narrow in scope: it is not a CRM, analytics warehouse, or recruiting platform. It is a focused dashboard for fast manual updates, immediate recalculation, and lightweight local persistence.

## Status

Current status: planning and specification phase.

The repository currently contains the product specification, design specification, and implementation rules that will guide the build. The application scaffold and runtime code are expected to be added next.

## Goals

- Track four required counters:
  - `applications`
  - `replies`
  - `interviews`
  - `offers`
- Compute three required conversion rates:
  - `replyRate`
  - `interviewRate`
  - `offerRate`
- Recalculate conversions immediately after every counter change
- Persist current state locally as JSON
- Provide lightweight historical aggregates by day, week, and month
- Support both Russian and English UI copy through i18n

## Non-Goals For MVP

- No PostgreSQL
- No Google Sheets integration
- No CRM workflow management
- No vacancy database as the product core
- No multi-user collaboration or auth requirements

## Planned Stack

- `Nuxt 4`
- `TypeScript`
- `Nuxt i18n`
- `Nuxt UI` as the primary component layer
- `PrimeVue` selectively for number inputs and charts if it materially improves UX
- `Zod` for schema validation
- JSON file storage through Nuxt Nitro server endpoints

## Product Summary

The application is based on a counters-first model. Users manually edit funnel counters, and the dashboard immediately reflects the new conversion percentages and ratios.

Required formulas:

- `replyRate = replies / applications`
- `interviewRate = interviews / applications`
- `offerRate = offers / applications`

Counter integrity rules:

- all values must be integers;
- all values must be non-negative;
- `applications >= replies >= interviews >= offers`.

## Planned UX Direction

The UI direction is a calm, premium analytics dashboard with an ocean-blue palette, large conversion cards, a comfortable counter editor, a pipeline visualization, and a history section for aggregate trends.

The design should feel focused and readable rather than generic or enterprise-heavy.

## Data Storage

The MVP uses local JSON files as its source of truth.

Expected structure:

```text
data/jobflow/
  current.json
  aggregates/
    daily/
    weekly/
    monthly/
```

Runtime override:

- `JOBFLOW_DATA_DIR`

## Planned API

Required endpoints:

- `GET /api/dashboard/current`
- `PUT /api/dashboard/current`
- `POST /api/dashboard/counters/:counterKey/increment`
- `POST /api/dashboard/counters/:counterKey/decrement`
- `GET /api/dashboard/aggregates?period=daily|weekly|monthly&from=YYYY-MM-DD&to=YYYY-MM-DD`

## Repository Structure

Current documented structure:

```text
.
├── AGENTS.md
├── README.md
└── docs/
    ├── README.md
    ├── codex-implementation-spec.md
    ├── conversion-dashboard-design-spec.md
    └── conversion-dashboard-mvp-spec.md
```

This structure will expand when the Nuxt application scaffold is added.

## Documentation Map

- [AGENTS.md](/Users/workspace/Projects/self/FlowRate/AGENTS.md): agent and engineering working rules
- [docs/README.md](/Users/workspace/Projects/self/FlowRate/docs/README.md): documentation index
- [docs/conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md): product and technical MVP scope
- [docs/conversion-dashboard-design-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-design-spec.md): UI and UX design specification
- [docs/codex-implementation-spec.md](/Users/workspace/Projects/self/FlowRate/docs/codex-implementation-spec.md): implementation execution brief for building the project

## Development Expectations

- Keep the architecture simple and local-first
- Prefer typed contracts and explicit validation
- Keep all user-facing text in i18n dictionaries
- Treat documentation updates as part of the implementation work
- Use tests for domain and API behavior as soon as the runtime code exists

## Getting Started

The application scaffold is not created yet. The next implementation phase should:

1. Initialize the Nuxt project structure.
2. Add TypeScript, i18n, schema validation, and UI dependencies.
3. Implement the dashboard domain model and JSON persistence.
4. Build the single-screen dashboard UI.
5. Add tests and verification scripts.
6. Update this README with real setup and run commands.

## Documentation Policy

This project is expected to remain fully documented.

At minimum, updates should keep these artifacts accurate:

- `README.md`
- `docs/README.md`
- product spec
- design spec
- implementation spec

## License

No license has been defined yet.
