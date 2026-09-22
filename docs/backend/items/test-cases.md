# Items — test cases (backend)

Assume backend running at `http://localhost:8001`. Use curl, HTTP client, or OpenAPI UI at `/docs`.

## Health

| ID | Steps | Expected |
|----|-------|----------|
| TC-B-H01 | `GET /health` | `200`, body `{"status":"ok"}` |

## List

| ID | Steps | Expected |
|----|-------|----------|
| TC-B-L01 | `GET /api/items` on empty data | `200`, `[]` |
| TC-B-L02 | After creating items | `200`, array includes all items |

## Create

| ID | Steps | Expected |
|----|-------|----------|
| TC-B-C01 | `POST /api/items` with `{"title":"A","description":"d"}` | `201`, body has `id`, timestamps, fields |
| TC-B-C02 | `POST` with `{"title":"  B  "}` | `201`, title stored as `"B"` |
| TC-B-C03 | `POST` with `{"title":""}` or whitespace only | `422` |
| TC-B-C04 | `POST` with title longer than 200 chars | `422` |
| TC-B-C05 | Verify `backend/data/items.json` | New object appended to array |

## Get

| ID | Steps | Expected |
|----|-------|----------|
| TC-B-G01 | `GET /api/items/{valid_id}` | `200`, correct item |
| TC-B-G02 | `GET /api/items/{random_uuid}` | `404` |

## Update

| ID | Steps | Expected |
|----|-------|----------|
| TC-B-U01 | `PATCH /api/items/{id}` with `{"title":"New"}` | `200`, title updated, `updated_at` changes |
| TC-B-U02 | `PATCH` with `{"description":"x"}` only | `200`, title unchanged |
| TC-B-U03 | `PATCH` unknown id | `404` |
| TC-B-U04 | `PATCH` with blank title | `422` |

## Delete

| ID | Steps | Expected |
|----|-------|----------|
| TC-B-D01 | `DELETE /api/items/{id}` | `204`, item removed from file |
| TC-B-D02 | `DELETE` same id again | `404` |
| TC-B-D03 | `GET` deleted id | `404` |

## Persistence

| ID | Steps | Expected |
|----|-------|----------|
| TC-B-P01 | Create item, restart server, `GET /api/items` | Item still present |
