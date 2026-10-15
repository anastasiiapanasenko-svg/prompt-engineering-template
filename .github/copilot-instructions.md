# Copilot Instructions

## Job-specific rules

Use the root [Agents.MD](../Agents.MD) as the rules orchestrator. Before changing code, select and follow every applicable guide under `.github/rules/`; cross-cutting changes may require multiple guides. The feature requirements and architecture documents remain the source of truth for product behavior.

## Working mandate

- Read [docs/recipe-generator/business-requirements.md](../docs/recipe-generator/business-requirements.md) before making implementation decisions.
- Use [docs/recipe-generator/architecture.md](../docs/recipe-generator/architecture.md) as the architectural boundary for the app.
- Use [docs/recipe-generator/test-cases.md](../docs/recipe-generator/test-cases.md) as the validation target.
- Treat the feature as a single end-to-end app slice; do not split documentation by backend/front-end layers.

## React and TypeScript conventions

- Prefer functional components and TypeScript interfaces or types.
- Avoid `any` unless there is a documented and temporary exception.
- Keep shared UI pieces reusable and feature-specific logic localized.
- Keep cross-page state in the Redux Toolkit slice. The app persists selection, filters, page, selected recipe, and language through browser `sessionStorage`.
- Put recipe matching and filtering logic in a dedicated utility or service module, not inside components.
- Keep side effects and data access separated from UI rendering.
- Use normalized canonical ingredient values for matching and localized labels for display; avoid mutating arrays or objects during filtering.

## Architecture boundaries

- Frontend pages belong under the feature-specific structure in `frontend/src/features/`.
- Recipe records and the selectable ingredient catalog live in `frontend/src/data/recipes.ts`; localization and ingredient category metadata live in `frontend/src/lib/i18n.ts`.
- Ingredient panels are Meat, Grains, Vegetables, Dairy, Bakery, Spices, and Pantry. Every selectable ingredient must have EN/UA labels and exactly one category.
- Data lives in the fixed local dataset, not in a backend database or external API.
- Recipe matching logic must handle partial matches and highlight missing ingredients.
- UI should remain focused on state representation, not business rule implementation.
- Keep service/data logic deterministic and easy to test.

## Toolchain

From `frontend/`, use `npm run dev` to start Vite, `npm run typecheck` for TypeScript validation, `npm run lint` for ESLint, `npm run format` for Prettier formatting, and `npm run build` for the TypeScript/Vite production build.

## Required workflow

Before implementing any new UI or logic, complete the checklist in [docs/recipe-generator/pre-implementation-checklist.md](../docs/recipe-generator/pre-implementation-checklist.md).
