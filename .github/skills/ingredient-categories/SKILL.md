---
name: ingredient-categories
description: Use this skill when adding ingredients or refactoring ingredient categories and selector panels.
---

# Ingredient Categories Skill

## When to use

- Add an ingredient to the selector.
- Change category assignments or category labels.
- Refactor category panels in the Home ingredient selector.

## Source of truth

- Canonical selector names: `ingredientCatalog` in `recipe-app-frontend/src/data/recipes.ts`.
- Bilingual names and normalized keys: `ingredientCatalog` and `ingredientKeyMap` in `recipe-app-frontend/src/lib/i18n.ts`.
- Exactly-one-category lookup and localized panel headings: `ingredientCategoryByName` and `ingredientCategories` in `recipe-app-frontend/src/lib/i18n.ts`.
- Category union: `IngredientCategory` in `recipe-app-frontend/src/types/recipe.ts`.
- Selector option assembly and rendering: `recipe-app-frontend/src/features/recipe-generator/HomePage.tsx`.

## Rules

- Use only these category ids: `meat`, `grains`, `vegetables`, `fruits`, `dairy`, `bakery`, `spices`, and `pantry`.
- Every selectable ingredient must have a canonical dataset entry, an EN/UA translation, and exactly one category assignment.
- Reuse an existing name when possible; do not create case- or spelling-variant duplicates.
- Keep recipe ingredient names compatible with the canonical catalog so normalization and localization work in matching, selection chips, and recipe details.
- Keep category headings bilingual and preserve responsive, accessible panels.
- If changing the category union, update all category metadata and assignments in the same change.

## Workflow

1. Inspect the type union, both catalogs, category lookup, and selector option assembly.
2. Add or update canonical and bilingual labels plus one category mapping.
3. Check that every catalog/recipe/seasoning selector option resolves to a label and category.
4. Verify the category displays in English and Ukrainian and selection/removal still updates shared state.
5. Run `npm run typecheck`, `npm run lint`, and `npm run build` from `recipe-app-frontend/`.
