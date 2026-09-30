# Recipe Generator Agent Guide

This file is the authoritative rules and skills guide for AI agents working on the Recipe Generator application. Apply these instructions to recipe-app changes; retain the existing repository architecture and feature documentation as additional constraints.

## Project Overview and Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Redux Toolkit.
- **Purpose:** A luxury recipe generator that matches locally available ingredients to recipes and supports English and Ukrainian (EN/UA).
- **Data:** Recipe content is maintained in the local frontend dataset. Do not introduce a backend, external recipe API, or persistent user database without explicit approval.
- **Feature structure:** UI pages and components live under `frontend/src/features/recipe-generator/`; shared data, matching, localization, and types remain in their established `frontend/src/` modules.

## Core Agent Rules

### Design System

- Preserve the macOS/iOS frosted-glass design: translucent espresso surfaces, `backdrop-blur-xl`, amber/gold accents, and the dark espresso `#120a06` base.
- Use the dark marble/luxury kitchen hero treatment already established in the application.
- Main glass surfaces should remain visibly translucent over the ambient background. Do not replace them with opaque fills or remove their blur, border, or shadow treatment.

### UI Integrity and Accessibility

- Keep text on glass surfaces crisp and readable. Maintain strong contrast for cream text, gold headings and controls, green available-ingredient labels, amber missing-ingredient labels, and match percentages.
- Do not rely on color alone to communicate ingredient availability; retain descriptive labels and the distinction between available and missing ingredients.
- Preserve responsive layouts, keyboard operability, visible focus indicators, meaningful image alt text, and accessible names for controls.
- Keep the EN/UA language toggle and all translated UI behavior working on every relevant view.

### Code Quality

- Use strict TypeScript types. Avoid `any` unless a temporary, documented exception is unavoidable.
- Prefer focused functional React components, modular feature logic, clean imports, and existing shared components/utilities.
- Keep recipe matching, normalization, localization, data access, and presentation responsibilities in their existing modules. Do not move business rules into page markup.
- Use immutable state updates and preserve Redux/session state flows for ingredient selections, filters, language, and page navigation.
- Keep changes scoped; do not reformat or refactor unrelated files.

### Image Resilience

- Every rendered recipe image must have an `onError` fallback handler so a failed remote image cannot leave a broken-image icon.
- Use this default food-image fallback URL:
  `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`
- The handler must prevent repeated error handling when the fallback itself fails, for example by clearing `currentTarget.onerror` before assigning the fallback URL.
- Provide meaningful localized alt text for recipe images.

## Agent Skills

### Skill 1: Ingredient Match Sorting Engine

- Normalize ingredient names before comparing user selection to recipe ingredients.
- Exclude recipes with zero matching ingredients (`matchPercentage === 0`).
- Sort first by `matchPercentage` descending, then by `missingIngredients.length` ascending.
- A recipe with a 100% match and no missing ingredients must appear before partial matches.
- Keep matching deterministic and separate from UI rendering.

### Skill 2: i18n Localization

- Preserve seamless dynamic EN/UA switching without a page reload.
- Any new user-visible recipe title, description, ingredient, quantity label, difficulty, instruction, empty state, or control must have an appropriate translation in both supported languages.
- Display localized recipe and ingredient data rather than exposing English source values while Ukrainian is active.
- Preserve the current language through view navigation and session state.

### Skill 3: Single-Page State Navigation

- Navigate between ingredient selection, recipe list, and recipe details through application state; do not require browser refreshes or full-page navigation.
- Back buttons must dispatch the established page-state actions and return to the appropriate view immediately.
- Preserve selected ingredients, filters, selected recipe context, and language when navigating between views.
- Do not clear user selections as a side effect of a back action.

### Skill 4: Automated Build and Debugging

- Run the frontend production build after code changes:
  ```powershell
  cd frontend
  npm run build
  ```
- The build runs `tsc -b` followed by Vite production bundling. Resolve all relevant TypeScript compilation errors before declaring work complete.
- When a build fails, fix the smallest relevant slice and rerun the same build command.

## Project Verification

Before completing implementation work, run `npm run build` from `frontend/` and confirm that TypeScript compilation and the Vite build both succeed. Report any verification that could not be run.

## Feature Documentation

Before making implementation decisions for the Recipe Generator, consult the end-to-end feature documents and checklist:

- `docs/recipe-generator/business-requirements.md`
- `docs/recipe-generator/architecture.md`
- `docs/recipe-generator/test-cases.md`
- `docs/recipe-generator/pre-implementation-checklist.md`

If implementation conflicts with those requirements or this guide, surface the conflict and resolve it before expanding scope.# Project agents guide

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
