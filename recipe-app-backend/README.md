# Recipe Generator API

Standalone Express API for optional email/password accounts, private custom products, and search history. It does not store recipes or perform recipe matching.

## Requirements

- Node.js 20 or newer
- npm

## Local setup

From this directory:

```powershell
Copy-Item .env.example .env
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

The default API address is `http://localhost:8001`. The default SQLite database is `prisma/dev.db`, located alongside the Prisma schema.

After pulling later schema changes, use `npm run db:migrate` during development or `npm run db:deploy` to apply committed migrations.

A separately deployed client should set `VITE_API_BASE_URL` to this API's origin; routes are served under `/api`. Set `APP_ORIGIN` to the exact client origin (default `http://localhost:5174`). If deploying client and API separately, use same-site origins; cross-site cookie deployment is not supported by the default `SameSite=Lax` configuration.

## API

All JSON routes are under `/api`.

| Method   | Route            | Authentication | Purpose                                                    |
| -------- | ---------------- | -------------- | ---------------------------------------------------------- |
| `GET`    | `/health`        | No             | Liveness check.                                            |
| `POST`   | `/auth/register` | No             | Create an account and start a session.                     |
| `POST`   | `/auth/login`    | No             | Authenticate and start a session.                          |
| `GET`    | `/auth/me`       | Optional       | Return the current safe user record or `null`.             |
| `POST`   | `/auth/logout`   | Optional       | Revoke the current session and clear its cookie.           |
| `GET`    | `/products`      | Yes            | List the current user's products.                          |
| `POST`   | `/products`      | Yes            | Add a product with one of the eight ingredient categories. |
| `DELETE` | `/products/:id`  | Yes            | Delete a product owned by the current user.                |
| `GET`    | `/history`       | Yes            | Return up to 50 newest searches for the current user.      |
| `POST`   | `/history`       | Yes            | Record selected ingredient names and local match count.    |
| `GET`    | `/meal-plan`     | Yes            | Return the current user's meal plans ordered by date.      |
| `POST`   | `/meal-plan`     | Yes            | Add a recipe to a date and meal type.                      |
| `DELETE` | `/meal-plan/:id` | Yes            | Delete a meal-plan entry owned by the current user.        |

Custom products are available at both `/custom-products` and the backwards-compatible `/products` routes. `POST` requires a name and category id: `meat`, `grains`, `vegetables`, `fruits`, `dairy`, `bakery`, `spices`, or `pantry`.

Meal-plan creation requires `recipeId`, `recipeTitle`, `date` (`YYYY-MM-DD`), and `mealType` (`breakfast`, `lunch`, or `dinner`). Plans are private to the authenticated user and cascade-delete with the account.

Passwords must contain 12–72 UTF-8 bytes and are hashed using bcrypt. Session tokens are cryptographically random, delivered only in an HttpOnly, SameSite=Lax cookie, and stored in SQLite only as SHA-256 hashes. Sessions expire after seven days. Authentication endpoints are rate-limited; state-changing API requests must include the configured `APP_ORIGIN`.

Custom-product category ids are `meat`, `grains`, `vegetables`, `fruits`, `dairy`, `bakery`, `spices`, and `pantry`. Products and history are always scoped to the authenticated user. The API stores recipe match counts submitted by the frontend but does not store recipe data or perform recipe matching.

## Verification

```powershell
npm test
npm run build
```

`npm test` runs an API integration check against the database configured by `DATABASE_URL`; apply migrations first. Use a disposable local database if you do not want test records written to your development database.

## Limitations

This is a local MVP, not a production-ready identity service. It does not include email verification, password recovery, multi-factor authentication, account deletion UI, or deployment hardening. Production deployment requires HTTPS, a production database and secrets policy, operational backups, and a reviewed origin/rate-limit configuration.
