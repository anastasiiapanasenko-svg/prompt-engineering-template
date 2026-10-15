# Recipe Generator Agent Guide

This is the canonical project-wide agent guide. Rules in `.github/rules/` are path-scoped and activate when their declared globs match the files in scope. Read every applicable rule and skill before implementation. Product behavior is defined by the recipe-generator requirements, test cases, and architecture documents under `docs/recipe-generator/`.

## Project context

- **Product:** Client-side recipe discovery with local ingredient matching and English/Ukrainian (EN/UA) localization.
- **Stack:** React, Vite, TypeScript, Tailwind CSS, Redux Toolkit, and a project-owned `i18n.ts` catalog/helper (not an external translation service).
- **Data boundary:** Recipe records are embedded in `frontend/src/data/recipes.ts`; do not add a backend, database, accounts, or external recipe API without approval.
- **State:** Redux Toolkit owns selection, filters, page, selected recipe, and language. `frontend/src/App.tsx` persists/restores this state through browser `sessionStorage`.
- **Architecture:** Pages are in `frontend/src/features/recipe-generator/`; matching is in `frontend/src/lib/recipeMatching.ts`; bilingual ingredient/category/UI labels are in `frontend/src/lib/i18n.ts`; shared types are in `frontend/src/types/recipe.ts`.

## Ingredient panels

The ingredient selector renders seven explicit categories from the shared category metadata:

1. Meat & Poultry (`meat`)
2. Grains & Cereals (`grains`)
3. Vegetables & Greens (`vegetables`)
4. Dairy & Cheese (`dairy`)
5. Bakery & Bread (`bakery`)
6. Spices & Seasonings (`spices`)
7. Pantry & Oils (`pantry`)

Keep the canonical ingredient list in `frontend/src/data/recipes.ts`, bilingual labels and category assignments in `frontend/src/lib/i18n.ts`, and ensure every selectable ingredient has a translation and exactly one category.

## Rules and skills index

Read all relevant modules for the files being changed; cross-cutting work may require more than one.

### Rules

- [UI design and accessibility](.github/rules/ui-design.md)
- [TypeScript quality, state, and build](.github/rules/code-standards.md)
- [Recipe matching and localization](.github/rules/domain-logic.md)
- [Media resilience](.github/rules/media-resilience.md)

### Skills

- [Component creation](.github/skills/component-creation/SKILL.md)
- [Local recipe matching](.github/skills/local-recipe-matching/SKILL.md)
- [State management](.github/skills/state-management/SKILL.md)
- [Adding recipes](.github/skills/recipe-authoring/SKILL.md)
- [Running quality checks](.github/skills/project-quality-checks/SKILL.md)
- [Refactoring ingredient categories](.github/skills/ingredient-categories/SKILL.md)

## Required workflow

1. Read applicable rules and skills before changing code.
2. Review `docs/recipe-generator/business-requirements.md`, `architecture.md`, `test-cases.md`, and `pre-implementation-checklist.md` before making product or architecture decisions.
3. Preserve accessibility, responsive behavior, EN/UA support, session state, and the espresso glass design.
4. Keep changes focused and respect the local-data/no-backend boundary.
5. From `frontend/`, run `npm run typecheck`, `npm run lint`, and `npm run build`. Use `npm run format` when formatting source files; inspect the resulting diff.

See [Claude.md](./Claude.md) for the project passport, commands, and MCP guidance.
