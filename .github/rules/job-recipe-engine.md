# Recipe Matching and Filtering

Apply these rules when changing ingredient normalization, matching, percentages, filtering, ranking, or recipe-result derivation.

## Matching Contract

- Keep matching and filtering deterministic and separate from React presentation code. The current implementation belongs in `frontend/src/lib/recipeMatching.ts`.
- Normalize selected and required ingredient names using the shared matching normalizer before comparison.
- A recipe's match percentage is the number of matching required ingredients divided by the number of required ingredients, expressed as a percentage. Do not divide by the number of selected ingredients.
- Return only recipes with at least one matching ingredient (`matchPercentage > 0`); zero-match recipes are excluded.
- Include partial matches and calculate the full list of missing required ingredients for display.

## Filtering and Sort Order

- Apply the active vegetarian, vegan, gluten-free, and maximum preparation-time filters before returning matches.
- Sort first by `matchPercentage` descending, then by `missingIngredients.length` ascending.
- Exact matches with 100% match and no missing ingredients must rank above partial matches.
- Keep sort results stable and deterministic when all ranking keys are equal.
- Do not mutate recipe data or user selections while matching.

## Verification

- When practical, verify exact, partial, and zero-match cases, including a single selected ingredient.
- Run the build instructions in [job-build-testing.md](job-build-testing.md).