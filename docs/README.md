# Documentation Index

This directory contains the source-of-truth documents for `FlowRate` and should stay synchronized with implementation.

## Reading Order

1. [conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md)
2. [conversion-dashboard-design-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-design-spec.md)
3. [codex-implementation-spec.md](/Users/workspace/Projects/self/FlowRate/docs/codex-implementation-spec.md)

## Documents

### [conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md)

Defines product behavior, counter invariants, API and storage boundaries.

### [conversion-dashboard-design-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-design-spec.md)

Defines visual direction, layout structure, UX states, and responsive behavior.

### [codex-implementation-spec.md](/Users/workspace/Projects/self/FlowRate/docs/codex-implementation-spec.md)

Defines implementation sequence, architecture constraints, and delivery expectations.

### [snapshot-card-codex-brief.md](/Users/workspace/Projects/self/FlowRate/docs/snapshot-card-codex-brief.md)

Defines the implementation brief for the compact dashboard snapshot card with `rectangle` and `square` variants.

## Implementation Snapshot

Current repository implementation includes:
- Nuxt 4 scaffold and typed app/server modules;
- JSON storage with atomic write and write mutex;
- dashboard Nitro endpoints;
- RU/EN i18n UI dashboard;
- domain and API-oriented tests with Vitest.

## Maintenance Rule

When implementation changes setup, architecture, API shape, storage, UI behavior, or testing workflow, update the relevant docs in the same task.
