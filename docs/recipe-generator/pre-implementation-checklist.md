# Pre-Implementation Workflow Checklist

Complete this checklist before writing code for the recipe generator.

## 1. Read the source-of-truth docs

- [business-requirements.md](business-requirements.md)
- [architecture.md](architecture.md)
- [test-cases.md](test-cases.md)

## 2. Confirm scope boundaries

- Confirm the feature remains a single end-to-end app slice.
- Confirm the app uses a fixed local JSON dataset instead of external APIs.
- Confirm the three pages remain: Home / Ingredient Selection, Recipe List, and Recipe Details.
- Confirm state remains session-based and no account or database persistence is introduced.

## 3. Confirm architectural boundaries

- Frontend logic stays in the React/TypeScript feature structure.
- Shared state is centralized and typed.
- Recipe matching/filtering is separated from UI rendering.
- No cross-layer documentation split is introduced.

## 4. Validate implementation plan

- Ingredient selection is limited to the predefined ingredient list.
- Dietary filters are Vegetarian, Vegan, and Gluten-Free.
- Prep-time filters are under 15, under 30, and under 60 minutes.
- Results sort by relevance percentage.
- Partial matches are shown with missing ingredients highlighted.
- Serving size stays fixed.

## 5. Quality gate before coding

- Any new component follows existing React patterns and accessibility requirements.
- Any new state logic is typed, immutable, and testable.
- Any new matching logic is isolated, deterministic, and documented.
- Any new code is consistent with the design and naming rules in [Agents.MD](../../Agents.MD).

## 6. Final sign-off

Proceed only when all items above are true. If an implementation request conflicts with the feature docs, stop and resolve the conflict before writing code.
