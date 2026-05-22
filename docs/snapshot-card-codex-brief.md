# Codex Brief: Snapshot Card Variants

## Purpose

Implement a new `snapshot card` UI in `FlowRate` for compact, screenshot-friendly display of funnel statistics and conversions.

The feature must support two visual variants of the same dashboard snapshot:
- `square` for shareable poster-style screenshots;
- `rectangle` for the primary working snapshot layout.

This brief is implementation-oriented and must be applied together with the source-of-truth project specs.

## Source Documents

Implementation must follow these documents in order:

1. [conversion-dashboard-mvp-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-mvp-spec.md)
2. [conversion-dashboard-design-spec.md](/Users/workspace/Projects/self/FlowRate/docs/conversion-dashboard-design-spec.md)
3. [codex-implementation-spec.md](/Users/workspace/Projects/self/FlowRate/docs/codex-implementation-spec.md)
4. [README.md](/Users/workspace/Projects/self/FlowRate/README.md)

If conflicts appear:
- product behavior comes from the MVP spec;
- UI and UX behavior comes from the design spec;
- execution details come from the implementation spec.

## Goal

The current statistics and funnel areas feel visually scattered. Recompose them into one intentional `snapshot card` so the user can:
- understand the funnel in 3 to 5 seconds;
- make a clean screenshot without cropping multiple unrelated blocks;
- switch between two layouts built from the same data and components.

## Scope

Add a new reusable snapshot component with two variants:
- `variant="rectangle"`
- `variant="square"`

Both variants must render the same typed dashboard state:
- `applications`
- `replies`
- `interviews`
- `offers`
- `replyRate`
- `interviewRate`
- `offerRate`
- `updatedAt`

The implementation should reuse existing dashboard data flow and should not introduce new backend or storage behavior.

## Product Constraints

Keep all existing MVP rules intact:
- source of truth is manual counters;
- all conversion rates are based on `applications`;
- when `applications = 0`, display `0%` and safe ratios without `NaN` or `Infinity`;
- user-facing strings must stay in i18n;
- do not move business rules into UI-only logic;
- do not break the existing counters editing workflow.

The snapshot is a new presentation layer, not a new product mode.

## UI Outcome

The dashboard should include a compact snapshot preview area with two visual modes:
- `rectangle` as the default primary mode;
- `square` as the alternative compact export/share mode.

If the existing dashboard screen already contains the relevant data, integrate the snapshot there instead of creating an unnecessary separate page.

## Shared Snapshot Content

Both variants must display:
- product title: `FlowRate`;
- localized subtitle such as `Manual funnel snapshot`;
- localized last-updated meta derived from `updatedAt`;
- four counters;
- three conversion metrics with percentage and ratio;
- a compact funnel or pipeline visualization.

## Variant 1: Rectangle

This is the main layout and should feel like the default production presentation.

### Composition

- one shared container;
- header at the top;
- two-column body below;
- left column for counters;
- right column for funnel narrative and conversion metrics.

### Layout Targets

- approximate aspect ratio: `16:9`;
- preview target: `1600x900`;
- container padding: `72px`;
- container radius: `28px`;
- major section gap: `24px`.

### Header

Include:
- `FlowRate`;
- localized subtitle;
- localized date or updated meta.

The header should feel lightweight and should not consume unnecessary vertical space.

### Left Column

Render four counters in a vertical stack:
- Applications
- Replies
- Interviews
- Offers

Each counter item should include:
- label;
- large numeric value.

### Right Column

Render:
- a step-flow line such as `48 -> 19 -> 8 -> 2`;
- three conversion blocks in a row for Replies, Interviews, and Offers.

Each conversion block must include:
- label;
- percentage;
- ratio such as `19 / 48`;
- thin progress bar.

### Visual Priority

Prioritize information in this order:
1. conversion percentage
2. count values
3. ratio
4. helper or meta text

## Variant 2: Square

This is the compact shareable layout.

### Composition

- one shared container;
- header at the top;
- counters in a `2x2` grid;
- funnel section below in a vertical strip.

### Layout Targets

- aspect ratio: `1:1`;
- preview target: `1080x1080`;
- container padding: `88px`;
- container radius: `32px`;
- section gap: `28px`.

### Header

Include:
- `FlowRate`;
- localized subtitle;
- compact localized updated meta.

### Counters

Render four counters in a `2x2` grid.

Each counter card should contain:
- label;
- large numeric value.

The counters should stay compact and not dominate the composition.

### Funnel Section

Render three vertical conversion rows:
- Replies
- Interviews
- Offers

Each row must include:
- label;
- percentage;
- ratio;
- horizontal progress bar.

