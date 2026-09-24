import { useSelector, useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recipes } from '@/data/recipes'
import { setCurrentPage } from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

export function RecipeDetailsPage() {
  const dispatch = useDispatch()
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const selectedRecipeId = useSelector(
    (state: RootState) => state.recipeGenerator.selectedRecipeId,
  )

  const recipe = recipes.find((item) => item.id === selectedRecipeId)

  if (!recipe) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Recipe not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-600">
              This recipe is no longer available. Please return to the list.
            </p>
            <Button onClick={() => dispatch(setCurrentPage('list'))}>
              Back to recipes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedSet = new Set(selectedIngredients.map((item) => item.toLowerCase()))

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Button variant="outline" onClick={() => dispatch(setCurrentPage('list'))}>
        Back to recipes
      </Button>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img src={recipe.image} alt={recipe.name} className="h-64 w-full object-cover" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            {recipe.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mb-4 text-slate-600">{recipe.description}</p>

          <div className="mb-6 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Prep: {recipe.prepTimeMinutes} min
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Difficulty: {recipe.difficulty}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Servings: {recipe.servings}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-xl font-semibold">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => {
                const isAvailable = selectedSet.has(ingredient.name.toLowerCase())
                return (
                  <li
                    key={ingredient.name}
                    className={[
                      'flex items-center justify-between rounded-lg border px-3 py-2 text-sm',
                      isAvailable
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-amber-200 bg-amber-50 text-amber-800',
                    ].join(' ')}
                  >
                    <span>{ingredient.name}</span>
                    <span>{ingredient.quantity}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold">Method</h2>
            <ol className="space-y-3">
              {recipe.steps.map((step, index) => (
                <li key={step} className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                  <span className="mr-2 font-semibold text-slate-900">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fridge check</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-slate-600">You selected:</p>
              <ul className="space-y-1 text-sm">
                {selectedIngredients.length > 0 ? (
                  selectedIngredients.map((ingredient) => (
                    <li key={ingredient}>• {ingredient}</li>
                  ))
                ) : (
                  <li className="text-slate-500">No ingredients selected.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
