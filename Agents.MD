# Recipe Generator Agent Guide

This is the canonical project-wide agent guide. Rules in `.github/rules/` are path-scoped with glob patterns and activate contextually when the active file matches a rule's declared paths. Read the matching rules for the files being changed; cross-cutting work may trigger multiple rules. Feature requirements and architecture documents under `docs/recipe-generator/` remain the source of truth for product behavior.

## Project Context

- **Stack:** React, TypeScript, Vite, Tailwind CSS, and Redux Toolkit.
- **Product:** Luxury Recipe Generator with local ingredient matching and dynamic English/Ukrainian (EN/UA) support.
- **Data boundary:** Recipe content lives in the local frontend dataset. Do not introduce external recipe APIs, backend persistence, or accounts without approval.
- **Feature code:** Recipe Generator UI is under `frontend/src/features/recipe-generator/`; matching, localization, types, state, and data remain in their established `frontend/src/` modules.

## Rules and Skills Index

Apply all modules relevant to the task; cross-cutting work may require multiple guides.

### Rules

- [UI design](.github/rules/ui-design.md)
- [Code standards and navigation](.github/rules/code-standards.md)
- [Recipe domain logic and localization](.github/rules/domain-logic.md)
- [Media resilience](.github/rules/media-resilience.md)

### Skills

- [Component creation](.github/skills/component-creation/SKILL.md)
- [Local JSON recipe matching](.github/skills/local-json-recipe-matching/SKILL.md)
- [State management](.github/skills/state-management/SKILL.md)

## Required Workflow

1. Read applicable path-scoped rule modules and skill guides before implementation. A rule only applies when its declared glob matches the active file or task scope.
2. Consult `docs/recipe-generator/business-requirements.md`, `architecture.md`, `test-cases.md`, and `pre-implementation-checklist.md` for product and architecture decisions.
3. Preserve accessibility, responsive behavior, bilingual support, session state, and the espresso glass design.
4. Keep changes focused; resolve conflicts with feature requirements before expanding scope.
5. Run `npm run build` from `frontend/` and confirm TypeScript and Vite compilation succeed. Report any verification that could not be run.
