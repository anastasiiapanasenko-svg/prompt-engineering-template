# Items — architecture (backend)

## Overview

Items follow a **layered architecture** with dependency injection at the HTTP boundary.

```mermaid
flowchart LR
  Router --> Service
  Service --> Repository
  Repository --> JSONFile["items.json"]
```

## Layers

| Layer | Responsibility | Location |
|-------|----------------|----------|
| Router | HTTP mapping, status codes, inject `ItemService` only | `app/routers/items.py` |
| Service | Business rules, `ItemNotFoundError`, DTO mapping | `app/services/item_service.py` |
| Repository | Load/save array in one file, no HTTP knowledge | `app/repositories/item_repository.py` |
| Models | Pydantic schemas for create/update/response and storage shape | `app/models/item.py` |
| Types | Domain aliases (e.g. `ItemId`) | `app/types/item.py` |
| Utils | Path resolution, generic JSON list read/write | `app/utils/` |

## Dependency injection

- `app/dependencies.py` defines `get_item_repository()` (cached) and `get_item_service(repository=Depends(...))`.
- Routers use `Depends(get_item_service)` so tests can override providers later.

## Storage decision

- **One file per entity**, JSON **array** of objects.
- Rationale: zero external services, easy inspection, matches boilerplate goals.
- Trade-off: not suitable for high write concurrency or large datasets.

## Validation

- **Pydantic v2** on request bodies (`ItemCreate`, `ItemUpdate`) and stored records (`ItemInDb`).
- Title trimming and non-empty checks live on models via validators.

## API surface

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/items` | List all |
| GET | `/api/items/{id}` | Single item |
| POST | `/api/items` | Create, `201` |
| PATCH | `/api/items/{id}` | Partial update |
| DELETE | `/api/items/{id}` | `204`, idempotent not found → `404` |

CORS allows `http://localhost:5174` for the Vite dev server.
