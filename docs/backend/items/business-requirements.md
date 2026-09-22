# Items — business requirements (backend)

## Purpose

Provide a persistent API for **Item** records so clients can create, read, update, and delete items without a database server.

## Business need

- Teams need a lightweight starter that behaves like a real service (validation, layering, HTTP API) but stays easy to run locally.
- Item data must survive process restarts without installing PostgreSQL or similar.

## Functional requirements

| ID | Requirement |
|----|-------------|
| BR-B-01 | Expose REST endpoints under `/api/items` for list, get by id, create, update (partial), and delete. |
| BR-B-02 | Each item has `title` (required, non-blank, max 200 chars) and `description` (optional, max 2000 chars). |
| BR-B-03 | Each item has stable `id`, `created_at`, and `updated_at` timestamps (UTC). |
| BR-B-04 | Persist all items in a single JSON file (`backend/data/items.json`) as an array. |
| BR-B-05 | Return `404` when an item id does not exist for get, update, or delete. |
| BR-B-06 | Return `422` for request bodies that fail Pydantic validation. |

## Non-goals

- Authentication and authorization.
- Multi-user concurrency guarantees or file locking beyond simple read/write.
- Full-text search, pagination, or filtering (may be added later).

## Success criteria

- CRUD operations round-trip through HTTP and are reflected in `items.json`.
- Invalid payloads are rejected before business logic runs.
