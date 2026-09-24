export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free'

export interface RecipeIngredient {
  name: string
  quantity: string
}

export interface UkrainianRecipeContent {
  name: string
  description: string
  ingredients: RecipeIngredient[]
  steps: string[]
}

export interface Recipe {
  id: string
  name: string
  description: string
  uk: UkrainianRecipeContent
  image: string
  prepTimeMinutes: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  servings: number
  dietaryTags: DietaryTag[]
  ingredients: RecipeIngredient[]
  steps: string[]
}

export interface RecipeFilters {
  vegetarian: boolean
  vegan: boolean
  glutenFree: boolean
  maxPrepMinutes: number | null
}

export interface RecipeMatch {
  recipe: Recipe
  availableIngredients: string[]
  missingIngredients: string[]
  matchCount: number
  matchPercentage: number
}
