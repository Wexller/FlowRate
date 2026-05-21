# AGENTS.md

## Mission

Build `FlowRate` as a documentation-first, production-minded Nuxt application for manual funnel tracking and instant conversion calculation.

The project must stay:
- simple;
- typed;
- testable;
- fully documented;
- easy for a future engineer or agent to continue without hidden context.

## Source Of Truth

Implementation must follow these documents in order:

1. [docs/conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md)
2. [docs/conversion-dashboard-design-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-design-spec.md)
3. [docs/codex-implementation-spec.md](/Users/workspace/Projects/self/FlowRate/docs/codex-implementation-spec.md)
4. [README.md](/Users/workspace/Projects/self/FlowRate/README.md)

If two documents conflict:
- product behavior comes from the MVP spec;
- UI/UX behavior comes from the design spec;
- execution details come from the implementation spec;
- `README.md` should be updated to match the final state of the repo.

## Working Agreement

### General Rules

- Prefer incremental delivery over large unreviewed changes.
- Keep architecture boring and explicit.
- Do not introduce infrastructure that the MVP does not need.
- Do not add Postgres, Google Sheets, queues, or background workers for MVP.
- Keep the project local-first and file-based as defined in the product spec.
- Every meaningful change must preserve or improve documentation quality.

### Before Writing Code

- Re-read the relevant section of the MVP spec.
- Re-read the relevant section of the design spec for UI work.
- Check whether the current task requires updating docs, tests, or examples.
- Make a short implementation plan before touching multiple files.

### While Writing Code

- Prefer TypeScript everywhere it is available.
- Prefer small composable modules over large utility files.
- Validate all external input.
- Keep UI text behind i18n keys.
- Use semantic naming; avoid vague names like `data`, `temp`, `handler2`.
- Keep server logic deterministic and side effects isolated.
- Avoid magic numbers; use named constants or tokens where helpful.

### After Writing Code

- Run the narrowest useful verification first.
- Check for regressions in typing, behavior, and docs.
- Update `README.md` and docs if setup, structure, or behavior changed.
- Leave the repository in a state that another engineer can continue from immediately.

## Architecture Rules

### Product Boundaries

- The app is a conversion dashboard, not a CRM.
- The source of truth is manual counters.
- Required counters:
  - `applications`
  - `replies`
  - `interviews`
  - `offers`
- Required conversions:
  - `replyRate`
  - `interviewRate`
  - `offerRate`

### Data And API

- Storage format: JSON.
- Data directory: `data/jobflow/` with runtime override via `JOBFLOW_DATA_DIR`.
- File writes must be atomic.
- Write operations must use process-local locking or an equivalent safe mechanism.
- API contracts must be typed and schema-validated.
- Counter invariants must always be enforced:
  - all values are integers;
  - all values are non-negative;
  - `applications >= replies >= interviews >= offers`.

### Frontend

- Build a single-purpose dashboard screen for MVP.
- Prefer Nuxt-native patterns and Nuxt UI primitives.
- PrimeVue may be used selectively when it materially improves numeric editing or charts.
- Keep styling token-driven and consistent with the design spec.
- Do not mix unrelated visual paradigms.

## Code Quality Standards

### Type Safety

- Use strict TypeScript-friendly patterns.
- Define shared domain types close to the domain, not buried in UI files.
- Prefer Zod schemas for request/response and persisted data validation.
- Infer types from schemas where practical to avoid duplication.

### Maintainability

- One module should have one clear responsibility.
- Avoid premature abstractions.
- Prefer explicit composition over inheritance-style complexity.
- Keep functions short enough to scan comfortably.

### Error Handling

- Fail with useful messages.
- Distinguish validation errors from unexpected internal failures.
- Do not leak low-level file system details to the UI unless needed for debugging.

### Testing

- Add unit tests for domain logic.
- Add API tests for dashboard endpoints.
- Add UI behavior tests for critical user flows when the app shell exists.
- New logic without verification should be treated as incomplete.

## Documentation Rules

The project must remain fully documented.

### Required Documentation Updates

Update docs whenever changes affect:
- setup;
- architecture;
- API shape;
- file structure;
- UI behavior;
- data format;
- testing workflow;
- environment variables.

### Documentation Artifacts

The repo should maintain:
- `README.md` for project onboarding and overview;
- `docs/README.md` as the documentation index;
- product and design specs in `docs/`;
- implementation notes only if they help future work.

### README Standard

`README.md` must stay in English and must explain:
- what the project is;
- why it exists;
- current implementation status;
- architecture at a high level;
- data storage approach;
- API overview;
- documentation map;
- development expectations.

## Delivery Rules

A task is not done until all relevant items are complete:

- code works or the blocker is clearly documented;
- tests were run when feasible, or the gap is stated plainly;
- docs are updated;
- i18n implications are considered;
- edge cases and empty states were checked;
- no unrelated files were reverted.

## Preferred Workflow

1. Understand the task through the source documents.
2. Inspect the local code and file structure before making assumptions.
3. Make the smallest clean change that moves the project forward.
4. Verify behavior.
5. Update documentation.
6. Summarize outcome, risks, and next steps clearly.

## Anti-Patterns

Avoid these unless the spec changes:

- adding backend services for MVP;
- storing business rules only in the UI;
- shipping untranslated user-facing strings;
- undocumented folder sprawl;
- generic dashboard templates that ignore the design system direction;
- hidden coupling between file storage and view components;
- silent data correction without visible validation behavior.

## Definition Of Done

Work is considered complete only when:
- the implementation matches the specs;
- the repo remains understandable to a new engineer;
- documentation reflects reality;
- the next task can start without re-discovering decisions.
