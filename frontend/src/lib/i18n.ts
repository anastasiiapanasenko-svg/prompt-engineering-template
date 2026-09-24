import type { Recipe } from '@/types/recipe'

export type Language = 'en' | 'uk'

export const ingredientCatalog = [
  { key: 'avocado', en: 'Avocado', uk: 'Авокадо' },
  { key: 'bread', en: 'Bread', uk: 'Хліб' },
  { key: 'balsamic-vinegar', en: 'Balsamic vinegar', uk: 'Бальзамічний оцет' },
  { key: 'butter', en: 'Butter', uk: 'Масло' },
  { key: 'beef-mince', en: 'Beef mince', uk: 'Яловичий фарш' },
  { key: 'bell-pepper', en: 'Bell pepper', uk: 'Перець' },
  { key: 'black-beans', en: 'Black beans', uk: 'Чорні боби' },
  { key: 'broccoli', en: 'Broccoli', uk: 'Броколі' },
  { key: 'brown-rice', en: 'Brown rice', uk: 'Коричневий рис' },
  { key: 'carrot', en: 'Carrot', uk: 'Морква' },
  { key: 'chickpeas', en: 'Chickpeas', uk: 'Нут' },
  { key: 'chia-seeds', en: 'Chia seeds', uk: 'Насіння чіа' },
  { key: 'chicken-breast', en: 'Chicken breast', uk: 'Куряча грудка' },
  { key: 'cherry-tomato', en: 'Cherry tomato', uk: 'Черрі' },
  { key: 'coconut-milk', en: 'Coconut milk', uk: 'Кокосове молоко' },
  { key: 'coconut-yogurt', en: 'Coconut yogurt', uk: 'Кокосовий йогурт' },
  { key: 'cucumber', en: 'Cucumber', uk: 'Огірок' },
  { key: 'cumin', en: 'Cumin', uk: 'Кмин' },
  { key: 'curry-powder', en: 'Curry powder', uk: 'Порошок каррі' },
  { key: 'eggs', en: 'Eggs', uk: 'Яйця' },
  { key: 'feta', en: 'Feta', uk: 'Фета' },
  { key: 'garlic', en: 'Garlic', uk: 'Часник' },
  { key: 'ginger', en: 'Ginger', uk: 'Імбир' },
  { key: 'granola', en: 'Granola', uk: 'Гранола' },
  { key: 'lemon', en: 'Lemon', uk: 'Лимон' },
  { key: 'lemon-juice', en: 'Lemon juice', uk: 'Лимонний сік' },
  { key: 'lentils', en: 'Lentils', uk: 'Сочевиця' },
  { key: 'lettuce', en: 'Lettuce', uk: 'Листя салату' },
  { key: 'lime', en: 'Lime', uk: 'Лайм' },
  { key: 'mango', en: 'Mango', uk: 'Манго' },
  { key: 'mozzarella', en: 'Mozzarella', uk: 'Моцарела' },
  { key: 'mushrooms', en: 'Mushrooms', uk: 'Гриби' },
  { key: 'mustard', en: 'Mustard', uk: 'Гірчиця' },
  { key: 'olive-oil', en: 'Olive oil', uk: 'Оливкова олія' },
  { key: 'olives', en: 'Olives', uk: 'Оливки' },
  { key: 'onion', en: 'Onion', uk: 'Цибуля' },
  { key: 'parmesan', en: 'Parmesan', uk: 'Пармезан' },
  { key: 'pasta', en: 'Pasta', uk: 'Макарони' },
  { key: 'pumpkin-seeds', en: 'Pumpkin seeds', uk: 'Гарбузове насіння' },
  { key: 'quinoa', en: 'Quinoa', uk: 'Кіноа' },
  { key: 'red-lentils', en: 'Red lentils', uk: 'Червона сочевиця' },
  { key: 'rice', en: 'Rice', uk: 'Рис' },
  { key: 'rice-noodles', en: 'Rice noodles', uk: 'Рисова локшина' },
  { key: 'salmon-fillet', en: 'Salmon fillet', uk: 'Філе лосося' },
  { key: 'soy-sauce', en: 'Soy sauce', uk: 'Соєвий соус' },
  { key: 'spinach', en: 'Spinach', uk: 'Шпинат' },
  { key: 'sweetcorn', en: 'Sweetcorn', uk: 'Кукурудза' },
  { key: 'tofu', en: 'Tofu', uk: 'Тофу' },
  { key: 'tomato', en: 'Tomato', uk: 'Помідор' },
  { key: 'turkey-slices', en: 'Turkey slices', uk: 'Шматочки індички' },
  { key: 'vegetable-broth', en: 'Vegetable broth', uk: 'Овочевий бульйон' },
  { key: 'tortillas', en: 'Tortillas', uk: 'Лаваш' },
  { key: 'basil', en: 'Basil', uk: 'Базилік' },
]

export const ingredientKeyMap = new Map(
  ingredientCatalog.flatMap((item) => [
    [item.en.toLowerCase(), item.key],
    [item.uk.toLowerCase(), item.key],
  ]),
)

export const ingredientLabel = (key: string, language: Language) => {
  const label = ingredientCatalog.find((item) => item.key === key)
  return label ? label[language] : key
}

export const normalizeIngredientKey = (value: string) => {
  const normalized = value.toLowerCase().trim()
  return ingredientKeyMap.get(normalized) ?? normalized
}

export const localizedIngredient = (value: string, language: Language) =>
  ingredientLabel(normalizeIngredientKey(value), language)

