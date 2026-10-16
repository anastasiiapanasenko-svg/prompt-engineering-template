import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ingredientCatalog as datasetIngredientCatalog,
  recipes,
} from '@/data/recipes'
import { AccountPanel } from '@/features/recipe-generator/AccountPanel'
import {
  apiRequest,
  localizedApiErrorMessage,
  type AuthUser,
  type CustomProduct,
} from '@/lib/api'
import {
  basicSeasoningIngredients,
  getIngredientCategory,
  ingredientCategories,
  localizedIngredient,
  seasoningIngredients,
  type Language,
  uiText,
} from '@/lib/i18n'
import { getIngredientOptions, getRecipeMatches } from '@/lib/recipeMatching'
import {
  addIngredients,
  clearSelection,
  removeIngredient,
  setCurrentPage,
  setFilter,
  setLanguage,
  toggleIngredient,
} from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

const getLocalizedPrepLabel = (language: Language, value: number | null) => {
  const labels = {
    en: ['Any', '< 15 min', '< 30 min', '< 60 min'],
    uk: ['Будь-який', '< 15 хв', '< 30 хв', '< 60 хв'],
  }

  const index = value === null ? 0 : value === 15 ? 1 : value === 30 ? 2 : 3
  return labels[language][index]
}

export function HomePage() {
  const dispatch = useDispatch()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([])
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [isSavingSearch, setIsSavingSearch] = useState(false)
  const previousCustomProducts = useRef<string[] | null>(null)
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const filters = useSelector(
    (state: RootState) => state.recipeGenerator.filters,
  )
  const language = useSelector(
    (state: RootState) => state.recipeGenerator.language,
  )

  const matches = getRecipeMatches(recipes, selectedIngredients, filters)
  const submitEnabled = selectedIngredients.length > 0
  const ingredientOptions = Array.from(
    new Set([
      ...getIngredientOptions(recipes),
      ...datasetIngredientCatalog,
      ...seasoningIngredients,
      ...customProducts.map((product) => product.name),
    ]),
  )
  const customProductCategories = new Map(
    customProducts.map((product) => [product.name, product.category]),
  )

  const handleUserChange = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser)
    if (!nextUser) setHistoryError(null)
  }, [])

  const handleCustomProductsChange = useCallback(
    (nextProducts: CustomProduct[]) => setCustomProducts(nextProducts),
    [],
  )

  useEffect(() => {
    const previousNames = previousCustomProducts.current
    if (previousNames) {
      const nextNames = new Set(customProducts.map((product) => product.name))
      previousNames
        .filter((name) => !nextNames.has(name))
        .forEach((name) => dispatch(removeIngredient(name)))
    }
    previousCustomProducts.current = customProducts.map(
      (product) => product.name,
    )
  }, [customProducts, dispatch])

  const handleGenerateRecipes = async () => {
    if (!submitEnabled || isSavingSearch) return
    setHistoryError(null)
    if (user) {
      setIsSavingSearch(true)
      try {
        await apiRequest('/history', {
          method: 'POST',
          body: JSON.stringify({
            selectedIngredients,
            matchedRecipesCount: matches.length,
          }),
        })
        setHistoryRefreshKey((current) => current + 1)
      } catch (saveError) {
        setHistoryError(localizedApiErrorMessage(saveError, language))
        return
      } finally {
        setIsSavingSearch(false)
      }
    }
    dispatch(setCurrentPage('list'))
  }

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-[#fef3c7]">
      <div className="mx-auto max-w-7xl">
        <header
          className="relative z-40 mb-8 rounded-[32px] border border-amber-500/20 bg-[#0d0704]/60 bg-cover bg-center p-3 text-[#fef3c7] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-brightness-75"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(13, 7, 4, 0.88), rgba(58, 29, 14, 0.62)), url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="rounded-3xl border border-amber-500/20 bg-[#120a06]/50 p-8 text-[#fef3c7] shadow-2xl backdrop-blur-2xl">
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                  {language === 'uk'
                    ? 'Генератор рецептів'
                    : 'Recipe generator'}
                </p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {language === 'uk'
                    ? 'Підбір за інгредієнтами'
                    : 'Fridge Ingredient Match'}
                </h1>
              </div>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-100/10 p-1 backdrop-blur-sm">
                  {(['en', 'uk'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={language === option}
                      onClick={() => dispatch(setLanguage(option))}
                      className={[
                        'rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300',
                        language === option
                          ? 'bg-amber-400 text-[#120a06] shadow-md'
                          : 'text-amber-100/80 hover:bg-amber-100/10',
                      ].join(' ')}
                    >
                      {option === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
                    </button>
                  ))}
                </div>
                <AccountPanel
                  language={language}
                  onUserChange={handleUserChange}
                  onCustomProductsChange={handleCustomProductsChange}
                  historyRefreshKey={historyRefreshKey}
                  historyError={historyError}
                />
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm text-amber-50 md:text-base">
              {language === 'uk'
                ? 'Виберіть, що вже є у вашому холодильнику, і знайдіть найкращі рецепти за лічені хвилини.'
                : 'Select what is already in your fridge and discover the best recipes in minutes.'}
            </p>
          </div>
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <Card className="border border-amber-500/20 bg-[#1e100a]/35 text-[#fef3c7] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-[#fef3c7]">
                {language === 'uk'
                  ? 'Виберіть інгредієнти'
                  : 'Choose ingredients'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-5 flex min-h-14 flex-wrap gap-2">
                {selectedIngredients.length === 0 ? (
                  <p className="text-sm text-[#d6b98c]">
                    {language === 'uk'
                      ? 'Інгредієнти ще не вибрані.'
                      : 'No ingredients selected yet.'}
                  </p>
                ) : (
                  selectedIngredients.map((ingredient) => (
                    <button
                      key={ingredient}
                      type="button"
                      onClick={() => dispatch(removeIngredient(ingredient))}
                      className="rounded-full border border-amber-400/15 bg-amber-950/20 px-3 py-1.5 text-sm font-medium text-amber-200 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-900/40"
                    >
                      {localizedIngredient(ingredient, language)} ×
                    </button>
                  ))
                )}
              </div>

              <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                {ingredientCategories.map((category) => {
                  const categoryIngredients = ingredientOptions
                    .filter(
                      (ingredient) =>
                        (customProductCategories.get(ingredient) ??
                          getIngredientCategory(ingredient)) === category.id,
                    )
                    .sort((left, right) => left.localeCompare(right))

                  return (
                    <section
                      key={category.id}
                      className="flex h-full flex-col rounded-2xl border border-amber-400/20 bg-amber-950/15 p-4 backdrop-blur-md"
                      aria-labelledby={`ingredients-${category.id}`}
                    >
                      <div className="mb-3 flex min-h-12 flex-wrap items-start justify-between gap-3">
                        <h3
                          id={`ingredients-${category.id}`}
                          className="text-lg font-semibold text-[#fef3c7]"
                        >
                          <span aria-hidden="true">{category.icon} </span>
                          {language === 'uk' ? category.uk : category.en}
                        </h3>
                        {category.id === 'spices' ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              dispatch(
                                addIngredients(basicSeasoningIngredients),
                              )
                            }
                            className="rounded-xl border-amber-400/25 bg-amber-950/25 text-amber-100 hover:bg-amber-900/40"
                          >
                            {language === 'uk'
                              ? 'Додати базові спеції'
                              : 'Select Basic Spices'}
                          </Button>
                        ) : null}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {categoryIngredients.map((ingredient) => {
                          const active =
                            selectedIngredients.includes(ingredient)
                          return (
                            <button
                              key={ingredient}
                              type="button"
                              onClick={() =>
                                dispatch(toggleIngredient(ingredient))
                              }
                              aria-pressed={active}
                              className={[
                                'rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:-translate-y-0.5',
                                active
                                  ? 'border-amber-400 bg-gradient-to-r from-amber-500 to-yellow-500 text-[#120a06] shadow-lg shadow-amber-900/40'
                                  : 'border border-amber-400/15 bg-amber-950/20 text-[#f3f4f6] backdrop-blur-md transition-all duration-300 hover:border-amber-300/30 hover:bg-amber-900/40',
                              ].join(' ')}
                            >
                              {localizedIngredient(ingredient, language)}
                            </button>
                          )
                        })}
                      </div>
                      {category.id === 'spices' ? (
                        <p className="mt-auto pt-3 text-xs text-[#d6b98c]">
                          {language === 'uk'
                            ? 'Сіль, чорний перець і цукор не знижують відсоток збігу, якщо їх не вибрано.'
                            : 'Salt, black pepper, and sugar do not lower match percentages when unselected.'}
                        </p>
                      ) : null}
                    </section>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-500/20 bg-[#1e100a]/35 text-[#fef3c7] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-lg text-[#fef3c7]">
                {language === 'uk' ? 'Час приготування' : 'Cooking time'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-[#f3f4f6]">
                  {uiText[language].prepTime}
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Any', value: null },
                    { label: '< 15 min', value: 15 },
                    { label: '< 30 min', value: 30 },
                    { label: '< 60 min', value: 60 },
                  ].map(({ label, value }) => (
                    <label
                      key={label}
                      className={[
                        'flex items-center justify-between gap-2 rounded-xl border p-2.5 transition',
                        filters.maxPrepMinutes === value
                          ? 'border-amber-500 bg-amber-400/20 text-amber-200'
                          : 'border-amber-400/15 bg-amber-950/20 text-[#f3f4f6] hover:bg-amber-900/40',
                      ].join(' ')}
                    >
                      <span className="text-sm font-medium">
                        {language === 'uk'
                          ? getLocalizedPrepLabel(language, value)
                          : label}
                      </span>
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
                        className="h-4 w-4 accent-amber-700"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-4 rounded-xl border border-amber-400/20 bg-amber-950/15 p-3 backdrop-blur-md">
                <legend className="px-2 text-sm font-semibold text-[#f3f4f6]">
                  {uiText[language].dietary}
                </legend>
                <div className="space-y-2">
                  {[
                    ['vegetarian', uiText[language].vegetarian],
                    ['vegan', uiText[language].vegan],
                    ['glutenFree', uiText[language].glutenFree],
                  ].map(([field, label]) => (
                    <label
                      key={field}
                      className={[
                        'flex items-center justify-between gap-2 rounded-lg border p-2 transition',
                        filters[field as keyof typeof filters]
                          ? 'border-amber-500 bg-amber-400/20 text-amber-200'
                          : 'border-amber-400/15 bg-amber-950/20 text-[#f3f4f6] hover:bg-amber-900/40',
                      ].join(' ')}
                    >
                      <span className="text-sm font-medium">{label}</span>
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
                        className="h-4 w-4 shrink-0 accent-amber-700"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => void handleGenerateRecipes()}
            disabled={!submitEnabled || isSavingSearch}
            className="h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 font-semibold text-[#120a06] shadow-lg shadow-amber-900/50 transition hover:from-amber-400 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {language === 'uk'
              ? isSavingSearch
                ? 'Збереження пошуку…'
                : 'Згенерувати рецепти'
              : isSavingSearch
                ? 'Saving search…'
                : 'Generate recipes'}
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(clearSelection())}
            className="h-11 rounded-xl border-amber-400/15 bg-amber-950/20 text-amber-200 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:bg-amber-900/40"
          >
            {language === 'uk' ? 'Очистити все' : 'Clear all'}
          </Button>
          {!submitEnabled ? (
            <p className="text-sm font-medium text-amber-600">
              {language === 'uk'
                ? 'Виберіть принаймні один інгредієнт, щоб згенерувати рецепти.'
                : 'Select at least one ingredient to generate recipes.'}
            </p>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-500/20 bg-[#1e100a]/35 p-4 text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {selectedIngredients.length > 0 ? (
            <p className="font-medium text-[#f3f4f6]">
              {language === 'uk'
                ? `${matches.length} рецепт${matches.length === 1 ? '' : matches.length >= 2 && matches.length <= 4 ? 'и' : 'ів'} відповідає вашому вибору.`
                : `${matches.length} recipe${matches.length === 1 ? '' : 's'} match your selection.`}
            </p>
          ) : (
            <p className="text-[#d6b98c]">
              {language === 'uk'
                ? 'Почніть із вибору інгредієнтів зі списку.'
                : 'Start by selecting ingredients from the fridge list.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
