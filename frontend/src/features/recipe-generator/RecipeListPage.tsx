import { useSelector, useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recipes } from '@/data/recipes'
import { getRecipeMatches } from '@/lib/recipeMatching'
import {
  setCurrentPage,
  setSelectedRecipeId,
} from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

export function RecipeListPage() {
  const dispatch = useDispatch()
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const filters = useSelector((state: RootState) => state.recipeGenerator.filters)

  const matches = getRecipeMatches(recipes, selectedIngredients, filters)

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Recipe list
          </p>
          <h1 className="text-3xl font-bold">Matching recipes</h1>
        </div>
        <Button variant="outline" onClick={() => dispatch(setCurrentPage('home'))}>
          Back to ingredients
        </Button>
      </header>

      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-medium">Your selection</p>
        <p>
          {selectedIngredients.length > 0
            ? selectedIngredients.join(', ')
            : 'No ingredients selected'}
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No recipes match</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              Try adjusting your filters or selecting more ingredients from the
              fridge.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {matches.map(({ recipe, missingIngredients, matchPercentage }) => (
            <Card key={recipe.id} className="overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="h-48 w-full object-cover"
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-xl">{recipe.name}</CardTitle>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    {matchPercentage}% match
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600">{recipe.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    {recipe.prepTimeMinutes} min
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    {recipe.difficulty}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">
                    {recipe.servings} servings
                  </span>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-slate-700">
                    Missing ingredients
                  </p>
                  {missingIngredients.length === 0 ? (
                    <p className="text-sm text-emerald-700">You have all ingredients.</p>
                  ) : (
                    <ul className="list-disc pl-5 text-sm text-amber-700">
                      {missingIngredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    dispatch(setSelectedRecipeId(recipe.id))
                    dispatch(setCurrentPage('detail'))
                  }}
                >
                  View recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