### Design Intent

The square variant must feel like a complete share card, not a squeezed-down dashboard.

## Visual Direction

Follow the design spec and preserve an editorial, product-style interpretation of the existing `ocean telemetry` direction.

Required characteristics:
- calm and premium analytics feel;
- light surfaces;
- azure, ocean, and teal accents;
- deep graphite text;
- strong typographic hierarchy;
- generous whitespace;
- thin borders;
- soft shadows;
- no purple bias;
- no generic enterprise dashboard styling.

## Design Tokens

Use the existing token-driven styling system where possible. If missing tokens need to be added, do it explicitly and document them.

Support or introduce clear semantic tokens for:
- background and surface;
- border;
- primary and secondary text;
- azure accent;
- teal accent;
- large radii;
- soft shadow;
- spacing scale;
- type scale for title, stat, percent, and meta text.

Avoid burying important visual decisions as one-off hardcoded values in a single component.

## Suggested Component Structure

Prefer a small, composable structure such as:
- `DashboardSnapshotCard`
- `SnapshotHeader`
- `SnapshotCounterGrid`
- `SnapshotCounterItem`
- `SnapshotFunnelStrip`
- `SnapshotConversionMetric`

Adjust naming if the current repository structure suggests a clearer pattern.

## Data and Logic Boundaries

Do not change API or storage contracts for this feature.

The snapshot must consume the existing typed dashboard state.

Do not:
- duplicate conversion calculations unnecessarily;
- move domain rules into presentation-only code;
- add new storage, endpoints, or derived sources unless clearly required by an approved spec change.

## States

Support correct rendering for both variants in these states:
- loading;
- success;
- zero state when `applications = 0`;
- safe rendering under validation-controlled data;
- optional error state if the project already exposes one.

### Zero State

When `applications = 0`, show:
- `0%`;
- `0 / 0`;
- neutral helper text.

This should feel calm and neutral, not like an error.

## i18n

All user-facing text must be localized for both `ru` and `en`.

This includes:
- subtitle text;
- counter labels;
- conversion metric labels;
- updated text;
- empty-base helper text;
- any variant switch labels if a switch is implemented.

## Responsiveness

Keep the layout predictable across common desktop and tablet widths.

Expected behavior:
- `rectangle` may stack vertically on narrower widths;
- `square` should preserve its internal compositional logic;
- both variants must remain visually coherent and legible.

If responsive fallback is needed:
- `rectangle` can collapse into a vertical stack on tablet or mobile;
- `square` can reduce spacing and type scale, but should keep the same structural order.

## Accessibility

Minimum requirements:
- sufficient contrast;
- meaningful heading structure;
- no color-only meaning;
- keyboard-accessible controls if the user can switch variants in the UI.

## Variant Switching

If an in-app variant switch is added:
- default to `rectangle`;
- allow switching to `square`;
- keep the control simple and localized.

If a switch is out of scope, it is acceptable to implement both variants through a prop as long as the codebase clearly supports both.

## Testing

Add or update tests that verify:
- all four counters are rendered;
- all three conversion metrics are rendered;
- zero-state rendering is correct when `applications = 0`;
- `rectangle` and `square` render different layout structures but the same data;
- localized labels change correctly between `ru` and `en`.

Use the narrowest realistic level of UI verification already used by the repository.

## Documentation

Update project documentation if implementation changes:
- UI structure;
- component naming;
- snapshot layout behavior;
- current implementation status in the main README.

At minimum review and update if needed:
- [README.md](/Users/workspace/Projects/self/FlowRate/README.md)
- [docs/README.md](/Users/workspace/Projects/self/FlowRate/docs/README.md)

## Acceptance Criteria

The task is complete only if:
1. The repository contains a new snapshot UI with both `square` and `rectangle` variants.
2. Both variants render the same typed dashboard state.
3. `rectangle` reads as the primary compact analytics layout.
4. `square` reads as a shareable card.
5. Conversion metrics remain the main visual emphasis.
6. Counters and funnel no longer feel visually scattered.
7. Zero-state rendering remains correct and calm.
8. All strings are localized.
9. Relevant tests are added or updated.
10. Documentation reflects the implemented state.

## Out Of Scope

Do not:
- add a new backend service or external storage;
- turn the snapshot into a separate complex subsystem;
- introduce a generic dashboard template unrelated to the product direction;
- overload the card with filters, dense toolbar controls, or unrelated actions;
- break current product invariants.

## Expected Delivery Format

When implementation is complete, the final work summary should briefly state:
- where the main snapshot component lives;
- how the two variants are selected or configured;
- what verification was run;
- what documentation was updated.
