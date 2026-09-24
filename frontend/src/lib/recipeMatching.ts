import type { Recipe, RecipeFilters, RecipeMatch } from '@/types/recipe'

export const normalizeIngredient = (ingredient: string) =>
  ingredient
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
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

  const matches = filteredRecipes
    .map((recipe) => {
      const availableIngredients = recipe.ingredients.filter((ingredient) =>
        selectedSet.has(normalizeIngredient(ingredient.name)),
      )

      const missingIngredients = recipe.ingredients.filter(
        (ingredient) => !selectedSet.has(normalizeIngredient(ingredient.name)),
      )

      const matchCount = availableIngredients.length
      const matchPercentage =
          recipe.ingredients.length === 0
          ? 0
            : Math.round((matchCount / recipe.ingredients.length) * 100)

      return {
        recipe,
        availableIngredients: availableIngredients.map((item) => item.name),
        missingIngredients: missingIngredients.map((item) => item.name),
        matchCount,
        matchPercentage,
      }
    })
    .filter((match) => match.matchPercentage > 0)

  matches.sort((a, b) => b.matchPercentage - a.matchPercentage)

  return matches
}
