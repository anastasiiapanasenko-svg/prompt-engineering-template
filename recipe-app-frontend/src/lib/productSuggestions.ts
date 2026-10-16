import type { IngredientCategory } from '@/types/recipe'
import { getIngredientCategory, ingredientCatalog } from '@/lib/i18n'

export interface ProductSuggestion {
  en: string
  uk: string
  category: IngredientCategory
}

const additionalProductSuggestions: ProductSuggestion[] = [
  { en: 'Apple', uk: 'Яблуко', category: 'fruits' },
  { en: 'Apricot', uk: 'Абрикос', category: 'fruits' },
  { en: 'Artichoke', uk: 'Артишок', category: 'vegetables' },
  { en: 'Asparagus', uk: 'Спаржа', category: 'vegetables' },
  { en: 'Almonds', uk: 'Мигдаль', category: 'pantry' },
  { en: 'Anchovies', uk: 'Анчоуси', category: 'meat' },
  { en: 'Bacon', uk: 'Бекон', category: 'meat' },
  { en: 'Banana', uk: 'Банан', category: 'fruits' },
  { en: 'Barley', uk: 'Ячмінь', category: 'grains' },
  { en: 'Beans', uk: 'Квасоля', category: 'pantry' },
  { en: 'Beetroot', uk: 'Буряк', category: 'vegetables' },
  { en: 'Blueberries', uk: 'Чорниця', category: 'fruits' },
  {
    en: 'Brussels sprouts',
    uk: 'Брюссельська капуста',
    category: 'vegetables',
  },
  { en: 'Cabbage', uk: 'Капуста', category: 'vegetables' },
  { en: 'Cauliflower', uk: 'Цвітна капуста', category: 'vegetables' },
  { en: 'Celery', uk: 'Селера', category: 'vegetables' },
  { en: 'Cherries', uk: 'Вишні', category: 'fruits' },
  { en: 'Chives', uk: 'Шніт-цибуля', category: 'vegetables' },
  { en: 'Cilantro', uk: 'Кінза', category: 'spices' },
  { en: 'Cloves', uk: 'Гвоздика', category: 'spices' },
  { en: 'Cod', uk: 'Тріска', category: 'meat' },
  { en: 'Corn', uk: 'Кукурудза', category: 'vegetables' },
  { en: 'Dates', uk: 'Фініки', category: 'fruits' },
  { en: 'Duck', uk: 'Качка', category: 'meat' },
  { en: 'Edamame', uk: 'Едамаме', category: 'vegetables' },
  { en: 'Endive', uk: 'Ендівій', category: 'vegetables' },
  { en: 'Fennel', uk: 'Фенхель', category: 'vegetables' },
  { en: 'Fig', uk: 'Інжир', category: 'fruits' },
  { en: 'Fish', uk: 'Риба', category: 'meat' },
  { en: 'Farro', uk: 'Фарро', category: 'grains' },
  { en: 'Grapes', uk: 'Виноград', category: 'fruits' },
  { en: 'Green beans', uk: 'Стручкова квасоля', category: 'vegetables' },
  { en: 'Grouper', uk: 'Морський окунь', category: 'meat' },
  { en: 'Haddock', uk: 'Пікша', category: 'meat' },
  { en: 'Hazelnuts', uk: 'Фундук', category: 'pantry' },
  { en: 'Herring', uk: 'Оселедець', category: 'meat' },
  { en: 'Horseradish', uk: 'Хрін', category: 'vegetables' },
  { en: 'Iceberg lettuce', uk: 'Салат айсберг', category: 'vegetables' },
  { en: 'Jackfruit', uk: 'Джекфрут', category: 'fruits' },
  { en: 'Jalapeño', uk: 'Халапеньйо', category: 'vegetables' },
  { en: 'Jasmine rice', uk: 'Рис жасмин', category: 'grains' },
  { en: 'Kale', uk: 'Кейл', category: 'vegetables' },
  { en: 'Kefir', uk: 'Кефір', category: 'dairy' },
  { en: 'Kidney beans', uk: 'Червона квасоля', category: 'pantry' },
  { en: 'Kiwi', uk: 'Ківі', category: 'fruits' },
  { en: 'Lamb', uk: 'Баранина', category: 'meat' },
  { en: 'Leek', uk: 'Порей', category: 'vegetables' },
  { en: 'Lobster', uk: 'Омар', category: 'meat' },
  { en: 'Mackerel', uk: 'Скумбрія', category: 'meat' },
  { en: 'Millet', uk: 'Пшоно', category: 'grains' },
  { en: 'Mint', uk: 'М’ята', category: 'spices' },
  { en: 'Mussels', uk: 'Мідії', category: 'meat' },
  { en: 'Napa cabbage', uk: 'Пекінська капуста', category: 'vegetables' },
  { en: 'Nectarine', uk: 'Нектарин', category: 'fruits' },
  { en: 'Noodles', uk: 'Локшина', category: 'grains' },
  { en: 'Nutmeg', uk: 'Мускатний горіх', category: 'spices' },
  { en: 'Oats', uk: 'Вівсянка', category: 'grains' },
  { en: 'Orange', uk: 'Апельсин', category: 'fruits' },
  { en: 'Octopus', uk: 'Восьминіг', category: 'meat' },
  { en: 'Papaya', uk: 'Папая', category: 'fruits' },
  { en: 'Parsley', uk: 'Петрушка', category: 'spices' },
  { en: 'Peas', uk: 'Горох', category: 'vegetables' },
  { en: 'Pear', uk: 'Груша', category: 'fruits' },
  { en: 'Pineapple', uk: 'Ананас', category: 'fruits' },
  { en: 'Pistachios', uk: 'Фісташки', category: 'pantry' },
  { en: 'Prawns', uk: 'Креветки', category: 'meat' },
  { en: 'Quail', uk: 'Перепілка', category: 'meat' },
  { en: 'Quark', uk: 'Кварк', category: 'dairy' },
  { en: 'Radish', uk: 'Редиска', category: 'vegetables' },
  { en: 'Raisins', uk: 'Родзинки', category: 'pantry' },
  { en: 'Raspberries', uk: 'Малина', category: 'fruits' },
  { en: 'Rye', uk: 'Жито', category: 'grains' },
  { en: 'Sardines', uk: 'Сардини', category: 'meat' },
  { en: 'Sage', uk: 'Шавлія', category: 'spices' },
  { en: 'Sesame oil', uk: 'Кунжутна олія', category: 'pantry' },
  { en: 'Shrimp', uk: 'Креветка', category: 'meat' },
  { en: 'Sorrel', uk: 'Щавель', category: 'vegetables' },
  { en: 'Squash', uk: 'Кабачок', category: 'vegetables' },
  { en: 'Strawberries', uk: 'Полуниця', category: 'fruits' },
  { en: 'Sweet potato', uk: 'Батат', category: 'vegetables' },
  { en: 'Tarragon', uk: 'Естрагон', category: 'spices' },
  { en: 'Thyme', uk: 'Чебрець', category: 'spices' },
  { en: 'Tuna', uk: 'Тунець', category: 'meat' },
  { en: 'Turnip', uk: 'Ріпа', category: 'vegetables' },
  { en: 'Udon noodles', uk: 'Локшина удон', category: 'grains' },
  { en: 'Vanilla', uk: 'Ваніль', category: 'spices' },
  { en: 'Veal', uk: 'Телятина', category: 'meat' },
  { en: 'Venison', uk: 'Оленина', category: 'meat' },
  { en: 'Vinegar', uk: 'Оцет', category: 'pantry' },
  { en: 'Walnuts', uk: 'Волоські горіхи', category: 'pantry' },
  { en: 'Watercress', uk: 'Крес-салат', category: 'vegetables' },
  { en: 'Watermelon', uk: 'Кавун', category: 'fruits' },
  { en: 'Wheat', uk: 'Пшениця', category: 'grains' },
  { en: 'Yams', uk: 'Ямс', category: 'vegetables' },
  { en: 'Yogurt', uk: 'Йогурт', category: 'dairy' },
  { en: 'Zander', uk: 'Судак', category: 'meat' },
  { en: 'Zucchini', uk: 'Цукіні', category: 'vegetables' },
  { en: 'Swede', uk: 'Брюква', category: 'vegetables' },
  { en: 'Gorgonzola', uk: 'Ґорґонзола', category: 'dairy' },
  { en: 'Green onion', uk: 'Зелена цибуля', category: 'vegetables' },
  {
    en: 'Jerusalem artichoke',
    uk: 'Єрусалимський артишок',
    category: 'vegetables',
  },
  { en: 'Edible seaweed', uk: 'Їстівні водорості', category: 'pantry' },
  { en: 'Yuca', uk: 'Юка', category: 'vegetables' },
  { en: 'Ugli fruit', uk: 'Углі-фрукт', category: 'fruits' },
  { en: 'Xigua', uk: 'Кавун', category: 'fruits' },
  { en: 'Ichpochmak', uk: 'Ичпочмак', category: 'bakery' },
]

