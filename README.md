# FlowRate

FlowRate is a documentation-first Nuxt 4 application for manual funnel tracking and instant conversion calculation.

## Why It Exists

The MVP solves one focused problem: quickly update funnel counters and immediately see conversion rates without CRM overhead or external infrastructure.

## Current Status

Implemented MVP includes:
- Nuxt 4 + TypeScript app shell;
- file-based JSON storage with atomic writes and process-local write lock;
- typed Nitro API for current state, counter mutation, and aggregates;
- single-screen dashboard with a switchable snapshot card, counters editor, pipeline progress, and aggregates list;
- RU/EN localization via i18n;
- offline-safe UI setup without runtime font downloads;
- domain/API tests for core rules.

## Core Product Model

Required counters:
- `applications`
- `replies`
- `interviews`
- `offers`

Required conversions:
- `replyRate = replies / applications`
- `interviewRate = interviews / applications`
- `offerRate = offers / applications`

Invariants:
- all values are integers;
- all values are non-negative;
- `applications >= replies >= interviews >= offers`.

When `applications = 0`, all conversion rates return `0`.

## Architecture

High-level structure:

```text
.
├── app/
│   ├── components/
│   ├── composables/
│   ├── pages/
│   └── assets/
├── server/
│   ├── api/
│   ├── domain/
│   └── utils/
├── shared/
│   ├── constants/
│   ├── schemas/
│   └── utils/
├── i18n/
├── test/
├── data/
└── docs/
```

## Data Storage

Default data directory:
- `data/jobflow/`

Runtime override:
- `JOBFLOW_DATA_DIR`

Files:

```text
data/jobflow/
  current.json
  aggregates/
    daily/
    weekly/
    monthly/
```

`current.json` stores the latest counters and conversions.
Aggregates store period snapshots derived from state updates.

## API Overview

- `GET /api/dashboard/current`
- `PUT /api/dashboard/current`
- `POST /api/dashboard/counters/:counterKey/increment`
- `POST /api/dashboard/counters/:counterKey/decrement`
- `GET /api/dashboard/aggregates?period=daily|weekly|monthly&from=YYYY-MM-DD&to=YYYY-MM-DD`

## Setup

```bash
npm install
```

The app does not require external font providers to run locally.

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Production Build

```bash
npm run build
npm run preview
```

## Documentation Map

- [AGENTS.md](/Users/workspace/Projects/self/FlowRate/AGENTS.md)
- [docs/README.md](/Users/workspace/Projects/self/FlowRate/docs/README.md)
- [docs/conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md)
- [docs/conversion-dashboard-design-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-design-spec.md)
- [docs/codex-implementation-spec.md](/Users/workspace/Projects/self/FlowRate/docs/codex-implementation-spec.md)

## Development Expectations

- keep architecture explicit and local-first;
- preserve typed contracts and schema validation;
- keep UI strings in i18n files;
- update docs together with behavior changes.
