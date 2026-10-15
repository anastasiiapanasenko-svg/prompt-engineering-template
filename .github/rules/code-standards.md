---
description: Rules for TypeScript quality, React code, state, and build checks
globs: "**/*.{ts,tsx}"
---

# TypeScript Quality, State, and Build

Apply this guide when changing TypeScript, React structure, imports, Redux/session state, page transitions, or build/debug workflows.

## TypeScript and React

- Keep TypeScript strict. Avoid `any`; use explicit types and existing shared contracts at module boundaries.
- Prefer small functional React components, clean imports, and the established `@/` alias.
- Keep code compatible with the repository TypeScript and ESLint configurations; do not suppress diagnostics to bypass type or lint errors.
- Keep shared UI reusable and feature-specific behavior localized.
- Keep UI, domain logic, local data, localization, and side effects in their established modules.
- Avoid unrelated refactors and preserve public contracts unless the task requires a change.

## Quality toolchain

- Run `npm run typecheck` for app and Vite configuration TypeScript checks.
- Run `npm run lint` for ESLint; the script treats warnings as errors.
- Run `npm run build` to run the TypeScript project build and Vite production build.
- Use `npm run format` for source formatting when needed, then inspect the diff for unintended changes.

## State and Navigation

- Keep cross-page state in the existing typed Redux Toolkit slice as the single source of truth.
- Navigate between Home/ingredient selection, Recipe List, and Recipe Details through page state; do not trigger browser refreshes or full-page navigation.
- Back actions return to the prior logical view without clearing selected ingredients, filters, language, or recipe context.
- Use existing session persistence and hydration; do not create duplicate page-local copies of shared state or a parallel navigation store.
- Select a recipe through the established action before navigating to its detail view.

## Build and Debugging

- From `frontend/`, run `npm run build`. This runs `tsc -b` and then the Vite production build; both must succeed.
- Fix the smallest relevant issue and rerun the same build after a failure.
- Do not claim verification unless the command ran successfully; disclose unavailable checks.

## Related Skill

For selected ingredients, filters, session persistence, and page state flow, also follow [state-management](../skills/state-management/SKILL.md).