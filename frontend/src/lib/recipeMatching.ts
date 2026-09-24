import type { Recipe, RecipeFilters, RecipeMatch } from '@/types/recipe'

export const normalizeIngredient = (ingredient: string) =>
  ingredient
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const getIngredientOptions = (recipes: Recipe[]) => {
  const names = new Set<string>()
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => names.add(ingredient.name))
  })
  return Array.from(names).sort((left, right) => left.localeCompare(right))
}

export const getRecipeMatches = (
  recipes: Recipe[],
  selectedIngredients: string[],
  filters: RecipeFilters,
): RecipeMatch[] => {
  const selectedSet = new Set(
    selectedIngredients.map((ingredient) => normalizeIngredient(ingredient)),
  )

  const filteredRecipes = recipes.filter((recipe) => {
    if (filters.vegetarian && !recipe.dietaryTags.includes('vegetarian')) {
      return false
    }

    if (filters.vegan && !recipe.dietaryTags.includes('vegan')) {
      return false
    }

    if (filters.glutenFree && !recipe.dietaryTags.includes('gluten-free')) {
      return false
    }

    if (
      filters.maxPrepMinutes !== null &&
      recipe.prepTimeMinutes > filters.maxPrepMinutes
    ) {
      return false
    }

    return true
  })

  return filteredRecipes
    .map((recipe) => {
      const availableIngredients = recipe.ingredients.filter((ingredient) =>
        selectedSet.has(normalizeIngredient(ingredient.name)),
      )

      const missingIngredients = recipe.ingredients.filter(
        (ingredient) => !selectedSet.has(normalizeIngredient(ingredient.name)),
      )

      const matchCount = availableIngredients.length
      const matchPercentage =
        selectedIngredients.length === 0
          ? 0
          : Math.round((matchCount / selectedIngredients.length) * 100)

      return {
        recipe,
        availableIngredients: availableIngredients.map((item) => item.name),
        missingIngredients: missingIngredients.map((item) => item.name),
        matchCount,
        matchPercentage,
      }
    })
    .filter((match) => match.matchCount > 0 || selectedIngredients.length > 0)
    .sort((left, right) => {
      if (right.matchPercentage !== left.matchPercentage) {
        return right.matchPercentage - left.matchPercentage
      }
      if (right.matchCount !== left.matchCount) {
        return right.matchCount - left.matchCount
      }
      return left.recipe.name.localeCompare(right.recipe.name)
    })
}
