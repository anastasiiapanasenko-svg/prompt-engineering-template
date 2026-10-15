---
name: project-quality-checks
description: Use this skill when verifying changes to the recipe generator frontend.
---

# Project Quality Checks Skill

## When to use

- Validate a code or documentation change that affects the frontend.
- Prepare a final verification report.

## Toolchain

- TypeScript: `npm run typecheck`
- ESLint: `npm run lint` (warnings fail the command)
- Prettier: `npm run format` (writes formatting changes to source files)
- TypeScript project build and Vite production bundle: `npm run build`

## Workflow

1. Run commands from `frontend/`; inspect `package.json` if scripts change.
2. For source changes, run `npm run typecheck`, `npm run lint`, and `npm run build`.
3. Use `npm run format` when formatting source files is needed, then inspect its diff and rerun relevant checks.
4. Check `git diff --check` and review changed files for accidental edits.
5. Report only checks that actually completed successfully; state clearly if a check could not be run.

There is currently no `test` script in the frontend package. Do not report automated unit tests as run unless a test runner is added and invoked.
