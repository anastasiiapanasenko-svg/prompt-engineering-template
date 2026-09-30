# Code Standards, State, and Build

Apply this guide when changing TypeScript, React structure, imports, Redux/session state, page transitions, or build/debug workflows.

## TypeScript and React

- Keep TypeScript strict. Avoid `any`; use explicit types and existing shared contracts at module boundaries.
- Prefer small functional React components, clean imports, and the established `@/` alias.
- Keep shared UI reusable and feature-specific behavior localized.
- Keep UI, domain logic, local data, localization, and side effects in their established modules.
- Avoid unrelated refactors and preserve public contracts unless the task requires a change.

## State and Navigation

- Keep cross-page state in the existing typed Redux Toolkit slice as the single source of truth.
- Navigate between Home/ingredient selection, Recipe List, and Recipe Details through page state; do not trigger a browser refresh or full-page navigation.
- Back actions return to the prior logical view without clearing selected ingredients, filters, language, or recipe context.
- Use existing session persistence and hydration; do not create duplicate page-local copies of shared state or a parallel navigation store.
- Select a recipe through the established action before navigating to its detail view.

## Build and Debugging

- From `frontend/`, run `npm run build`. This runs `tsc -b` and then the Vite production build; both must succeed.
- Fix the smallest relevant issue and rerun the same build after a failure.
- Do not claim verification unless the command ran successfully; disclose unavailable checks.

## Related Skill

For selected ingredients, filters, session persistence, and page state flow, also follow [state-management](../skills/state-management/SKILL.md).