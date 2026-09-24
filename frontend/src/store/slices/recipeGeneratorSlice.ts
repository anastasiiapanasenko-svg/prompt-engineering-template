import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Language } from '@/lib/i18n'
import type { RecipeFilters } from '@/types/recipe'

export type AppPage = 'home' | 'list' | 'detail'

interface RecipeGeneratorState {
  selectedIngredients: string[]
  filters: RecipeFilters
  currentPage: AppPage
  selectedRecipeId: string | null
  language: Language
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
  language: 'en',
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
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
    },
    clearSelection(state) {
      state.selectedIngredients = []
      state.filters = initialFilters
      state.selectedRecipeId = null
      state.currentPage = 'home'
    },
    hydrateState(state, action: PayloadAction<Partial<RecipeGeneratorState> | null>) {
      const nextState = action.payload
      if (!nextState) {
        return
      }

      if (Array.isArray(nextState.selectedIngredients)) {
        state.selectedIngredients = nextState.selectedIngredients
      }

      if (nextState.filters) {
        state.filters = {
          vegetarian: Boolean(nextState.filters.vegetarian),
          vegan: Boolean(nextState.filters.vegan),
          glutenFree: Boolean(nextState.filters.glutenFree),
          maxPrepMinutes:
            nextState.filters.maxPrepMinutes === null ||
            nextState.filters.maxPrepMinutes === undefined
              ? null
              : Number(nextState.filters.maxPrepMinutes),
        }
      }

      if (
        nextState.currentPage === 'home' ||
        nextState.currentPage === 'list' ||
        nextState.currentPage === 'detail'
      ) {
        state.currentPage = nextState.currentPage
      }

      if (
        typeof nextState.selectedRecipeId === 'string' ||
        nextState.selectedRecipeId === null
      ) {
        state.selectedRecipeId = nextState.selectedRecipeId
      }

      if (nextState.language === 'en' || nextState.language === 'uk') {
        state.language = nextState.language
      }
    },
  },
})

export const {
  toggleIngredient,
  removeIngredient,
  setFilter,
  setCurrentPage,
  setSelectedRecipeId,
  setLanguage,
  clearSelection,
  hydrateState,
} = recipeGeneratorSlice.actions

export default recipeGeneratorSlice.reducer
