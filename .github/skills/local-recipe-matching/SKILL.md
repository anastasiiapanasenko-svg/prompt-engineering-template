---
name: local-recipe-matching
description: Use this skill when implementing local recipe matching, filtering, sorting, and missing-ingredient logic for the recipe generator.
---

# Local Recipe Matching Skill

## When to use

Use this skill for:

- Matching selected ingredients against typed recipe records in the local TypeScript dataset
- Filtering by dietary preference and maximum prep time
- Calculating match percentages and ranking results
- Highlighting available vs. missing ingredients

## Rules

- Treat the data source as a fixed local dataset, not an external API.
- Normalize ingredient names before comparison.
- Preserve the concept of partial matches in results.
- Highlight missing ingredients rather than hiding them.
- Keep matching logic deterministic and easy to unit test.
- Sort results by relevance using the highest match percentage first.

## Workflow

1. Inspect the recipe and ingredient types, local dataset, and existing matching helper before changing behavior.
2. Normalize selected and required ingredient values using the shared normalization approach.
3. Treat salt, black pepper, and sugar as baseline seasonings: exclude them from the scoring denominator and do not report them as missing when unselected. Compute other matched ingredients, missing ingredients, and match percentage without mutating inputs.
4. Apply dietary and preparation-time constraints, retaining useful partial matches and excluding recipes with no selected-ingredient match.
5. Sort deterministically by match percentage descending, missing ingredient count ascending, then recipe name.
6. Add or update automated tests if a test runner is available; otherwise validate full/partial/no-match behavior, filters, and tie ordering through the feature UI and focused checks.

## Preferred implementation approach

- Read recipe records from `recipe-app-frontend/src/data/recipes.ts`; do not introduce runtime API or database access.
- Filter by dietary tags and preparation-time constraints.
- For each recipe, compute:
  - total scored ingredients, excluding baseline seasonings
  - matched ingredients
  - missing ingredients
  - match percentage
- Return the final list sorted by relevance and then by a stable secondary key such as name.

## Validation checklist

- Do recipe results include partial matches when appropriate?
- Are missing ingredients explicitly identified?
- Are vegetarian, vegan, and gluten-free filters enforced correctly?
- Is the preparation-time filter applied before display?
- Are unselected baseline seasonings excluded from missing ingredients and the score denominator?
- Is sort order stable and based on relevance?
