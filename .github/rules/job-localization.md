# English and Ukrainian Localization

Apply these rules when adding or changing user-visible text, recipe content, ingredient labels, controls, statuses, or language state.

## Translation Coverage

- Support the existing `en` and `uk` language values and use established helpers in `frontend/src/lib/i18n.ts`.
- Every new visible label, title, description, ingredient, quantity, difficulty, instruction, empty state, status, and control must have English and Ukrainian text.
- Recipe-specific translations belong in the local recipe dataset's Ukrainian content contract. Do not expose English recipe content while Ukrainian is active.
- Localize ingredient names in selection controls, selected-ingredient summaries, available/missing badges, and details views.
- Localize difficulty, dietary tags, time labels, servings labels, and navigation buttons wherever they appear.

## Dynamic Language Behavior

- Switching EN/UA must update the current view without a page reload.
- Preserve the active language during navigation and through the established session state flow.
- Do not duplicate translation dictionaries inside page markup when a shared helper is appropriate.
- Preserve the original canonical ingredient values used by matching when displaying translated names.

## Verification

- Review each changed UI path in both languages, including list cards and recipe details.
- Run the build instructions in [job-build-testing.md](job-build-testing.md).