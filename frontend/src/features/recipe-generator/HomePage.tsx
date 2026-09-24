import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ingredientCatalog, recipes } from '@/data/recipes'
import { getRecipeMatches } from '@/lib/recipeMatching'
import {
  clearSelection,
  removeIngredient,
  setCurrentPage,
  setFilter,
  toggleIngredient,
} from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

const prepTimeOptions = [
  { label: 'Any', value: null },
  { label: '< 15 min', value: 15 },
  { label: '< 30 min', value: 30 },
  { label: '< 60 min', value: 60 },
] as const

export function HomePage() {
  const dispatch = useDispatch()
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const filters = useSelector((state: RootState) => state.recipeGenerator.filters)

  const matches = getRecipeMatches(recipes, selectedIngredients, filters)

  const submitEnabled = selectedIngredients.length > 0

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-8 rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-300">
          Recipe generator
        </p>
        <h1 className="text-3xl font-bold">Fridge Ingredient Match</h1>
        <p className="mt-2 max-w-2xl text-slate-200">
          Select what is already in your fridge and discover the best recipes in
          minutes.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Choose ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedIngredients.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No ingredients selected yet.
                </p>
              ) : (
                selectedIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() => dispatch(removeIngredient(ingredient))}
                    className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm transition hover:bg-slate-200"
                  >
                    {ingredient} ×
                  </button>
                ))
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ingredientCatalog.map((ingredient) => {
                const active = selectedIngredients.includes(ingredient)
                return (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() => dispatch(toggleIngredient(ingredient))}
                    className={[
                      'rounded-lg border px-3 py-2 text-left text-sm transition',
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                    ].join(' ')}
                  >
                    {ingredient}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Dietary preferences
              </p>
              <div className="space-y-2">
                {[
                  ['vegetarian', 'Vegetarian'],
                  ['vegan', 'Vegan'],
                  ['glutenFree', 'Gluten-Free'],
                ].map(([field, label]) => (
                  <label
                    key={field}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2"
                  >
                    <span className="text-sm">{label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(
                        filters[field as keyof typeof filters] as boolean,
                      )}
                      onChange={(event) =>
                        dispatch(
                          setFilter({
                            field: field as keyof typeof filters,
                            value: event.target.checked,
                          }),
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Max prep time
              </p>
              <div className="space-y-2">
                {prepTimeOptions.map(({ label, value }) => (
                  <label
                    key={label}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2"
                  >
                    <span className="text-sm">{label}</span>
                    <input
                      type="radio"
                      name="prepTime"
                      checked={filters.maxPrepMinutes === value}
                      onChange={() =>
                        dispatch(
                          setFilter({
                            field: 'maxPrepMinutes',
                            value,
                          }),
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          onClick={() => dispatch(setCurrentPage('list'))}
          disabled={!submitEnabled}
          className="disabled:cursor-not-allowed"
        >
          Generate recipes
        </Button>
        <Button variant="outline" onClick={() => dispatch(clearSelection())}>
          Clear all
        </Button>
        {!submitEnabled ? (
          <p className="text-sm text-amber-600">
            Select at least one ingredient to generate recipes.
          </p>
        ) : null}
      </div>

      <div className="mt-6 text-sm text-slate-600">
        {selectedIngredients.length > 0 ? (
          <p>
            {matches.length} recipe{matches.length === 1 ? '' : 's'} match your
            selection.
          </p>
        ) : (
          <p>Start by selecting ingredients from the fridge list.</p>
        )}
      </div>
    </div>
  )
}
