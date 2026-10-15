---
name: state-management
description: Use this skill when working with recipe selection state, filters, session persistence, or app-wide state flow in React and TypeScript.
---

# State Management Skill

## When to use

Use this skill for:

- Selected ingredients and filters in the recipe generator flow
- Navigation state between Home, Recipe List, and Recipe Details
- Session persistence in memory or `localStorage`
- Redux Toolkit slice patterns, action creators, and selectors

## Rules

- Keep shared state in a single source of truth.
- Prefer typed state updates over direct mutation.
- Normalize selected ingredient values before storing them.
- Keep UI state and domain state separate where practical.
- Persist only session-relevant state, not long-term user data.
- Do not duplicate state between page components and global store.

## Workflow

1. Trace the existing Redux slice, selectors, persistence, and page transitions before editing state behavior.
2. Define the smallest typed state or action change that supports the requirement, preserving the established source of truth.
3. Update reducers and selectors immutably; keep transient presentation state local when it is not shared across pages.
4. Confirm selection, filters, language, and current recipe context remain coherent through navigation and session hydration.
5. Verify reset behavior, persistence boundaries, and the relevant UI flow with the project's typecheck and build checks.

## Preferred patterns

- Use `createSlice` for feature state when Redux is the chosen store.
- Keep selectors focused and typed.
- Use reducers or helper functions for filter changes and selection toggles.
- When a user navigates between pages, preserve current recipe-search state without re-fetching data.

## Validation checklist

- Are selected ingredients stored in a single, typed state container?
- Are filters reflected across screens without stale values?
- Are updates immutable and predictable?
- Is session persistence limited to the browser session and not permanent storage?
