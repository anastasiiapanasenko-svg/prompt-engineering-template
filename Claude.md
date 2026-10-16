# Project Passport

## Project and architecture

Luxury Recipe Generator is a React application that matches local recipes to selected ingredients and optionally persists accounts, personal products, and search history.

- **Stack:** React, Vite, TypeScript, Tailwind CSS, Redux Toolkit, Express, Prisma, and SQLite.
- **Pages:** Home / ingredient selection, Recipe List, and Recipe Details under `recipe-app-frontend/src/features/recipe-generator/`.
- **Recipe data:** Typed local records in `recipe-app-frontend/src/data/recipes.ts`; recipe matching stays local. SQLite stores only account-related data.
- **Matching:** Deterministic matching and filters in `recipe-app-frontend/src/lib/recipeMatching.ts`.
- **Localization and categories:** Bilingual ingredient labels, category headings, and UI text in `recipe-app-frontend/src/lib/i18n.ts`.
- **Shared state:** Redux Toolkit store and recipe-generator slice under `recipe-app-frontend/src/store/`. The app persists selection, filters, page, selected recipe, and language in browser `sessionStorage`.
- **Ingredient panels:** Meat & Poultry, Grains & Cereals, Vegetables & Greens, Dairy & Cheese, Bakery & Bread, Spices & Seasonings, and Pantry & Oils.
- **API:** Express routes and Prisma models are under `recipe-app-backend/`; see [`recipe-app-backend/README.md`](./recipe-app-backend/README.md) for setup.

Keep recipe discovery local-first. Do not introduce external recipe services; use the API only for the approved account, custom-product, and search-history features.

## Development commands

Run these commands from [`recipe-app-frontend/`](./recipe-app-frontend/):

| Command             | Purpose                                                                         |
| ------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`       | Start the Vite development server.                                              |
| `npm run build`     | Run the TypeScript project build and create the Vite production bundle.         |
| `npm run lint`      | Run ESLint with warnings treated as errors.                                     |
| `npm run typecheck` | Run TypeScript checks for app and tooling configuration without emitting files. |
| `npm run format`    | Format source TypeScript, TSX, CSS, and Markdown with Prettier.                 |

## Quality assurance

- **Linter:** ESLint (`npm run lint`).
- **Type checker:** TypeScript (`npm run typecheck`; also included in `npm run build`).
- **Formatter:** Prettier (`npm run format`).
- **Production build:** Vite (`npm run build`).

Before finishing frontend code changes, run typecheck, lint, and build; run the formatter when source formatting is needed and review its diff. Run the backend integration tests with `npm test` from `recipe-app-backend/`.

## Project guidance

- [AGENTS.md](./AGENTS.md) is the canonical project-wide instruction index and workflow.
- Browse all [path-scoped rules](./.github/rules/) and [workflow skills](./.github/skills/).
- Product behavior, architecture, validation cases, and the pre-implementation checklist live in [`docs/recipe-generator/`](./docs/recipe-generator/).
- Read [MCP integration guidance](./docs/mcp-integration.md) before adding or configuring Model Context Protocol services.

## Model Context Protocol (MCP)

MCP integrations serve the development assistant; they are separate from the recipe application and do not replace its local recipe dataset or introduce runtime recipe APIs.

This repository currently has no project-configured MCP server. Any optional developer integration should be configured in VS Code's `.vscode/mcp.json`, limited to the minimum trusted tools and data access needed, and documented before use. Never place credentials or other secrets in tracked configuration. Review the server's behavior and any requested permissions before approving access.
