# Pre-Implementation Workflow Checklist

Complete this checklist before writing code for the recipe generator.

## 1. Read the source-of-truth docs

- [business-requirements.md](business-requirements.md)
- [architecture.md](architecture.md)
- [test-cases.md](test-cases.md)

## 2. Confirm scope boundaries

- Confirm the feature remains a single end-to-end app slice.
- Confirm the app uses the fixed TypeScript dataset in `recipe-app-frontend/src/data/recipes.ts` instead of external APIs.
- Confirm the three pages remain: Home / Ingredient Selection, Recipe List, and Recipe Details.
- Keep recipe selection, filters, navigation, and language in browser `sessionStorage`.
- Use the approved Express + Prisma + SQLite backend only for optional accounts, owned custom products, authentication sessions, and search history.
- Preserve local recipe matching; do not add a recipe API or persist recipe records in SQLite.

## 3. Confirm architectural boundaries

- Frontend logic stays in the React/TypeScript feature structure.
- Shared state is centralized and typed.
- Recipe matching/filtering is separated from UI rendering.
- No cross-layer documentation split is introduced.

## 4. Validate implementation plan

- Ingredient selection includes the predefined catalog and, for signed-in users, their own custom products.
- Custom products use one of the eight existing categories and remain private to their owner.
- Dietary filters are Vegetarian, Vegan, and Gluten-Free.
- Prep-time filters are under 15, under 30, and under 60 minutes.
- Results sort by relevance percentage.
- Partial matches are shown with missing ingredients highlighted.
- Serving size stays fixed.

## 5. Quality gate before coding

- Any new component follows existing React patterns and accessibility requirements.
- Any new state logic is typed, immutable, and testable.
- Any new matching logic is isolated, deterministic, and documented.
- Account API routes validate input, hash passwords, use revocable hashed-token sessions, and scope data access to the authenticated user.
- Any new code is consistent with the design and naming rules in [AGENTS.md](../../AGENTS.md).

## 6. Final sign-off

Proceed only when all items above are true. If an implementation request conflicts with the feature docs, stop and resolve the conflict before writing code.
