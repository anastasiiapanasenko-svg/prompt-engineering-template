import { createHash, randomBytes } from 'node:crypto'

import bcrypt from 'bcryptjs'
import cors from 'cors'
import express, {
  type ErrorRequestHandler,
  type Request,
  type RequestHandler,
  type Response,
} from 'express'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { z } from 'zod'

import type { Prisma, PrismaClient } from '@prisma/client'
import { prisma } from './prisma.js'

const appOrigin = new URL(
  process.env.APP_ORIGIN?.trim() || 'http://localhost:5174',
).origin
const sessionCookie = 'recipe_session'
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000
const productCategories = [
  'meat',
  'grains',
  'vegetables',
  'fruits',
  'dairy',
  'bakery',
  'spices',
  'pantry',
] as const

const registrationSchema = z.object({
  email: z.email().max(254),
  password: z
    .string()
    .min(12)
    .max(72)
    .refine((password) => Buffer.byteLength(password, 'utf8') <= 72),
  name: z.string().trim().min(1).max(80).optional(),
})

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(72),
})

const productSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.enum(productCategories),
})

const historySchema = z.object({
  selectedIngredients: z
    .array(z.string().trim().min(1).max(100))
    .min(1)
    .max(100),
  matchedRecipesCount: z.number().int().min(0).max(10000),
})

