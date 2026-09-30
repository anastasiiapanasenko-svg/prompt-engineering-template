# Project Agent Orchestrator

This guide is the project-wide workflow entry point. Use [Agents.MD](./Agents.MD) as the master index of all focused rules and skills, and apply all guidance relevant to the current task.

## Project Context

- **Stack:** React, TypeScript, Vite, Tailwind CSS, and Redux Toolkit.
- **Product:** Luxury Recipe Generator with local ingredient matching and dynamic English/Ukrainian support.
- **Data boundary:** Recipe content remains in the local frontend dataset. Do not add external recipe APIs, backend persistence, or accounts without approval.
- **Feature structure:** Recipe Generator UI resides under `frontend/src/features/recipe-generator/`; matching, localization, types, state, and data use their existing shared modules.

## Required Workflow

1. Read [Agents.MD](./Agents.MD), then select all relevant `.github/rules/` modules and `.github/skills/` guides.
2. Before implementation decisions, read the end-to-end feature requirements, architecture, test cases, and pre-implementation checklist under `docs/recipe-generator/`.
3. Preserve established product behavior, local data boundaries, bilingual support, session state, accessibility, and the espresso glass design.
4. Keep changes focused and avoid unrelated refactors. Surface conflicts with requirements before expanding scope.
5. Run `npm run build` from `frontend/` and confirm TypeScript and Vite compilation pass before completion.

The business requirements and architecture documents remain the source of truth for product behavior; the rule files provide task-specific implementation constraints.
