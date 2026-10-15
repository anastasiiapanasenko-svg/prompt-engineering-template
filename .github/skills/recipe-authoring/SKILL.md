---
name: recipe-authoring
description: Use this skill when adding or editing bilingual recipe records in the local dataset.
---

# Recipe Authoring Skill

## When to use

- Add or update a recipe in `frontend/src/data/recipes.ts`.
- Add ingredients needed by a new recipe to the selectable catalog.
- Maintain matching, localization, and image behavior for recipe records.

## Rules

- Keep recipe content in the local TypeScript dataset; do not add runtime APIs or backend persistence.
- Follow the `Recipe` and `RecipeIngredient` interfaces in `frontend/src/types/recipe.ts`. Use supported difficulty values and dietary tags.
- Provide complete English and Ukrainian names, descriptions, ingredient names/quantities, and ordered preparation steps through the established recipe shape.
- Use canonical English ingredient names consistently for matching. Add each new selectable ingredient to the dataset catalog, the EN/UA catalog in `frontend/src/lib/i18n.ts`, and exactly one category mapping.
- Use a relevant Unsplash image URL and preserve the existing image ownership, keyword fallback, and rendered `onError` fallback behavior.
- Do not invent recipe metadata fields that are not in the shared `Recipe` interface.

## Workflow

1. Read the shared recipe types, nearby recipe records, matching/localization helpers, and applicable media/domain rules.
2. Create a unique recipe id and complete bilingual content using the existing schema.
3. Check ingredient names against both catalogs before adding entries; avoid duplicates and preserve canonical spelling.
4. Confirm the recipe is selectable/matchable and that the language toggle localizes every recipe field.
5. Run the relevant typecheck, lint, and build scripts from `frontend/`.
