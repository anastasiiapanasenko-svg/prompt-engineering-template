import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { HomePage } from '@/features/recipe-generator/HomePage'
import { RecipeDetailsPage } from '@/features/recipe-generator/RecipeDetailsPage'
import { RecipeListPage } from '@/features/recipe-generator/RecipeListPage'
import { setLanguage, hydrateState } from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

function App() {
  const dispatch = useDispatch()
  const currentPage = useSelector(
    (state: RootState) => state.recipeGenerator.currentPage,
  )
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const filters = useSelector((state: RootState) => state.recipeGenerator.filters)
  const selectedRecipeId = useSelector(
    (state: RootState) => state.recipeGenerator.selectedRecipeId,
  )
  const language = useSelector((state: RootState) => state.recipeGenerator.language)

  useEffect(() => {
    const savedState = window.sessionStorage.getItem('recipe-generator-state')
    if (!savedState) {
      return
    }

    try {
      const parsed = JSON.parse(savedState)
      dispatch(hydrateState(parsed))
    } catch {
      window.sessionStorage.removeItem('recipe-generator-state')
    }
  }, [dispatch])

  useEffect(() => {
    const state = {
      selectedIngredients,
      filters,
      currentPage,
      selectedRecipeId,
      language,
    }

    window.sessionStorage.setItem(
      'recipe-generator-state',
      JSON.stringify(state),
    )
  }, [currentPage, filters, language, selectedIngredients, selectedRecipeId])

  useEffect(() => {
    const browserLanguage = navigator.language.toLowerCase().startsWith('uk')
      ? 'uk'
      : 'en'
    if (!window.sessionStorage.getItem('recipe-generator-state')) {
      dispatch(setLanguage(browserLanguage))
    }
  }, [dispatch])

  if (currentPage === 'list') {
    return <RecipeListPage />
  }

  if (currentPage === 'detail') {
    return <RecipeDetailsPage />
  }

  return <HomePage />
}

export default App
