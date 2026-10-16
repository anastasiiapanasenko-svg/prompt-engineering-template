import type { IngredientCategory } from '@/types/recipe'
import type { Language } from '@/lib/i18n'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001'
).replace(/\/+$/, '')

export interface AuthUser {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export interface CustomProduct {
  id: string
  name: string
  category: IngredientCategory
  createdAt: string
}

export interface SearchHistoryEntry {
  id: string
  selectedIngredients: string[]
  matchedRecipesCount: number
  createdAt: string
}

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface MealPlanEntry {
  id: string
  recipeId: string
  recipeTitle: string
  date: string
  mealType: MealType
  createdAt: string
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function localizedApiErrorMessage(error: unknown, language: Language) {
  if (language === 'en') {
    return error instanceof Error
      ? error.message
      : 'The request could not be completed.'
  }

  if (error instanceof ApiError) {
    if (error.status === 400) return 'Перевірте введені дані.'
    if (error.status === 401) {
      return 'Не вдалося автентифікувати запит. Увійдіть знову або перевірте облікові дані.'
    }
    if (error.status === 403) return 'Запит не дозволено з цього сайту.'
    if (error.status === 404) return 'Запис не знайдено.'
    if (error.status === 409) {
      return 'Обліковий запис або продукт із такими даними вже існує.'
    }
    if (error.status === 429) return 'Забагато спроб. Спробуйте пізніше.'
    return 'Сталася помилка сервера. Спробуйте ще раз.'
  }

  if (error instanceof TypeError) {
    return 'Не вдалося підключитися до сервера. Перевірте, чи сервер запущено.'
  }
  return 'Не вдалося виконати запит.'
}

export async function apiRequest(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new ApiError(
      body?.error ?? `Request failed with status ${response.status}.`,
      response.status,
    )
  }

  return response
}

export async function apiData<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await apiRequest(path, options)
  if (response.status === 204) {
    throw new ApiError('The server returned an empty response.', 204)
  }

  return (await response.json()) as T
}
