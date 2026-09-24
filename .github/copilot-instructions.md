# Copilot Instructions

## Working mandate

- Read [docs/recipe-generator/business-requirements.md](../docs/recipe-generator/business-requirements.md) before making implementation decisions.
- Use [docs/recipe-generator/architecture.md](../docs/recipe-generator/architecture.md) as the architectural boundary for the app.
- Use [docs/recipe-generator/test-cases.md](../docs/recipe-generator/test-cases.md) as the validation target.
- Treat the feature as a single end-to-end app slice; do not split documentation by backend/front-end layers.

## React and TypeScript conventions

- Prefer functional components and TypeScript interfaces or types.
- Avoid `any` unless there is a documented and temporary exception.
- Keep shared UI pieces reusable and feature-specific logic localized.
- Use Redux Toolkit slices or local feature state for cross-page state, not ad hoc component state for shared selections.
- Put recipe matching and filtering logic in a dedicated utility or service module, not inside components.
- Keep side effects and data access separated from UI rendering.
- Use normalized, display-safe ingredient keys and avoid mutation of arrays or objects during filtering.

## Architecture boundaries

- Frontend pages belong under the feature-specific structure in `frontend/src/features/`.
- Data lives in a local fixed dataset, not in a backend database or external API.
- Recipe matching logic must handle partial matches and highlight missing ingredients.
- UI should remain focused on state representation, not business rule implementation.
- Keep service/data logic deterministic and easy to test.

## Required workflow

Before implementing any new UI or logic, complete the checklist in [docs/recipe-generator/pre-implementation-checklist.md](../docs/recipe-generator/pre-implementation-checklist.md).
