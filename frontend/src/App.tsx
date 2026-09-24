import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { HomePage } from '@/features/recipe-generator/HomePage'
import { RecipeDetailsPage } from '@/features/recipe-generator/RecipeDetailsPage'
import { RecipeListPage } from '@/features/recipe-generator/RecipeListPage'
import { hydrateState } from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

function App() {
  const dispatch = useDispatch()
  const currentPage = useSelector(
    (state: RootState) => state.recipeGenerator.currentPage,
  )

  useEffect(() => {
    const savedState = localStorage.getItem('recipe-generator-state')
    if (savedState) {
      try {
        dispatch(hydrateState(JSON.parse(savedState)))
      } catch {
        localStorage.removeItem('recipe-generator-state')
      }
    }
  }, [dispatch])

  useEffect(() => {
    const state = {
      selectedIngredients: useSelector(
        (state: RootState) => state.recipeGenerator.selectedIngredients,
      ),
      filters: useSelector((state: RootState) => state.recipeGenerator.filters),
      currentPage,
      selectedRecipeId: useSelector(
        (state: RootState) => state.recipeGenerator.selectedRecipeId,
      ),
    }
    localStorage.setItem('recipe-generator-state', JSON.stringify(state))
  }, [currentPage, dispatch])

  if (currentPage === 'list') {
    return <RecipeListPage />
  }

  if (currentPage === 'detail') {
    return <RecipeDetailsPage />
  }

  return <HomePage />
}

export default App
