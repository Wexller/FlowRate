# Codex Implementation Spec For FlowRate

## 1. Purpose

This document defines how Codex should implement `FlowRate` from the existing product and design specifications.

It is an execution brief, not a replacement for the core specs.

## 2. Inputs

Codex must treat these documents as mandatory inputs:

1. [conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md)
2. [conversion-dashboard-design-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-design-spec.md)
3. [AGENTS.md](/Users/workspace/Projects/self/FlowRate/AGENTS.md)

## 3. Implementation Objective

Build a Nuxt 4 MVP that:
- stores dashboard state in local JSON files;
- exposes typed Nitro API endpoints for reading and mutating dashboard data;
- renders a single-screen conversion dashboard;
- updates conversions immediately after counter changes;
- supports `ru` and `en`;
- is covered by domain, API, and UI-oriented verification where practical.

## 4. Delivery Priorities

Codex should implement the project in this order:

1. Project scaffold and base configuration
2. Domain schemas and conversion logic
3. File storage and safe write behavior
4. Nitro API endpoints
5. Frontend data flow and screen composition
6. UI implementation aligned with the design spec
7. i18n content
8. Tests
9. Final documentation pass

## 5. Architectural Constraints

### 5.1 Must Use

- `Nuxt 4`
- `TypeScript`
- `Nuxt Nitro`
- i18n
- JSON file storage
- schema validation for persisted and API data

### 5.2 Must Not Introduce For MVP

- Postgres
- Google Sheets
- external job systems
- background queues
- auth and role systems unless explicitly requested later
- large-scale dashboard infrastructure beyond the defined scope

## 6. Suggested Repository Shape

The exact structure may evolve, but the implementation should converge toward something close to:

```text
.
├── AGENTS.md
├── README.md
├── app/
│   ├── app.vue
│   ├── components/
│   ├── composables/
│   ├── pages/
│   └── assets/
├── server/
│   ├── api/
│   ├── utils/
│   └── domain/
├── shared/
│   ├── schemas/
│   ├── types/
│   └── constants/
├── data/
│   └── jobflow/
├── i18n/
├── test/
└── docs/
```

Suggested intent by area:

- `server/domain`: dashboard business logic
- `server/utils`: persistence, locks, atomic writes, helpers
- `server/api`: Nitro route handlers
- `shared/schemas`: Zod schemas shared by server and app
- `app/components`: dashboard UI blocks
- `app/composables`: fetching, state sync, view logic
- `test`: unit and API behavior tests

## 7. Required Domain Modules

Codex should introduce explicit modules for:

- counter validation;
- conversion calculation;
- state normalization;
- aggregate period typing;
- dashboard storage read/write operations.

Recommended schemas:

- `DashboardCounters`
- `DashboardConversions`
- `DashboardState`
- `DashboardAggregatePoint`

## 8. Backend Requirements

### 8.1 Current State

Implement:

- `GET /api/dashboard/current`
- `PUT /api/dashboard/current`
- `POST /api/dashboard/counters/:counterKey/increment`
- `POST /api/dashboard/counters/:counterKey/decrement`

### 8.2 Aggregates

Implement:

- `GET /api/dashboard/aggregates?period=daily|weekly|monthly&from=YYYY-MM-DD&to=YYYY-MM-DD`

### 8.3 Persistence Rules

- Read from `data/jobflow/current.json`
- Create missing directories and base files when needed
- Use atomic writes through temp file plus rename
- Protect write paths with a process-local mutex or equivalent guard

### 8.4 Validation Rules

Reject invalid payloads that:

- are not integers where integers are required;
- contain negative values;
- violate funnel ordering;
- use unsupported `counterKey` or `period` values.

## 9. Frontend Requirements

### 9.1 Screen Composition

The MVP should render a single main dashboard page with:

- top status bar;
- hero summary;
- three conversion cards;
- counters editor;
- pipeline visualization;
- aggregates/history block.

### 9.2 UX Rules

- counter changes should feel immediate;
- zero state should look intentional;
- invalid edits should show inline feedback;
- save state should be visible but not noisy;
- all user-facing strings must be localized.

### 9.3 UI Strategy

- Prefer `Nuxt UI` as the default component system
- Use `PrimeVue` only when it provides clearly better UX for number inputs or charts
- Follow the ocean-blue design system from the design spec

## 10. Testing Requirements

### 10.1 Domain Tests

Cover:

- conversion calculations;
- zero-base behavior;
- negative-value rejection;
- ordering-rule rejection.

### 10.2 API Tests

Cover:

- reading current state;
- full-state update;
- increment and decrement behavior;
- aggregate query response shape.

### 10.3 UI Verification

At minimum verify:

- conversion block shows both percent and ratio;
- counter edits trigger immediate recalculation;
- zero state displays cleanly;
- i18n switching works for `ru` and `en`.

## 11. Documentation Requirements

Codex must keep the repo documented while implementing.

Required updates:

- `README.md` when commands, setup, or structure become real
- `docs/README.md` when document inventory changes
- relevant specs if implementation decisions require clarifications

Do not leave undocumented behavior that future work depends on.

## 12. Delivery Milestones

### Milestone 1: Foundation

- initialize Nuxt app
- add dependencies
- add basic repo structure
- set up i18n and shared schemas

### Milestone 2: Domain And Storage

- implement schemas
- implement conversion logic
- implement JSON persistence
- add safe write behavior

### Milestone 3: API

- add current-state endpoints
- add counter mutation endpoints
- add aggregate endpoint
- verify API behavior

### Milestone 4: UI

- build dashboard layout
- implement conversion cards
- implement counters editor
- implement pipeline block
- implement history block

### Milestone 5: Quality Pass

- add or complete tests
- polish states and i18n
- update docs and README

## 13. Definition Of Completion

Codex should consider the project implementation ready for MVP review only when:

- all required endpoints exist;
- the dashboard page works end to end;
- counter invariants are enforced;
- file storage is safe;
- the UI matches the intended structure and design direction;
- documentation reflects the real repository state;
- verification has been run or any gap is explicitly documented.
