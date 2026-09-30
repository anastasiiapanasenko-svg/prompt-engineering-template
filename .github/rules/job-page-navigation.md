# Page Navigation and State Transitions

Apply these rules when changing the ingredient-selection, recipe-list, or recipe-details view flow, back controls, page state, or session persistence.

## Single-Page Navigation

- Switch views through the established Redux page-state actions. Do not use browser reloads, full-page navigation, or location changes for in-app transitions.
- The supported views are ingredient selection (`home`), recipe list (`list`), and recipe details (`detail`). Keep transitions consistent with the existing slice and app shell.
- The list back button returns to ingredient selection. The details back button returns to the matched recipe list.
- Back controls must be clearly discoverable, keyboard accessible, and localized in English and Ukrainian.

## State Preservation

- Preserve selected ingredients, filters, current language, and relevant selected recipe context during navigation.
- A back action must not clear or reset the ingredient selection or filters.
- Keep session persistence and hydration behavior in the existing app state flow; do not add a parallel navigation store.
- Do not navigate to recipe details without dispatching the established selected-recipe action.

## Verification

- Check both back paths and state retention when changing navigation behavior.
- Run the build instructions in [job-build-testing.md](job-build-testing.md).