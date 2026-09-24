---
name: local-json-recipe-matching
description: Use this skill when implementing local recipe matching, filtering, sorting, and missing-ingredient logic for the recipe generator.
---

# Local JSON Recipe Matching Skill

## When to use

Use this skill for:

- Matching selected ingredients against recipes in a local JSON dataset
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

## Preferred implementation approach

- Load recipe records once from the local JSON data source.
- Filter by dietary tags and preparation-time constraints.
- For each recipe, compute:
  - total relevant ingredients
  - matched ingredients
  - missing ingredients
  - match percentage
- Return the final list sorted by relevance and then by a stable secondary key such as name.

## Validation checklist

- Do recipe results include partial matches when appropriate?
- Are missing ingredients explicitly identified?
- Are vegetarian, vegan, and gluten-free filters enforced correctly?
- Is the preparation-time filter applied before display?
- Is sort order stable and based on relevance?
