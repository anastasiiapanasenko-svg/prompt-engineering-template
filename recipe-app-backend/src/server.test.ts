import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { after, before, test } from 'node:test'

import 'dotenv/config'
import type { AddressInfo } from 'node:net'
import { app } from './app.js'
import { prisma } from './prisma.js'

let server: ReturnType<typeof app.listen>
let baseUrl: string
let cookie = ''
let userId = ''
let secondUserId = ''

before(async () => {
  await prisma.$connect()
  server = app.listen(0)
  const address = server.address() as AddressInfo
  baseUrl = `http://127.0.0.1:${address.port}`
})

after(async () => {
  if (userId) {
    await prisma.user.deleteMany({ where: { id: userId } })
  }
  if (secondUserId) {
    await prisma.user.deleteMany({ where: { id: secondUserId } })
  }
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
  await prisma.$disconnect()
})

test('registers users, protects data, and isolates owned resources', async () => {
  const email = `test-${randomUUID()}@example.test`
  const origin = process.env.APP_ORIGIN ?? 'http://localhost:5174'

  const invalidRegistration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify({ email, password: 'short' }),
  })
  assert.equal(invalidRegistration.status, 400)

  const registration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify({
      email,
      password: 'a-long-test-password',
      name: 'Test User',
    }),
  })
  assert.equal(registration.status, 201)
  assert.equal(registration.headers.get('access-control-allow-origin'), origin)
  assert.equal(
    registration.headers.get('access-control-allow-credentials'),
    'true',
  )
  const registered = (await registration.json()) as {
    user: { id: string; email: string; name: string | null }
  }
  userId = registered.user.id
  assert.equal(registered.user.email, email)
  assert.equal(registered.user.name, 'Test User')
  const registrationCookie = registration.headers.get('set-cookie') ?? ''
  cookie = registrationCookie.split(';')[0]
  assert.match(cookie, /^recipe_session=/)
  assert.match(registrationCookie, /HttpOnly/i)
  assert.match(registrationCookie, /SameSite=Lax/i)
  assert.match(registrationCookie, /Path=\//i)
  assert.equal('password' in registered.user, false)

  const preflight = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'OPTIONS',
    headers: {
      origin,
      'access-control-request-method': 'POST',
      'access-control-request-headers': 'content-type',
    },
  })
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), origin)
  assert.equal(
    preflight.headers.get('access-control-allow-credentials'),
    'true',
  )

  const storedUser = await prisma.user.findUnique({ where: { id: userId } })
  assert.ok(storedUser)
  assert.notEqual(storedUser.password, 'a-long-test-password')

  const unauthenticatedProducts = await fetch(`${baseUrl}/api/products`)
  assert.equal(unauthenticatedProducts.status, 401)

  const createProduct = await fetch(`${baseUrl}/api/custom-products`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({ name: 'Test potato', category: 'vegetables' }),
  })
  assert.equal(createProduct.status, 201)
  const createdProduct = (await createProduct.json()) as {
    product: { id: string }
  }
  const ownProducts = await fetch(`${baseUrl}/api/custom-products`, {
    headers: { cookie },
  })
  const ownProductsBody = (await ownProducts.json()) as {
    products: Array<{ id: string; category: string }>
  }
  assert.equal(ownProducts.status, 200)
  assert.equal(ownProductsBody.products[0].id, createdProduct.product.id)
  assert.equal(ownProductsBody.products[0].category, 'vegetables')

  const createFruitProduct = await fetch(`${baseUrl}/api/custom-products`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({ name: 'Strawberries', category: 'fruits' }),
  })
  assert.equal(createFruitProduct.status, 201)
  const createdFruitProduct = (await createFruitProduct.json()) as {
    product: { category: string }
  }
  assert.equal(createdFruitProduct.product.category, 'fruits')

  const legacyProducts = await fetch(`${baseUrl}/api/products`, {
    headers: { cookie },
  })
  assert.equal(legacyProducts.status, 200)

  const wrongOrigin = await fetch(`${baseUrl}/api/custom-products`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin: 'https://unexpected.example',
    },
    body: JSON.stringify({ name: 'Blocked product', category: 'vegetables' }),
  })
  assert.equal(wrongOrigin.status, 403)

  const invalidProduct = await fetch(`${baseUrl}/api/custom-products`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({ name: 'Invalid product', category: 'invalid' }),
  })
  assert.equal(invalidProduct.status, 400)

  const invalidMealPlan = await fetch(`${baseUrl}/api/meal-plan`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({
      recipeId: 'recipe-123',
      recipeTitle: 'Test recipe',
      date: '2026-02-30',
      mealType: 'brunch',
    }),
  })
  assert.equal(invalidMealPlan.status, 400)

  const createMealPlan = await fetch(`${baseUrl}/api/meal-plan`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({
      recipeId: 'recipe-123',
      recipeTitle: 'Test recipe',
      date: '2026-10-19',
      mealType: 'dinner',
    }),
  })
  assert.equal(createMealPlan.status, 201)
  const createdMealPlanBody = (await createMealPlan.json()) as {
    mealPlan: {
      id: string
      recipeTitle: string
      date: string
      mealType: string
    }
  }
  assert.equal(createdMealPlanBody.mealPlan.recipeTitle, 'Test recipe')
  assert.equal(createdMealPlanBody.mealPlan.date, '2026-10-19')
  assert.equal(createdMealPlanBody.mealPlan.mealType, 'dinner')

  const ownMealPlans = await fetch(`${baseUrl}/api/meal-plan`, {
    headers: { cookie },
  })
  const ownMealPlansBody = (await ownMealPlans.json()) as {
    mealPlans: Array<{ id: string }>
  }
  assert.equal(ownMealPlans.status, 200)
  assert.equal(ownMealPlansBody.mealPlans.length, 1)
  assert.equal(
    ownMealPlansBody.mealPlans[0].id,
    createdMealPlanBody.mealPlan.id,
  )

  const createHistory = await fetch(`${baseUrl}/api/history`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({
      selectedIngredients: ['Tomato', 'Test potato'],
      matchedRecipesCount: 3,
    }),
  })
  assert.equal(createHistory.status, 201)

  const readHistory = await fetch(`${baseUrl}/api/history`, {
    headers: { cookie },
  })
  assert.equal(readHistory.status, 200)
  const historyBody = (await readHistory.json()) as {
    history: Array<{
      selectedIngredients: string[]
      matchedRecipesCount: number
    }>
  }
  assert.deepEqual(historyBody.history[0].selectedIngredients, [
    'Tomato',
    'Test potato',
  ])
  assert.equal(historyBody.history[0].matchedRecipesCount, 3)

  await prisma.history.createMany({
    data: Array.from({ length: 51 }, (_, index) => ({
      userId,
      selectedIngredients: JSON.stringify([`Older search ${index}`]),
      matchedRecipesCount: index,
      createdAt: new Date(Date.now() - (index + 1) * 60_000),
    })),
  })
  const newestHistory = await fetch(`${baseUrl}/api/history`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({
      selectedIngredients: ['Newest search'],
      matchedRecipesCount: 1,
    }),
  })
  assert.equal(newestHistory.status, 201)
  const cappedHistoryResponse = await fetch(`${baseUrl}/api/history`, {
    headers: { cookie },
  })
  const cappedHistoryBody = (await cappedHistoryResponse.json()) as {
    history: Array<{ selectedIngredients: string[] }>
  }
  assert.equal(cappedHistoryBody.history.length, 50)
  assert.deepEqual(cappedHistoryBody.history[0].selectedIngredients, [
    'Newest search',
  ])

  const session = await prisma.authSession.findFirst({ where: { userId } })
  assert.ok(session)
  assert.notEqual(session.tokenHash, cookie.split('=')[1])

  const secondRegistration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify({
      email: `other-${randomUUID()}@example.test`,
      password: 'another-long-test-password',
    }),
  })
  assert.equal(secondRegistration.status, 201)
  const secondUser = (await secondRegistration.json()) as {
    user: { id: string }
  }
  secondUserId = secondUser.user.id
  const secondCookie =
    secondRegistration.headers.get('set-cookie')?.split(';')[0] ?? ''
  const secondProducts = await fetch(`${baseUrl}/api/products`, {
    headers: { cookie: secondCookie },
  })
  const secondProductsBody = (await secondProducts.json()) as {
    products: Array<{ id: string }>
  }
  assert.equal(secondProducts.status, 200)
  assert.deepEqual(secondProductsBody.products, [])

  const crossUserDelete = await fetch(
    `${baseUrl}/api/products/${createdProduct.product.id}`,
    {
      method: 'DELETE',
      headers: { cookie: secondCookie, origin },
    },
  )
  assert.equal(crossUserDelete.status, 404)

  const secondUserHistory = await fetch(`${baseUrl}/api/history`, {
    headers: { cookie: secondCookie },
  })
  const secondHistoryBody = (await secondUserHistory.json()) as {
    history: unknown[]
  }
  assert.deepEqual(secondHistoryBody.history, [])

  const secondUserMealPlans = await fetch(`${baseUrl}/api/meal-plan`, {
    headers: { cookie: secondCookie },
  })
  const secondMealPlansBody = (await secondUserMealPlans.json()) as {
    mealPlans: unknown[]
  }
  assert.deepEqual(secondMealPlansBody.mealPlans, [])

  const crossUserMealPlanDelete = await fetch(
    `${baseUrl}/api/meal-plan/${createdMealPlanBody.mealPlan.id}`,
    {
      method: 'DELETE',
      headers: { cookie: secondCookie, origin },
    },
  )
  assert.equal(crossUserMealPlanDelete.status, 404)

  const duplicateRegistration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify({ email, password: 'a-long-test-password' }),
  })
  assert.equal(duplicateRegistration.status, 409)

  const duplicateProduct = await fetch(`${baseUrl}/api/products`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie,
      origin,
    },
    body: JSON.stringify({ name: 'test POTATO', category: 'vegetables' }),
  })
  assert.equal(duplicateProduct.status, 409)

  const logout = await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { cookie, origin },
  })
  assert.equal(logout.status, 204)

  const expiredSession = await fetch(`${baseUrl}/api/products`, {
    headers: { cookie },
  })
  assert.equal(expiredSession.status, 401)

  const invalidLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify({ email, password: 'incorrect-password' }),
  })
  assert.equal(invalidLogin.status, 401)

  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify({ email, password: 'a-long-test-password' }),
  })
  assert.equal(login.status, 200)
  const loginCookie = login.headers.get('set-cookie')?.split(';')[0] ?? ''
  assert.match(loginCookie, /^recipe_session=/)
  const deleteMealPlan = await fetch(
    `${baseUrl}/api/meal-plan/${createdMealPlanBody.mealPlan.id}`,
    {
      method: 'DELETE',
      headers: { cookie: loginCookie, origin },
    },
  )
  assert.equal(deleteMealPlan.status, 204)

  const currentUser = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { cookie: loginCookie },
  })
  const currentUserBody = (await currentUser.json()) as {
    user: { id: string; email: string }
  }
  assert.equal(currentUser.status, 200)
  assert.equal(currentUserBody.user.id, userId)
  const loginLogout = await fetch(`${baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { cookie: loginCookie, origin },
  })
  assert.equal(loginLogout.status, 204)

  await prisma.user.delete({ where: { id: secondUserId } })
  secondUserId = ''
  assert.equal(
    await prisma.authSession.count({ where: { userId: secondUser.user.id } }),
    0,
  )

  await prisma.user.delete({ where: { id: userId } })
  userId = ''
  assert.equal(
    await prisma.customProduct.count({ where: { userId: registered.user.id } }),
    0,
  )
  assert.equal(
    await prisma.history.count({ where: { userId: registered.user.id } }),
    0,
  )
})
