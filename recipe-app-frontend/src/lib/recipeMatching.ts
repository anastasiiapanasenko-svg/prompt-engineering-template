import type { Recipe, RecipeFilters, RecipeMatch } from '@/types/recipe'
import { basicSeasoningIngredients, normalizeIngredientKey } from '@/lib/i18n'

export const normalizeIngredient = (ingredient: string) =>
  normalizeIngredientKey(ingredient)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const basicSeasoningSet = new Set(
  basicSeasoningIngredients.map(normalizeIngredient),
)

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
      const scoredIngredients = recipe.ingredients.filter(
        (ingredient) =>
          !basicSeasoningSet.has(normalizeIngredient(ingredient.name)),
      )
      const availableIngredients = recipe.ingredients.filter((ingredient) =>
        selectedSet.has(normalizeIngredient(ingredient.name)),
      )

      const missingIngredients = recipe.ingredients.filter((ingredient) => {
        const normalizedName = normalizeIngredient(ingredient.name)
        return (
          !selectedSet.has(normalizedName) &&
          !basicSeasoningSet.has(normalizedName)
        )
      })

      const matchCount = scoredIngredients.filter((ingredient) =>
        selectedSet.has(normalizeIngredient(ingredient.name)),
      ).length
      const matchPercentage =
        scoredIngredients.length === 0
          ? 0
          : Math.round((matchCount / scoredIngredients.length) * 100)

      return {
        recipe,
        availableIngredients: availableIngredients.map((item) => item.name),
        missingIngredients: missingIngredients.map((item) => item.name),
        matchCount,
        matchPercentage,
      }
    })
    .filter((match) => match.matchPercentage > 0)

  matches.sort(
    (a, b) =>
      b.matchPercentage - a.matchPercentage ||
      a.missingIngredients.length - b.missingIngredients.length ||
      a.recipe.name.localeCompare(b.recipe.name),
  )

  return matches
}
