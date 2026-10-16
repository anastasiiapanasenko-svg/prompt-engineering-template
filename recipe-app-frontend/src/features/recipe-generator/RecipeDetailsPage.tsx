import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRecipeImage, recipes } from '@/data/recipes'
import {
  dietaryTagLabel,
  difficultyLabel,
  localizedIngredient,
  recipeDescription,
  recipeIngredients,
  recipeName,
  recipeSteps,
} from '@/lib/i18n'
import { setCurrentPage, setLanguage } from '@/store/slices/recipeGeneratorSlice'
import type { RootState } from '@/store/store'

export function RecipeDetailsPage() {
  const dispatch = useDispatch()
  const selectedIngredients = useSelector(
    (state: RootState) => state.recipeGenerator.selectedIngredients,
  )
  const selectedRecipeId = useSelector(
    (state: RootState) => state.recipeGenerator.selectedRecipeId,
  )
  const language = useSelector((state: RootState) => state.recipeGenerator.language)
  const recipe = recipes.find((item) => item.id === selectedRecipeId)

  if (!recipe) {
    return (
      <div className="min-h-screen bg-transparent px-4 py-8 text-[#fef3c7]">
        <Card className="mx-auto max-w-3xl border border-amber-500/20 bg-[#1e100a]/35 text-[#fef3c7] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {language === 'uk' ? 'Рецепт не знайдено' : 'Recipe not found'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-[#d6b98c]">
              {language === 'uk'
                ? 'Цей рецепт більше недоступний. Поверніться до списку.'
                : 'This recipe is no longer available. Please return to the list.'}
            </p>
            <Button onClick={() => dispatch(setCurrentPage('list'))} className="rounded-xl bg-amber-500 text-[#120a06] hover:bg-amber-400">
              {language === 'uk' ? 'Назад до рецептів' : 'Back to recipes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedSet = new Set(selectedIngredients.map((item) => item.toLowerCase()))
  const ingredients = recipeIngredients(recipe, language)

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-[#fef3c7]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-amber-500/20 bg-[#1e100a]/35 p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <Button
            variant="outline"
            onClick={() => dispatch(setCurrentPage('list'))}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-500/20 bg-[#26150d]/60 px-4 py-2 text-amber-300 shadow-md backdrop-blur-md transition-all hover:bg-amber-900/40 hover:text-amber-200"
          >
            <span aria-hidden="true">←</span>
            {language === 'uk' ? 'Назад до списку рецептів' : 'Back to Recipes'}
          </Button>
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

        <div className="overflow-hidden rounded-[28px] border border-amber-500/20 bg-[#1e100a]/35 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <img
            src={getRecipeImage(recipe)}
            alt={recipeName(recipe, language)}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
            }}
            className="h-80 w-full object-cover"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-amber-500/20 bg-[#1e100a]/35 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-[#fef3c7]">{recipeName(recipe, language)}</h1>
              {recipe.dietaryTags.map((tag) => (
                <span key={tag} className="rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200">
                  {dietaryTagLabel(tag, language)}
                </span>
              ))}
            </div>

            <p className="mb-4 text-[#d6b98c]">{recipeDescription(recipe, language)}</p>

            <div className="mb-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-amber-400/15 bg-amber-950/20 px-3 py-1.5 text-[#f3f4f6] backdrop-blur-md">
                {language === 'uk' ? 'Підготовка' : 'Prep'}: {recipe.prepTimeMinutes} {language === 'uk' ? 'хв' : 'min'}
              </span>
              <span className="rounded-full border border-amber-400/15 bg-amber-950/20 px-3 py-1.5 text-[#f3f4f6] backdrop-blur-md">
                {language === 'uk' ? 'Складність' : 'Difficulty'}: {difficultyLabel(recipe.difficulty, language)}
              </span>
              <span className="rounded-full border border-amber-400/15 bg-amber-950/20 px-3 py-1.5 text-[#f3f4f6] backdrop-blur-md">
                {language === 'uk' ? 'Порції' : 'Servings'}: {recipe.servings}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="mb-3 text-xl font-semibold text-[#fef3c7]">{language === 'uk' ? 'Склад страви' : 'Ingredients'}</h2>
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => {
                  const isAvailable = selectedSet.has(
                    recipe.ingredients[index].name.toLowerCase(),
                  )
                  return (
                    <li
                      key={ingredient.name}
                      className={[
                        'flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm shadow-sm',
                        isAvailable
                          ? 'border-emerald-700/70 bg-emerald-900/30 text-emerald-200'
                          : 'border-amber-700/70 bg-amber-900/20 text-amber-200',
                      ].join(' ')}
                    >
                      <span>{language === 'uk' ? ingredient.name : localizedIngredient(ingredient.name, language)}</span>
                      <span>{ingredient.quantity}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-[#fef3c7]">{language === 'uk' ? 'Спосіб приготування' : 'Method'}</h2>
              <ol className="space-y-3">
                {recipeSteps(recipe, language).map((step, index) => (
                  <li key={step} className="rounded-2xl border border-amber-500/20 bg-[#1e100a]/35 p-3 text-sm text-[#f3f4f6] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <span className="mr-2 font-semibold text-amber-300">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside>
            <Card className="border border-amber-500/20 bg-[#1e100a]/35 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#fef3c7]">{language === 'uk' ? 'Перевірка холодильника' : 'Fridge check'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-[#d6b98c]">{language === 'uk' ? 'Ви вибрали:' : 'You selected:'}</p>
                <ul className="space-y-1 text-sm text-[#f3f4f6]">
                  {selectedIngredients.length > 0 ? (
                    selectedIngredients.map((ingredient) => (
                      <li key={ingredient}>• {localizedIngredient(ingredient, language)}</li>
                    ))
                  ) : (
                    <li className="text-[#d6b98c]">{language === 'uk' ? 'Інгредієнти не вибрані.' : 'No ingredients selected.'}</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
