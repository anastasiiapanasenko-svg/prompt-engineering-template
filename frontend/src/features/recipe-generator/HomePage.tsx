import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recipes } from '@/data/recipes'
import { localizedIngredient, type Language } from '@/lib/i18n'
import { getRecipeMatches } from '@/lib/recipeMatching'
import {
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
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const filters = useSelector((state: RootState) => state.recipeGenerator.filters)
  const language = useSelector((state: RootState) => state.recipeGenerator.language)

  const matches = getRecipeMatches(recipes, selectedIngredients, filters)
  const submitEnabled = selectedIngredients.length > 0

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-[#fef3c7]">
      <div className="mx-auto max-w-6xl">
        <header
          className="mb-8 rounded-[32px] border border-amber-500/20 bg-[#0d0704]/60 bg-cover bg-center p-3 text-[#fef3c7] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-brightness-75"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(13, 7, 4, 0.88), rgba(58, 29, 14, 0.62)), url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="rounded-3xl border border-amber-500/20 bg-[#120a06]/50 p-8 text-[#fef3c7] shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                  {language === 'uk' ? 'Генератор рецептів' : 'Recipe generator'}
                </p>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {language === 'uk' ? 'Підбір за інгредієнтами' : 'Fridge Ingredient Match'}
                </h1>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-100/10 p-1 backdrop-blur-sm">
                {(['en', 'uk'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => dispatch(setLanguage(option))}
                    className={[
                      'rounded-full px-3 py-1.5 text-sm font-medium transition',
                      language === option
                        ? 'bg-amber-400 text-[#120a06] shadow-md'
                        : 'text-amber-100/80 hover:bg-amber-100/10',
                    ].join(' ')}
                  >
                    {option === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm text-amber-50 md:text-base">
              {language === 'uk'
                ? 'Виберіть, що вже є у вашому холодильнику, і знайдіть найкращі рецепти за лічені хвилини.'
                : 'Select what is already in your fridge and discover the best recipes in minutes.'}
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <Card className="border border-amber-500/20 bg-[#1e100a]/35 text-[#fef3c7] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-2xl text-[#fef3c7]">
                {language === 'uk' ? 'Виберіть інгредієнти' : 'Choose ingredients'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-5 flex min-h-14 flex-wrap gap-2">
                {selectedIngredients.length === 0 ? (
                  <p className="text-sm text-[#d6b98c]">
                    {language === 'uk' ? 'Інгредієнти ще не вибрані.' : 'No ingredients selected yet.'}
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

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {recipes
                  .flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.name))
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .sort((left, right) => left.localeCompare(right))
                  .map((ingredient) => {
                    const active = selectedIngredients.includes(ingredient)
                    return (
                      <button
                        key={ingredient}
                        type="button"
                        onClick={() => dispatch(toggleIngredient(ingredient))}
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
            </CardContent>
          </Card>

          <Card className="border border-amber-500/20 bg-[#1e100a]/35 text-[#fef3c7] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-2xl text-[#fef3c7]">
                {language === 'uk' ? 'Фільтри' : 'Filters'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#f3f4f6]">
                  {language === 'uk' ? 'Дієтичні переваги' : 'Dietary preferences'}
                </p>
                <div className="space-y-2">
                  {[
                    ['vegetarian', language === 'uk' ? 'Вегетаріанське' : 'Vegetarian'],
                    ['vegan', language === 'uk' ? 'Веганське' : 'Vegan'],
                    ['glutenFree', language === 'uk' ? 'Без глютену' : 'Gluten-Free'],
                  ].map(([field, label]) => (
                    <label
                      key={field}
                      className={[
                        'flex items-center justify-between rounded-xl border p-2.5 transition',
                        Boolean(filters[field as keyof typeof filters])
                          ? 'border-amber-500 bg-amber-400/20 text-amber-200'
                          : 'border border-amber-400/15 bg-amber-950/20 text-[#f3f4f6] backdrop-blur-md transition-all duration-300 hover:bg-amber-900/40',
                      ].join(' ')}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(filters[field as keyof typeof filters] as boolean)}
                        onChange={(event) =>
                          dispatch(
                            setFilter({
                              field: field as keyof typeof filters,
                              value: event.target.checked,
                            }),
                          )
                        }
                        className="h-4 w-4 accent-amber-700"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[#f3f4f6]">
                  {language === 'uk' ? 'Максимальний час приготування' : 'Max prep time'}
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Any', value: null },
                    { label: '< 15 min', value: 15 },
                    { label: '< 30 min', value: 30 },
                    { label: '< 60 min', value: 60 },
                  ].map(({ label, value }) => (
                    <label
                      key={label}
                      className={[
                        'flex items-center justify-between rounded-xl border p-2.5 transition',
                        filters.maxPrepMinutes === value
                          ? 'border-amber-500 bg-amber-400/20 text-amber-200'
                          : 'border border-amber-400/15 bg-amber-950/20 text-[#f3f4f6] backdrop-blur-md transition-all duration-300 hover:bg-amber-900/40',
                      ].join(' ')}
                    >
                      <span className="text-sm font-medium">
                        {language === 'uk' ? getLocalizedPrepLabel(language, value) : label}
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
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => dispatch(setCurrentPage('list'))}
            disabled={!submitEnabled}
            className="h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-5 font-semibold text-[#120a06] shadow-lg shadow-amber-900/50 transition hover:from-amber-400 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {language === 'uk' ? 'Згенерувати рецепти' : 'Generate recipes'}
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