export const dietaryTagLabel = (
  tag: 'vegetarian' | 'vegan' | 'gluten-free',
  language: Language,
) => {
  const labels = {
    en: {
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      'gluten-free': 'Gluten-Free',
    },
    uk: {
      vegetarian: 'Вегетаріанське',
      vegan: 'Веганське',
      'gluten-free': 'Без глютену',
    },
  }

  return labels[language][tag]
}

export const recipeName = (recipe: Recipe, language: Language) =>
  language === 'uk' ? recipe.uk.name : recipe.name

export const recipeDescription = (recipe: Recipe, language: Language) =>
  language === 'uk' ? recipe.uk.description : recipe.description

export const recipeIngredients = (recipe: Recipe, language: Language) =>
  language === 'uk' ? recipe.uk.ingredients : recipe.ingredients

export const recipeSteps = (recipe: Recipe, language: Language) =>
  language === 'uk' ? recipe.uk.steps : recipe.steps

export const difficultyLabel = (difficulty: Recipe['difficulty'], language: Language) => {
  if (language === 'en') {
    return difficulty
  }

  return {
    Easy: 'Легко',
    Medium: 'Середньо',
    Hard: 'Складно',
  }[difficulty]
}

export const uiText = {
  en: {
    appTitle: 'Recipe Generator',
    heroTitle: 'Fridge Ingredient Match',
    heroSubtitle: 'Select what is already in your fridge and discover the best recipes in minutes.',
    selectIngredients: 'Choose ingredients',
    noIngredients: 'No ingredients selected yet.',
    filters: 'Filters',
    dietary: 'Dietary preferences',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    glutenFree: 'Gluten-Free',
    prepTime: 'Max prep time',
    any: 'Any',
    generateRecipes: 'Generate recipes',
    clearAll: 'Clear all',
    noIngredientsWarning: 'Select at least one ingredient to generate recipes.',
    recipeMatches: (count: number) => `${count} recipe${count === 1 ? '' : 's'} match your selection.`,
    startSelecting: 'Start by selecting ingredients from the fridge list.',
    recipeListTitle: 'Matching recipes',
    backToIngredients: 'Back to ingredients',
    yourSelection: 'Your selection',
    noSelection: 'No ingredients selected',
    noRecipes: 'No recipes match',
    noRecipesHint: 'Try adjusting your filters or selecting more ingredients from the fridge.',
    viewRecipe: 'View recipe',
    missingIngredients: 'Missing ingredients',
    allIngredientsAvailable: 'You have all ingredients.',
    recipeNotFound: 'Recipe not found',
    recipeNotFoundHint: 'This recipe is no longer available. Please return to the list.',
    backToRecipes: 'Back to recipes',
    ingredientsHeading: 'Ingredients',
    methodHeading: 'Method',
    fridgeCheck: 'Fridge check',
    fridgeCheckSelected: 'You selected:',
    noIngredientsSelected: 'No ingredients selected.',
    recipeList: 'Recipe list',
    languageLabel: 'Language',
    enLabel: 'EN',
    ukLabel: 'UA',
    servings: 'Servings',
    prep: 'Prep',
    difficulty: 'Difficulty',
    minutes: 'min',
  },
  uk: {
    appTitle: 'Генератор рецептів',
    heroTitle: 'Підбір за інгредієнтами у холодильнику',
    heroSubtitle: 'Виберіть, що вже є у вашому холодильнику, і знайдіть найкращі рецепти за лічені хвилини.',
    selectIngredients: 'Виберіть інгредієнти',
    noIngredients: 'Інгредієнти ще не вибрані.',
    filters: 'Фільтри',
    dietary: 'Дієтичні переваги',
    vegetarian: 'Вегетаріанське',
    vegan: 'Веганське',
    glutenFree: 'Без глютену',
    prepTime: 'Максимальний час приготування',
    any: 'Будь-який',
    generateRecipes: 'Згенерувати рецепти',
    clearAll: 'Очистити все',
    noIngredientsWarning: 'Виберіть принаймні один інгредієнт, щоб згенерувати рецепти.',
    recipeMatches: (count: number) => `${count} рецепт${count === 1 ? '' : count >= 2 && count <= 4 ? 'и' : 'ів'} відповідає вашому вибору.`,
    startSelecting: 'Почніть із вибору інгредієнтів зі списку.',
    recipeListTitle: 'Рецепти, що підходять',
    backToIngredients: 'Назад до інгредієнтів',
    yourSelection: 'Ваш вибір',
    noSelection: 'Інгредієнти не вибрані',
    noRecipes: 'Рецепти не знайдено',
    noRecipesHint: 'Спробуйте змінити фільтри або вибрати більше інгредієнтів зі списку.',
    viewRecipe: 'Переглянути рецепт',
    missingIngredients: 'Відсутні інгредієнти',
    allIngredientsAvailable: 'У вас є всі інгредієнти.',
    recipeNotFound: 'Рецепт не знайдено',
    recipeNotFoundHint: 'Цей рецепт більше недоступний. Поверніться до списку.',
    backToRecipes: 'Назад до рецептів',
    ingredientsHeading: 'Інгредієнти',
    methodHeading: 'Спосіб приготування',
    fridgeCheck: 'Перевірка холодильника',
    fridgeCheckSelected: 'Ви вибрали:',
    noIngredientsSelected: 'Інгредієнти не вибрані.',
    recipeList: 'Список рецептів',
    languageLabel: 'Мова',
    enLabel: 'EN',
    ukLabel: 'UA',
    servings: 'Порції',
    prep: 'Підготовка',
    difficulty: 'Складність',
    minutes: 'хв',
  },
} as const

export const getText = (language: Language, key: keyof typeof uiText.en) =>
  uiText[language][key]