const catalogSuggestions = ingredientCatalog.map(({ en, uk }) => ({
  en,
  uk,
  category: getIngredientCategory(en),
}))

const suggestionsByEnglishName = new Map<string, ProductSuggestion>()
for (const suggestion of [
  ...catalogSuggestions,
  ...additionalProductSuggestions,
]) {
  suggestionsByEnglishName.set(
    suggestion.en.toLocaleLowerCase('en-US'),
    suggestion,
  )
}

export const productSuggestions = Array.from(suggestionsByEnglishName.values())

const normalizeSuggestionQuery = (value: string) =>
  value.trim().toLocaleLowerCase().normalize('NFC')

export const findProductSuggestions = (query: string, limit = 8) => {
  const normalizedQuery = normalizeSuggestionQuery(query)
  if (!normalizedQuery) return []

  return productSuggestions
    .filter((suggestion) =>
      [suggestion.en, suggestion.uk].some((name) =>
        normalizeSuggestionQuery(name).includes(normalizedQuery),
      ),
    )
    .sort((left, right) => {
      const leftStartsWith = [left.en, left.uk].some((name) =>
        normalizeSuggestionQuery(name).startsWith(normalizedQuery),
      )
      const rightStartsWith = [right.en, right.uk].some((name) =>
        normalizeSuggestionQuery(name).startsWith(normalizedQuery),
      )
      return Number(rightStartsWith) - Number(leftStartsWith)
    })
    .slice(0, limit)
}
