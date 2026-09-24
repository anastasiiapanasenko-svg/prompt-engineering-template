import { useSelector, useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRecipeImage, recipes } from '@/data/recipes'
import {
  difficultyLabel,
  localizedIngredient,
  recipeDescription,
  recipeIngredients,
  recipeName,
} from '@/lib/i18n'
import { getRecipeMatches } from '@/lib/recipeMatching'
import { setCurrentPage, setLanguage, setSelectedRecipeId } from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

export function RecipeListPage() {
  const dispatch = useDispatch()
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const filters = useSelector((state: RootState) => state.recipeGenerator.filters)
  const language = useSelector((state: RootState) => state.recipeGenerator.language)

  const matches = getRecipeMatches(recipes, selectedIngredients, filters)

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-[#fef3c7]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-amber-500/20 bg-[#1e100a]/35 p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => dispatch(setCurrentPage('home'))}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-500/20 bg-[#26150d]/60 px-4 py-2 text-amber-300 shadow-md backdrop-blur-md transition-all hover:bg-amber-900/40 hover:text-amber-200"
            >
              <span aria-hidden="true">←</span>
              {language === 'uk' ? 'Назад до інгредієнтів' : 'Back to Ingredients'}
            </Button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">
                {language === 'uk' ? 'Список рецептів' : 'Recipe list'}
              </p>
              <h1 className="text-3xl font-bold text-[#fef3c7]">
                {language === 'uk' ? 'Рецепти, що підходять' : 'Matching recipes'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-amber-400/15 bg-amber-950/20 p-1 backdrop-blur-md">
              {(['en', 'uk'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => dispatch(setLanguage(option))}
                  className={[
                    'rounded-full px-2.5 py-1 text-xs font-medium transition',
                    language === option
                      ? 'bg-amber-400 text-[#120a06] shadow-sm'
                      : 'text-amber-200 hover:bg-amber-900/40',
                  ].join(' ')}
                >
                  {option === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-[#1e100a]/35 p-4 text-sm text-[#f3f4f6] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <p className="font-semibold text-[#fef3c7]">
            {language === 'uk' ? 'Ваш вибір' : 'Your selection'}
          </p>
          <p className="mt-1">
            {selectedIngredients.length > 0
                ? selectedIngredients
                  .map((ingredient) => localizedIngredient(ingredient, language))
                  .join(', ')
              : language === 'uk'
                ? 'Інгредієнти не вибрані'
                : 'No ingredients selected'}
          </p>
        </div>

        {matches.length === 0 ? (
          <Card className="border border-amber-500/20 bg-[#1e100a]/35 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-[#fef3c7]">
                {language === 'uk' ? 'Рецепти не знайдено' : 'No recipes match'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#d6b98c]">
                {language === 'uk'
                  ? 'Спробуйте змінити фільтри або вибрати більше інгредієнтів зі списку.'
                  : 'Try adjusting your filters or selecting more ingredients from the fridge.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {matches.map(({ recipe, availableIngredients, matchPercentage }) => {
              const localizedIngredients = recipeIngredients(recipe, language)
              const availableSet = new Set(availableIngredients)
              const ingredientRows = recipe.ingredients.map((ingredient, index) => ({
                canonical: ingredient.name,
                display: localizedIngredients[index],
              }))
              const availableRows = ingredientRows.filter((ingredient) =>
                availableSet.has(ingredient.canonical),
              )
              const missingRows = ingredientRows.filter(
                (ingredient) => !availableSet.has(ingredient.canonical),
              )

              return (
              <Card key={recipe.id} className="overflow-hidden border border-amber-500/20 bg-[#1e100a]/35 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.45)]">
                <img
                  src={getRecipeImage(recipe)}
                  alt={recipeName(recipe, language)}
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                  }}
                  className="h-52 w-full object-cover"
                />
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-xl text-[#fef3c7]">{recipeName(recipe, language)}</CardTitle>
                    <span className="rounded-full bg-amber-400/20 px-2 py-1 text-xs font-semibold text-amber-200">
                      {matchPercentage}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-[#d6b98c]">{recipeDescription(recipe, language)}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                    <span className="rounded-full border border-amber-400/15 bg-amber-950/20 px-2 py-1 text-[#f3f4f6] backdrop-blur-md">
                      {recipe.prepTimeMinutes} {language === 'uk' ? 'хв' : 'min'}
                    </span>
                    <span className="rounded-full border border-amber-400/15 bg-amber-950/20 px-2 py-1 text-[#f3f4f6] backdrop-blur-md">
                      {difficultyLabel(recipe.difficulty, language)}
                    </span>
                    <span className="rounded-full border border-amber-400/15 bg-amber-950/20 px-2 py-1 text-[#f3f4f6] backdrop-blur-md">
                      {recipe.servings} {language === 'uk' ? 'порції' : 'servings'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-emerald-300">
                        {language === 'uk' ? 'Є в наявності' : 'Available'}
                      </p>
                      {availableRows.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {availableRows.map(({ canonical, display }) => (
                            <span key={canonical} className="rounded-lg border border-emerald-700 bg-emerald-900/50 px-2.5 py-1.5 text-xs text-emerald-200">
                              {display.name} · {display.quantity}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#d6b98c]">
                          {language === 'uk' ? 'Поки немає збігів.' : 'No matching ingredients yet.'}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-amber-300">
                        {language === 'uk' ? 'Потрібно докупити' : 'Need to buy'}
                      </p>
                      {missingRows.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {missingRows.map(({ canonical, display }) => (
                            <span key={canonical} className="rounded-lg border border-amber-800/40 bg-amber-950/40 px-2.5 py-1.5 text-xs text-amber-300/80">
                              {display.name} · {display.quantity}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-300">
                          {language === 'uk' ? 'Усі інгредієнти вже є.' : 'You have everything needed.'}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-[#120a06] shadow-lg shadow-amber-900/50"
                    onClick={() => {
                      dispatch(setSelectedRecipeId(recipe.id))
                      dispatch(setCurrentPage('detail'))
                    }}
                  >
                    {language === 'uk' ? 'Переглянути рецепт' : 'View recipe'}
                  </Button>
                </CardContent>
              </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
