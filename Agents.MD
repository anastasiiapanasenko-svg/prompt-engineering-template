# Recipe Generator Agent Guide

This is the canonical project-wide agent guide. Rules in `.github/rules/` are path-scoped and activate when their declared globs match the files in scope. Read every applicable rule and skill before implementation. Product behavior is defined by the recipe-generator requirements, test cases, and architecture documents under `docs/recipe-generator/`.

## Project context

- **Product:** Client-side recipe discovery with local ingredient matching and English/Ukrainian (EN/UA) localization.
- **Stack:** React, Vite, TypeScript, Tailwind CSS, Redux Toolkit, Express, Prisma, and SQLite.
- **Data boundary:** Recipe records are embedded in `recipe-app-frontend/src/data/recipes.ts`; recipe matching stays local. The approved backend stores user accounts, owner-scoped custom products, search history, and hashed-token sessions in SQLite. Do not add external recipe APIs.
- **State:** Redux Toolkit owns selection, filters, page, selected recipe, and language. `recipe-app-frontend/src/App.tsx` persists/restores this state through browser `sessionStorage`.
- **Architecture:** Pages are in `recipe-app-frontend/src/features/recipe-generator/`; matching is in `recipe-app-frontend/src/lib/recipeMatching.ts`; bilingual ingredient/category/UI labels are in `recipe-app-frontend/src/lib/i18n.ts`; shared types are in `recipe-app-frontend/src/types/recipe.ts`; Express routes and Prisma schema are under `recipe-app-backend/`.

## Ingredient panels

The ingredient selector renders eight explicit categories from the shared category metadata:

1. Meat & Poultry (`meat`)
2. Grains & Cereals (`grains`)
3. Vegetables & Greens (`vegetables`)
4. Fruits & Berries (`fruits`)
5. Dairy & Cheese (`dairy`)
6. Bakery & Bread (`bakery`)
7. Spices & Seasonings (`spices`)
8. Pantry & Oils (`pantry`)

Keep the canonical ingredient list in `recipe-app-frontend/src/data/recipes.ts`, bilingual labels and category assignments in `recipe-app-frontend/src/lib/i18n.ts`, and ensure every selectable ingredient has a translation and exactly one category.

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
4. Keep recipe discovery local and matching deterministic; use SQLite only for approved account-related data.
5. From `recipe-app-frontend/`, run `npm run typecheck`, `npm run lint`, and `npm run build`. When changing the API or database schema, run `npm test` and `npm run build` from `recipe-app-backend/`. Use `npm run format` when formatting frontend source files; inspect the resulting diff.

See [CLAUDE.md](./CLAUDE.md) for the project passport, commands, and MCP guidance. See [`recipe-app-backend/README.md`](./recipe-app-backend/README.md) for API setup.
