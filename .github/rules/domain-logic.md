# Recipe Domain Logic and Localization

Apply this guide when changing recipe data, ingredient normalization, match calculations, result filtering/ranking, or English/Ukrainian content and language behavior.

## Recipe Matching and Filtering

- Keep recipe matching deterministic and separate from React presentation code; use the existing `frontend/src/lib/recipeMatching.ts` boundary.
- Normalize selected and required ingredient names before comparison.
- Calculate match percentage from matching required ingredients divided by the recipe's required ingredient count; do not divide by selected ingredient count.
- Exclude zero-match recipes (`matchPercentage <= 0`) and preserve useful partial matches.
- Compute available and missing required ingredients for display.
- Apply vegetarian, vegan, gluten-free, and maximum prep-time filters before returning results.
- Sort by match percentage descending, then missing ingredient count ascending. A 100% match with no missing ingredients belongs at the top.
- Do not mutate source recipes or user selections. Keep ties deterministic.

## EN/UA Localization

- Preserve the existing `en` and `uk` language values and use shared localization helpers.
- Every visible string and recipe field added or changed must have appropriate English and Ukrainian text, including names, descriptions, ingredients, quantities, difficulty, steps, statuses, empty states, and controls.
- While Ukrainian is active, render localized recipe and ingredient fields rather than English source values.
- Localize ingredients in selection panels, summaries, available/missing lists, and detail views; preserve canonical values for matching.
- Language switching must update the current view without reloading and remain consistent through navigation and session state.

## Related Skill

For recipe matching, filtering, sorting, and missing-ingredient behavior, also follow [local-json-recipe-matching](../skills/local-json-recipe-matching/SKILL.md).