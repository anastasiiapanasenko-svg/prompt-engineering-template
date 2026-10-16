import { useEffect, useRef, useState, type FormEvent } from 'react'
import { UserRound, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  apiData,
  apiRequest,
  localizedApiErrorMessage,
  type AuthUser,
  type CustomProduct,
  type SearchHistoryEntry,
} from '@/lib/api'
import {
  findProductSuggestions,
  type ProductSuggestion,
} from '@/lib/productSuggestions'
import { ingredientCategories, localizedIngredient } from '@/lib/i18n'
import type { Language } from '@/lib/i18n'

interface AccountPanelProps {
  language: Language
  onUserChange: (user: AuthUser | null) => void
  onCustomProductsChange: (products: CustomProduct[]) => void
  historyRefreshKey: number
  historyError: string | null
}

export function AccountPanel({
  language,
  onUserChange,
  onCustomProductsChange,
  historyRefreshKey,
  historyError,
}: AccountPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [products, setProducts] = useState<CustomProduct[]>([])
  const [history, setHistory] = useState<SearchHistoryEntry[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [productName, setProductName] = useState('')
  const [productCategory, setProductCategory] =
    useState<CustomProduct['category']>('vegetables')
  const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const suggestionRootRef = useRef<HTMLDivElement>(null)

  const isUkrainian = language === 'uk'
  const productMatches = findProductSuggestions(productName)
  const visibleProductMatches =
    isSuggestionListOpen && productMatches.length > 0

  const selectProductSuggestion = (suggestion: ProductSuggestion) => {
    setProductName(isUkrainian ? suggestion.uk : suggestion.en)
    setProductCategory(suggestion.category)
    setIsSuggestionListOpen(false)
    setActiveSuggestionIndex(-1)
  }

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isSuggestionListOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !suggestionRootRef.current?.contains(event.target)
      ) {
        setIsSuggestionListOpen(false)
        setActiveSuggestionIndex(-1)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isSuggestionListOpen])

  useEffect(() => {
    let isCurrent = true
    const controller = new AbortController()

    const loadAccount = async () => {
      try {
        const result = await apiData<{ user: AuthUser | null }>('/auth/me', {
          signal: controller.signal,
        })
        if (!isCurrent) return

        setUser(result.user)
        onUserChange(result.user)
        if (!result.user) return

        const { products: accountProducts } = await apiData<{
          products: CustomProduct[]
        }>('/custom-products', { signal: controller.signal })
        if (isCurrent) {
          setProducts(accountProducts)
          onCustomProductsChange(accountProducts)
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(localizedApiErrorMessage(loadError, language))
        }
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    void loadAccount()
    return () => {
      isCurrent = false
      controller.abort()
    }
  }, [language, onCustomProductsChange, onUserChange])

  useEffect(() => {
    if (!user) {
      return
    }

    let isCurrent = true
    const controller = new AbortController()
    void apiData<{ history: SearchHistoryEntry[] }>('/history', {
      signal: controller.signal,
    })
      .then((result) => {
        if (isCurrent) setHistory(result.history)
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(localizedApiErrorMessage(loadError, language))
        }
      })

    return () => {
      isCurrent = false
      controller.abort()
    }
  }, [historyRefreshKey, language, user])

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsBusy(true)
    setError(null)

    try {
      const result = await apiData<{ user: AuthUser }>(
        `/auth/${isRegistering ? 'register' : 'login'}`,
        {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            ...(isRegistering && name.trim() ? { name: name.trim() } : {}),
          }),
        },
      )
      setUser(result.user)
      onUserChange(result.user)
      setPassword('')

      const { products: accountProducts } = await apiData<{
        products: CustomProduct[]
      }>('/custom-products')
      setProducts(accountProducts)
      onCustomProductsChange(accountProducts)
    } catch (authError) {
      setError(localizedApiErrorMessage(authError, language))
    } finally {
      setIsBusy(false)
    }
  }

  const handleLogout = async () => {
    setIsBusy(true)
    setError(null)
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
      setUser(null)
      setProducts([])
      setHistory([])
      onUserChange(null)
      onCustomProductsChange([])
    } catch (logoutError) {
      setError(localizedApiErrorMessage(logoutError, language))
    } finally {
      setIsBusy(false)
    }
  }

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsBusy(true)
    setError(null)
    try {
      const result = await apiData<{ product: CustomProduct }>(
        '/custom-products',
        {
          method: 'POST',
          body: JSON.stringify({
            name: productName.trim(),
            category: productCategory,
          }),
        },
      )
      const nextProducts = [...products, result.product]
      setProducts(nextProducts)
      onCustomProductsChange(nextProducts)
      setProductName('')
      setIsSuggestionListOpen(false)
      setActiveSuggestionIndex(-1)
    } catch (productError) {
      setError(localizedApiErrorMessage(productError, language))
    } finally {
      setIsBusy(false)
    }
  }

  const handleRemoveProduct = async (product: CustomProduct) => {
    setIsBusy(true)
    setError(null)
    try {
      await apiRequest(`/custom-products/${encodeURIComponent(product.id)}`, {
        method: 'DELETE',
      })
      const nextProducts = products.filter((item) => item.id !== product.id)
      setProducts(nextProducts)
      onCustomProductsChange(nextProducts)
    } catch (productError) {
      setError(localizedApiErrorMessage(productError, language))
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          isUkrainian
            ? isOpen
              ? 'Закрити обліковий запис'
              : 'Відкрити обліковий запис'
            : isOpen
              ? 'Close account panel'
              : 'Open account panel'
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="account-popover"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/35 bg-[#120a06]/70 text-amber-200 shadow-lg shadow-black/20 backdrop-blur-md transition hover:border-amber-300/70 hover:bg-amber-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#120a06]"
      >
        <UserRound aria-hidden="true" className="h-5 w-5" />
      </button>

      <div
        id="account-popover"
        role="dialog"
        aria-modal="false"
        aria-labelledby="account-popover-title"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={[
          'absolute right-0 top-full z-50 mt-3 w-[min(28rem,calc(100vw-2rem))] origin-top-right transition-[opacity,transform] duration-200 motion-reduce:transition-none max-sm:-right-16',
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0',
        ].join(' ')}
      >
        <Card className="max-h-[min(42rem,75vh)] overflow-y-auto border border-amber-500/25 bg-[#160c07]/95 text-[#fef3c7] shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl max-sm:max-h-[calc(100dvh-16rem)]">
          <CardHeader className="sticky top-0 z-10 flex-row items-center justify-between border-b border-amber-500/15 bg-[#160c07]/95 py-4 backdrop-blur-2xl">
            <CardTitle
              id="account-popover-title"
              className="text-xl text-[#fef3c7]"
            >
              {isUkrainian ? 'Обліковий запис' : 'Account'}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isUkrainian ? 'Закрити' : 'Close'}
              onClick={() => {
                setIsOpen(false)
                triggerRef.current?.focus()
              }}
              className="text-amber-100 hover:bg-amber-100/10 hover:text-amber-50"
            >
              <X aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {error || historyError ? (
              <p
                role="alert"
                className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200"
              >
                {error ?? historyError}
              </p>
            ) : null}

            {isLoading ? (
              <p role="status" className="text-sm text-[#d6b98c]">
                {isUkrainian ? 'Завантаження…' : 'Loading account…'}
              </p>
            ) : user ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/15 bg-amber-950/20 p-3">
                  <div className="min-w-0 text-sm text-[#f3f4f6]">
                    <p className="text-xs text-[#d6b98c]">
                      {isUkrainian ? 'Ви увійшли як' : 'Signed in as'}
                    </p>
                    <p className="truncate font-semibold">
                      {user.name || user.email}
                    </p>
                    {user.name ? (
                      <p className="truncate text-xs text-[#d6b98c]">
                        {user.email}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => void handleLogout()}
                  >
                    {isUkrainian ? 'Вийти' : 'Sign out'}
                  </Button>
                </div>

                <section aria-labelledby="custom-products-heading">
                  <h3
                    id="custom-products-heading"
                    className="mb-3 font-semibold text-[#fef3c7]"
                  >
                    {isUkrainian ? 'Мої продукти' : 'My products'}
                  </h3>
                  <form
                    onSubmit={(event) => void handleAddProduct(event)}
                    className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
                  >
                    <label className="sr-only" htmlFor="custom-product-name">
                      {isUkrainian ? 'Назва продукту' : 'Product name'}
                    </label>
                    <div ref={suggestionRootRef} className="relative min-w-0">
                      <Input
                        id="custom-product-name"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={visibleProductMatches}
                        aria-controls="custom-product-suggestions"
                        aria-activedescendant={
                          visibleProductMatches && activeSuggestionIndex >= 0
                            ? `custom-product-suggestion-${activeSuggestionIndex}`
                            : undefined
                        }
                        value={productName}
                        maxLength={100}
                        required
                        onChange={(event) => {
                          setProductName(event.target.value)
                          setActiveSuggestionIndex(-1)
                          setIsSuggestionListOpen(
                            event.target.value.trim().length > 0,
                          )
                        }}
                        onFocus={() =>
                          setIsSuggestionListOpen(productName.trim().length > 0)
                        }
                        onBlur={() => {
                          setIsSuggestionListOpen(false)
                          setActiveSuggestionIndex(-1)
                        }}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'ArrowDown' &&
                            productMatches.length > 0
                          ) {
                            event.preventDefault()
                            setIsSuggestionListOpen(true)
                            setActiveSuggestionIndex((index) =>
                              index >= productMatches.length - 1
                                ? 0
                                : index + 1,
                            )
                          } else if (
                            event.key === 'ArrowUp' &&
                            productMatches.length > 0
                          ) {
                            event.preventDefault()
                            setIsSuggestionListOpen(true)
                            setActiveSuggestionIndex((index) =>
                              index <= 0
                                ? productMatches.length - 1
                                : index - 1,
                            )
                          } else if (
                            event.key === 'Enter' &&
                            visibleProductMatches &&
                            activeSuggestionIndex >= 0
                          ) {
                            event.preventDefault()
                            const suggestion =
                              productMatches[activeSuggestionIndex]
                            if (suggestion) {
                              selectProductSuggestion(suggestion)
                            }
                          } else if (
                            event.key === 'Escape' &&
                            isSuggestionListOpen
                          ) {
                            event.preventDefault()
                            event.stopPropagation()
                            setIsSuggestionListOpen(false)
                            setActiveSuggestionIndex(-1)
                          }
                        }}
                        placeholder={
                          isUkrainian ? 'Назва продукту' : 'Product name'
                        }
                        className="border-amber-400/25 bg-[#120a06]/40 text-[#fef3c7]"
                      />
                      {visibleProductMatches ? (
                        <ul
                          id="custom-product-suggestions"
                          role="listbox"
                          aria-label={
                            isUkrainian
                              ? 'Пропозиції продуктів'
                              : 'Product suggestions'
                          }
                          className="absolute inset-x-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-amber-400/30 bg-[#160c07]/[.98] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                        >
                          {productMatches.map((suggestion, index) => {
                            const category = ingredientCategories.find(
                              (item) => item.id === suggestion.category,
                            )
                            const isActive = index === activeSuggestionIndex

                            return (
                              <li
                                id={`custom-product-suggestion-${index}`}
                                key={`${suggestion.en}-${suggestion.uk}`}
                                role="option"
                                aria-selected={isActive}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() =>
                                  selectProductSuggestion(suggestion)
                                }
                                className={[
                                  'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                  isActive
                                    ? 'bg-amber-700/45 text-amber-50'
                                    : 'text-[#fef3c7] hover:bg-amber-800/35',
                                ].join(' ')}
                              >
                                <span className="truncate">
                                  {isUkrainian ? suggestion.uk : suggestion.en}
                                </span>
                                {category ? (
                                  <span className="shrink-0 text-xs text-[#d6b98c]">
                                    {isUkrainian ? category.uk : category.en}
                                  </span>
                                ) : null}
                              </li>
                            )
                          })}
                        </ul>
                      ) : null}
                    </div>
                    <label
                      className="sr-only"
                      htmlFor="custom-product-category"
                    >
                      {isUkrainian ? 'Категорія продукту' : 'Product category'}
                    </label>
                    <select
                      id="custom-product-category"
                      value={productCategory}
                      onChange={(event) => {
                        const selectedCategory = ingredientCategories.find(
                          (category) => category.id === event.target.value,
                        )
                        if (selectedCategory) {
                          setProductCategory(selectedCategory.id)
                        }
                      }}
                      className="h-9 rounded-md border border-amber-400/25 bg-[#120a06] px-3 text-sm text-[#fef3c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      {ingredientCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {isUkrainian ? category.uk : category.en}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" disabled={isBusy}>
                      {isUkrainian ? 'Додати' : 'Add'}
                    </Button>
                  </form>

                  {products.length ? (
                    <ul className="mt-3 space-y-2">
                      {products.map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-amber-400/15 bg-amber-950/20 px-3 py-2 text-sm"
                        >
                          <span>{product.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isBusy}
                            aria-label={`${isUkrainian ? 'Видалити' : 'Remove'} ${product.name}`}
                            onClick={() => void handleRemoveProduct(product)}
                          >
                            {isUkrainian ? 'Видалити' : 'Remove'}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-[#d6b98c]">
                      {isUkrainian
                        ? 'Власних продуктів ще немає.'
                        : 'You have not added any products yet.'}
                    </p>
                  )}
                </section>

                <section aria-labelledby="search-history-heading">
                  <h3
                    id="search-history-heading"
                    className="mb-3 font-semibold text-[#fef3c7]"
                  >
                    {isUkrainian ? 'Останні пошуки' : 'Recent searches'}
                  </h3>
                  {history.length ? (
                    <ol className="space-y-2">
                      {history.slice(0, 5).map((entry) => (
                        <li
                          key={entry.id}
                          className="rounded-lg border border-amber-400/15 bg-amber-950/20 p-3 text-sm"
                        >
                          <p className="text-[#f3f4f6]">
                            {entry.selectedIngredients
                              .map((ingredient) =>
                                localizedIngredient(ingredient, language),
                              )
                              .join(', ')}
                          </p>
                          <p className="mt-1 text-xs text-[#d6b98c]">
                            {new Intl.DateTimeFormat(
                              isUkrainian ? 'uk-UA' : 'en-US',
                              { dateStyle: 'medium', timeStyle: 'short' },
                            ).format(new Date(entry.createdAt))}
                            {' · '}
                            {isUkrainian
                              ? `Знайдено рецептів: ${entry.matchedRecipesCount}`
                              : `Recipes found: ${entry.matchedRecipesCount}`}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-[#d6b98c]">
                      {isUkrainian
                        ? 'Історія з’явиться після пошуку рецептів.'
                        : 'Your searches will appear here.'}
                    </p>
                  )}
                </section>
              </>
            ) : (
              <>
                <p className="text-sm text-[#d6b98c]">
                  {isUkrainian
                    ? 'Увійдіть або створіть обліковий запис, щоб зберігати власні продукти та історію пошуку.'
                    : 'Sign in or create an account to save custom products and search history.'}
                </p>
                <form
                  onSubmit={(event) => void handleAuth(event)}
                  className="space-y-3"
                >
                  {isRegistering ? (
                    <>
                      <label className="sr-only" htmlFor="account-name">
                        {isUkrainian
                          ? 'Ім’я (необов’язково)'
                          : 'Name (optional)'}
                      </label>
                      <Input
                        id="account-name"
                        value={name}
                        maxLength={80}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={
                          isUkrainian
                            ? 'Ім’я (необов’язково)'
                            : 'Name (optional)'
                        }
                        className="border-amber-400/25 bg-[#120a06]/40 text-[#fef3c7]"
                      />
                    </>
                  ) : null}
                  <label className="sr-only" htmlFor="account-email">
                    Email
                  </label>
                  <Input
                    id="account-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    className="border-amber-400/25 bg-[#120a06]/40 text-[#fef3c7]"
                  />
                  <label className="sr-only" htmlFor="account-password">
                    {isUkrainian ? 'Пароль' : 'Password'}
                  </label>
                  <Input
                    id="account-password"
                    type="password"
                    autoComplete={
                      isRegistering ? 'new-password' : 'current-password'
                    }
                    required
                    minLength={isRegistering ? 12 : 1}
                    maxLength={72}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={
                      isUkrainian
                        ? isRegistering
                          ? 'Пароль (мінімум 12 символів)'
                          : 'Пароль'
                        : isRegistering
                          ? 'Password (at least 12 characters)'
                          : 'Password'
                    }
                    className="border-amber-400/25 bg-[#120a06]/40 text-[#fef3c7]"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={isBusy}>
                      {isUkrainian
                        ? isRegistering
                          ? 'Створити обліковий запис'
                          : 'Увійти'
                        : isRegistering
                          ? 'Create account'
                          : 'Sign in'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isBusy}
                      onClick={() => {
                        setIsRegistering((current) => !current)
                        setError(null)
                      }}
                    >
                      {isUkrainian
                        ? isRegistering
                          ? 'Уже є обліковий запис? Увійти'
                          : 'Створити обліковий запис'
                        : isRegistering
                          ? 'Already registered? Sign in'
                          : 'Create an account'}
                    </Button>
                  </div>
                  {isRegistering ? (
                    <p className="text-xs text-[#d6b98c]">
                      {isUkrainian
                        ? 'Пароль має містити щонайменше 12 символів.'
                        : 'Passwords must be at least 12 characters long.'}
                    </p>
                  ) : null}
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
