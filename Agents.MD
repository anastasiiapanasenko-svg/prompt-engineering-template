# Project agents guide

This repository is a full-stack boilerplate: **FastAPI** backend and **React (TypeScript)** frontend.

## Layout

- `backend/` — API with layered architecture (`types`, `models`, `repositories`, `services`, `routers`, `utils`). Data is stored in JSON files under `backend/data/` (one file per entity, contents are a JSON array). Uses **uv**, **Pydantic**, and FastAPI dependency injection (routers depend on services; services use repositories).
- `frontend/` — **React + TypeScript**, **shadcn/ui**, **Redux Toolkit** (RTK Query for API, slices for UI state). No authentication.
- `docs/` — Feature documentation organized by end-to-end feature (business requirements, architecture, and test cases in one folder).

## Current scope

Single domain entity: **Item**, with full CRUD exposed at `/api/items` and managed in the UI.

## Working conventions

- Add new features under the same layer folders on the backend and under `src/features/` on the frontend.
- Document each feature under one end-to-end folder: `docs/<feature>/`.
- Keep AI assistant entry points minimal: this file is the source of truth; `Claude.md` points here.

## Coding conventions

- Prefer functional React components using TypeScript and explicit prop interfaces.
- Avoid `any` except where it is explicitly documented and temporary.
- Use immutable updates for arrays and objects; do not mutate state in place.
- Keep shared UI primitives reusable and feature-specific logic localized.
- Put domain logic such as recipe matching, filtering, and relevance ranking in utilities or service modules, not inside components.
- Separate UI rendering from side effects, data access, and business rules.
- Use normalized ingredient keys and display-safe values when working with recipe data.
- Keep error, empty, and loading states explicit and user-friendly.

## Architectural boundaries

- Feature pages belong under `frontend/src/features/`.
- Cross-page state should live in Redux Toolkit slices or a typed feature state container, not in ad hoc component state.
- Local data and recipe logic should be deterministic and easy to test.
- The application data source is a fixed local dataset; do not introduce external APIs or backend persistence without an approved change.
- Recipe matching logic must handle partial matches and highlight missing ingredients.
- UI should focus on presenting state, not containing business-rule logic.

## Agent behavior rules

- Always read the feature docs before implementation: [docs/recipe-generator/business-requirements.md](docs/recipe-generator/business-requirements.md), [docs/recipe-generator/architecture.md](docs/recipe-generator/architecture.md), and [docs/recipe-generator/test-cases.md](docs/recipe-generator/test-cases.md).
- Treat the feature as one end-to-end slice and do not split implementation or documentation by frontend/backend folders.
- Before writing new UI or logic, complete the checklist in [docs/recipe-generator/pre-implementation-checklist.md](docs/recipe-generator/pre-implementation-checklist.md).
- Prefer minimal, targeted changes over broad refactors.
- If implementation conflicts with the feature docs, stop and resolve the conflict before continuing.
- Keep changes aligned with the existing app structure and naming conventions.

## Local development

1. Backend: from `backend/`, run `uv sync` then `uv run dev` (see `[tool.uv.scripts]` in `pyproject.toml`).
2. Frontend: from `frontend/`, run `npm install` then `npm run dev` (dev server port **5174**; default API base: `http://localhost:8001/api`).

VS Code: `.vscode/launch.json` starts the backend; `.vscode/tasks.json` installs dependencies and runs the frontend dev server.
