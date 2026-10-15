# Project Passport

## Project

Luxury Recipe Generator: a client-side React application that matches locally stored recipes to selected ingredients and provides English/Ukrainian content.

## Technology stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit

The application and its npm scripts live in [`frontend/`](./frontend/).

## Development commands

Run these commands from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check and create a production build. |
| `npm run lint` | Run ESLint with warnings treated as errors. |
| `npm run typecheck` | Run the TypeScript check without emitting files. |
| `npm run format` | Format source TypeScript, TSX, CSS, and Markdown files with Prettier. |

## Project guidance

- [`AGENTS.md`](./AGENTS.md) is the canonical project-wide instruction index and workflow.
- Browse all [path-scoped rules](./.github/rules/) and [workflow skills](./.github/skills/).
- Product requirements, architecture, validation cases, and the pre-implementation checklist live in [`docs/recipe-generator/`](./docs/recipe-generator/).
- Read [MCP integration guidance](./docs/mcp-integration.md) before adding or configuring Model Context Protocol services.

## Model Context Protocol (MCP)

Model Context Protocol is a standard for connecting an AI client to external context providers and tools. MCP integrations serve the development assistant; they are separate from the recipe application and do not replace its local recipe dataset or introduce runtime recipe APIs.

This repository currently has no project-configured MCP server. Any optional developer integration should be configured in VS Code's `.vscode/mcp.json`, limited to the minimum trusted tools and data access needed, and documented before use. Never place credentials or other secrets in tracked configuration. Review the server's behavior and any requested permissions before approving access.