const mealPlanSchema = z.object({
  recipeId: z.string().trim().min(1).max(100),
  recipeTitle: z.string().trim().min(1).max(200),
  date: z.iso.date(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
})

interface SessionUser {
  id: string
  email: string
  name: string | null
  createdAt: Date
}

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex')

const normalizeProductName = (name: string) =>
  name.normalize('NFKC').trim().toLocaleLowerCase('en-US')

const cookieOptions = (expires: Date) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}${secure}`
}

const setSessionCookie = (response: Response, token: string, expires: Date) => {
  response.setHeader(
    'Set-Cookie',
    `${sessionCookie}=${token}${cookieOptions(expires)}`,
  )
}

const clearSessionCookie = (response: Response) => {
  response.setHeader(
    'Set-Cookie',
    `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`,
  )
}

const readSessionToken = (request: Request) => {
  const cookieHeader = request.headers.cookie
  if (!cookieHeader) return null

  const sessionCookiePair = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))

  return sessionCookiePair?.slice(sessionCookie.length + 1) ?? null
}

type DatabaseClient = PrismaClient | Prisma.TransactionClient

const createSessionRecord = async (client: DatabaseClient, userId: string) => {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + sessionLifetimeMs)

  await client.authSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })
  await client.authSession.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  })
  return { token, expiresAt }
}

const requireUser: RequestHandler = async (request, response, next) => {
  try {
    const token = readSessionToken(request)
    if (!token) {
      response.status(401).json({ error: 'Authentication required.' })
      return
    }

    const session = await prisma.authSession.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: true },
    })

    if (!session || session.expiresAt <= new Date()) {
      if (session) {
        await prisma.authSession.delete({
          where: { tokenHash: session.tokenHash },
        })
      }
      clearSessionCookie(response)
      response.status(401).json({ error: 'Authentication required.' })
      return
    }

    response.locals.user = session.user satisfies SessionUser
    next()
  } catch (error) {
    next(error)
  }
}

const userResponse = ({ id, email, name, createdAt }: SessionUser) => ({
  id,
  email,
  name,
  createdAt,
})

const authenticationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
})

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: appOrigin, credentials: true }))
app.use(express.json({ limit: '16kb' }))

app.use('/api', (request, response, next) => {
  if (
    !['GET', 'HEAD', 'OPTIONS'].includes(request.method) &&
    request.get('origin') !== appOrigin
  ) {
    response.status(403).json({ error: 'Request origin is not allowed.' })
    return
  }
  next()
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.post(
  '/api/auth/register',
  authenticationRateLimit,
  async (request, response) => {
    const input = registrationSchema.parse(request.body)
    const email = input.email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(input.password, 12)
    const { user, session } = await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: { email, password: passwordHash, name: input.name },
      })
      const session = await createSessionRecord(transaction, user.id)
      return { user, session }
    })

    setSessionCookie(response, session.token, session.expiresAt)
    response.status(201).json({ user: userResponse(user) })
  },
)

app.post(
  '/api/auth/login',
  authenticationRateLimit,
  async (request, response) => {
    const input = loginSchema.parse(request.body)
    const email = input.email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      response.status(401).json({ error: 'Email or password is incorrect.' })
      return
    }

    const session = await createSessionRecord(prisma, user.id)
    setSessionCookie(response, session.token, session.expiresAt)
    response.json({ user: userResponse(user) })
  },
)

app.get('/api/auth/me', async (request, response) => {
  const token = readSessionToken(request)
  if (!token) {
    response.json({ user: null })
    return
  }

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })

  if (!session || session.expiresAt <= new Date()) {
    if (session) {
      await prisma.authSession.delete({
        where: { tokenHash: session.tokenHash },
      })
    }
    clearSessionCookie(response)
    response.json({ user: null })
    return
  }

  response.json({ user: userResponse(session.user) })
})

app.post('/api/auth/logout', async (request, response) => {
  const token = readSessionToken(request)
  if (token) {
    await prisma.authSession.deleteMany({
      where: { tokenHash: hashToken(token) },
    })
  }
  clearSessionCookie(response)
  response.status(204).end()
})

const customProductsRouter = express.Router()

customProductsRouter.get('/', requireUser, async (_request, response) => {
  const user = response.locals.user as SessionUser
  const products = await prisma.customProduct.findMany({
    where: { userId: user.id },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, category: true, createdAt: true },
  })
  response.json({ products })
})

customProductsRouter.post('/', requireUser, async (request, response) => {
  const input = productSchema.parse(request.body)
  const user = response.locals.user as SessionUser
  const normalizedName = normalizeProductName(input.name)
  const existingProducts = await prisma.customProduct.findMany({
    where: { userId: user.id },
    select: { name: true },
  })
  if (
    existingProducts.some(
      (product) => normalizeProductName(product.name) === normalizedName,
    )
  ) {
    response.status(409).json({ error: 'This product already exists.' })
    return
  }

  const product = await prisma.customProduct.create({
    data: { ...input, userId: user.id, normalizedName },
    select: { id: true, name: true, category: true, createdAt: true },
  })
  response.status(201).json({ product })
})

customProductsRouter.delete('/:id', requireUser, async (request, response) => {
  const user = response.locals.user as SessionUser
  const productId = z.string().uuid().safeParse(request.params.id)
  if (!productId.success) {
    response.status(404).json({ error: 'Product not found.' })
    return
  }

  const result = await prisma.customProduct.deleteMany({
    where: { id: productId.data, userId: user.id },
  })
  if (result.count === 0) {
    response.status(404).json({ error: 'Product not found.' })
    return
  }
  response.status(204).end()
})

app.use(['/api/products', '/api/custom-products'], customProductsRouter)

app.get('/api/meal-plan', requireUser, async (_request, response) => {
  const user = response.locals.user as SessionUser
  const mealPlans = await prisma.mealPlan.findMany({
    where: { userId: user.id },
    orderBy: [{ date: 'asc' }, { mealType: 'asc' }, { createdAt: 'asc' }],
  })
  response.json({ mealPlans })
})

app.post('/api/meal-plan', requireUser, async (request, response) => {
  const input = mealPlanSchema.parse(request.body)
  const user = response.locals.user as SessionUser
  const mealPlan = await prisma.mealPlan.create({
    data: { ...input, userId: user.id },
  })
  response.status(201).json({ mealPlan })
})

app.delete('/api/meal-plan/:id', requireUser, async (request, response) => {
  const user = response.locals.user as SessionUser
  const mealPlanId = z.string().uuid().safeParse(request.params.id)
  if (!mealPlanId.success) {
    response.status(404).json({ error: 'Meal plan entry not found.' })
    return
  }

  const result = await prisma.mealPlan.deleteMany({
    where: { id: mealPlanId.data, userId: user.id },
  })
  if (result.count === 0) {
    response.status(404).json({ error: 'Meal plan entry not found.' })
    return
  }
  response.status(204).end()
})

app.get('/api/history', requireUser, async (_request, response) => {
  const user = response.locals.user as SessionUser
  const history = await prisma.history.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  response.json({
    history: history.map((entry) => ({
      id: entry.id,
      selectedIngredients: JSON.parse(entry.selectedIngredients) as string[],
      matchedRecipesCount: entry.matchedRecipesCount,
      createdAt: entry.createdAt,
    })),
  })
})

app.post('/api/history', requireUser, async (request, response) => {
  const input = historySchema.parse(request.body)
  const user = response.locals.user as SessionUser
  const entry = await prisma.$transaction(async (transaction) => {
    const entry = await transaction.history.create({
      data: {
        userId: user.id,
        selectedIngredients: JSON.stringify(input.selectedIngredients),
        matchedRecipesCount: input.matchedRecipesCount,
      },
    })
    const olderEntries = await transaction.history.findMany({
      where: { userId: user.id },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: 50,
      select: { id: true },
    })
    if (olderEntries.length > 0) {
      await transaction.history.deleteMany({
        where: {
          userId: user.id,
          id: { in: olderEntries.map((olderEntry) => olderEntry.id) },
        },
      })
    }
    return entry
  })
  response.status(201).json({
    history: {
      id: entry.id,
      selectedIngredients: input.selectedIngredients,
      matchedRecipesCount: entry.matchedRecipesCount,
      createdAt: entry.createdAt,
    },
  })
})

app.use((_request, response) => {
  response.status(404).json({ error: 'Endpoint not found.' })
})

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400
  ) {
    response.status(400).json({ error: 'Invalid JSON request body.' })
    return
  }

  if (error instanceof z.ZodError) {
    response.status(400).json({
      error: 'Invalid request data.',
      details: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  ) {
    response.status(409).json({
      error: 'An account or product with these unique values already exists.',
    })
    return
  }

  console.error('Unhandled API error:', error)
  response.status(500).json({ error: 'An unexpected server error occurred.' })
}

app.use(errorHandler)
