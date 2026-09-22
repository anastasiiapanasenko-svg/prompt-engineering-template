# Items — business requirements (frontend)

## Purpose

Give users a simple UI to manage **Items** backed by the FastAPI API.

## Business need

- Demonstrate a production-shaped frontend stack (TypeScript, component library, global state, API layer) with one clear vertical slice.
- No login flow; anyone with access to the app can manage items.

## Functional requirements

| ID | Requirement |
|----|-------------|
| BR-F-01 | Show a list of all items from the backend. |
| BR-F-02 | Allow creating an item with title (required) and description (optional). |
| BR-F-03 | Allow editing an existing item’s title and description. |
| BR-F-04 | Allow deleting an item with a confirmation step. |
| BR-F-05 | Show loading and error states when the API is unavailable. |
| BR-F-06 | After create/update/delete, the list reflects server state without manual refresh. |

## Validation (client)

- Block submit when title is empty after trim.
- Respect max lengths aligned with backend (title 200, description 2000).

## Non-goals

- Authentication, roles, or route guards.
- Offline mode or optimistic UI beyond RTK Query cache updates.

## Success criteria

- A user can complete full CRUD from the browser against a running backend.
