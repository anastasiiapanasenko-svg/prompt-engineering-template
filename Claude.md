# Project Passport

## Project and architecture

Luxury Recipe Generator is a client-side React application that matches locally stored recipes to selected ingredients and displays bilingual (English/Ukrainian) recipe content.

- **Stack:** React, Vite, TypeScript, Tailwind CSS, Redux Toolkit, and a local `i18n.ts` localization catalog/helper.
- **Pages:** Home / ingredient selection, Recipe List, and Recipe Details under `frontend/src/features/recipe-generator/`.
- **Recipe data:** Typed local records in `frontend/src/data/recipes.ts`; no runtime recipe API or backend database.
- **Matching:** Deterministic matching and filters in `frontend/src/lib/recipeMatching.ts`.
- **Localization and categories:** Bilingual ingredient labels, category headings, and UI text in `frontend/src/lib/i18n.ts`.
- **Shared state:** Redux Toolkit store and recipe-generator slice under `frontend/src/store/`. The app persists selection, filters, page, selected recipe, and language in browser `sessionStorage`.
- **Ingredient panels:** Meat & Poultry, Grains & Cereals, Vegetables & Greens, Dairy & Cheese, Bakery & Bread, Spices & Seasonings, and Pantry & Oils.

Keep the app local-first: do not introduce external recipe services, accounts, or server persistence without approval.

## Development commands

Run these commands from [`frontend/`](./frontend/):

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Run the TypeScript project build and create the Vite production bundle. |
| `npm run lint` | Run ESLint with warnings treated as errors. |
| `npm run typecheck` | Run TypeScript checks for app and tooling configuration without emitting files. |
| `npm run format` | Format source TypeScript, TSX, CSS, and Markdown with Prettier. |

## Quality assurance

- **Linter:** ESLint (`npm run lint`).
- **Type checker:** TypeScript (`npm run typecheck`; also included in `npm run build`).
- **Formatter:** Prettier (`npm run format`).
- **Production build:** Vite (`npm run build`).

Before finishing code changes, run typecheck, lint, and build; run the formatter when source formatting is needed and review its diff. The repository does not currently define an automated test script.

## Project guidance

- [Agents.MD](./Agents.MD) is the canonical project-wide instruction index and workflow.
- Browse all [path-scoped rules](./.github/rules/) and [workflow skills](./.github/skills/).
- Product behavior, architecture, validation cases, and the pre-implementation checklist live in [`docs/recipe-generator/`](./docs/recipe-generator/).
- Read [MCP integration guidance](./docs/mcp-integration.md) before adding or configuring Model Context Protocol services.

## Model Context Protocol (MCP)

MCP integrations serve the development assistant; they are separate from the recipe application and do not replace its local recipe dataset or introduce runtime recipe APIs.

This repository currently has no project-configured MCP server. Any optional developer integration should be configured in VS Code's `.vscode/mcp.json`, limited to the minimum trusted tools and data access needed, and documented before use. Never place credentials or other secrets in tracked configuration. Review the server's behavior and any requested permissions before approving access.
