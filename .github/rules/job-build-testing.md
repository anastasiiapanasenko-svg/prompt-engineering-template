# TypeScript, Imports, Build, and Debugging

Apply these rules when validating code changes, fixing compile failures, organizing imports, or completing implementation work.

## TypeScript and Modules

- Keep TypeScript strict and avoid `any`; use existing shared types and explicit types at module boundaries.
- Keep imports direct, clean, and consistent with the established `@/` alias and nearby formatting.
- Keep UI, state, local data, matching, and localization responsibilities in their existing modules.
- Do not introduce redundant abstractions or unrelated cleanup while fixing a focused issue.

## Required Build Gate

- From the `frontend/` directory, run:
  ```powershell
  npm run build
  ```
- This executes `tsc -b` followed by the Vite production build. Both must complete without errors.
- After a failure, fix the smallest relevant issue and rerun the same command.
- Do not report the work as verified unless the build was run and passed; disclose any unavailable checks.

## Debugging

- Use the narrowest relevant typecheck, test, or build check available first.
- Keep debugging changes scoped to the behavior being fixed and preserve user changes in the worktree.