import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RecipeFilters } from '@/types/recipe'

export type AppPage = 'home' | 'list' | 'detail'

interface RecipeGeneratorState {
  selectedIngredients: string[]
  filters: RecipeFilters
  currentPage: AppPage
  selectedRecipeId: string | null
}

const initialFilters: RecipeFilters = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  maxPrepMinutes: null,
}

const initialState: RecipeGeneratorState = {
  selectedIngredients: [],
  filters: initialFilters,
  currentPage: 'home',
  selectedRecipeId: null,
}

const recipeGeneratorSlice = createSlice({
  name: 'recipeGenerator',
  initialState,
  reducers: {
    toggleIngredient(state, action: PayloadAction<string>) {
      const ingredient = action.payload
      const alreadySelected = state.selectedIngredients.includes(ingredient)

      state.selectedIngredients = alreadySelected
        ? state.selectedIngredients.filter((item) => item !== ingredient)
        : [...state.selectedIngredients, ingredient]
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.selectedIngredients = state.selectedIngredients.filter(
        (ingredient) => ingredient !== action.payload,
      )
    },
    setFilter(
      state,
      action: PayloadAction<{
        field: keyof RecipeFilters
        value: boolean | number | null
      }>,
    ) {
      const { field, value } = action.payload
      state.filters = {
        ...state.filters,
        [field]: value,
      }
    },
    setCurrentPage(state, action: PayloadAction<AppPage>) {
      state.currentPage = action.payload
    },
    setSelectedRecipeId(state, action: PayloadAction<string | null>) {
      state.selectedRecipeId = action.payload
    },
    clearSelection(state) {
      state.selectedIngredients = []
      state.filters = initialFilters
      state.selectedRecipeId = null
      state.currentPage = 'home'
    },
    hydrateState(state, action: PayloadAction<RecipeGeneratorState | null>) {
      const nextState = action.payload
      if (!nextState) {
        return
      }
      state.selectedIngredients = nextState.selectedIngredients
      state.filters = nextState.filters
      state.currentPage = nextState.currentPage
      state.selectedRecipeId = nextState.selectedRecipeId
    },
  },
})

export const {
  toggleIngredient,
  removeIngredient,
  setFilter,
  setCurrentPage,
  setSelectedRecipeId,
  clearSelection,
  hydrateState,
} = recipeGeneratorSlice.actions

export default recipeGeneratorSlice.reducer
