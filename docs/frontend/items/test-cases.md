# Items — test cases (frontend)

Manual checks with backend on `http://localhost:8001` and frontend on `http://localhost:5174`.

## Setup

| ID | Steps | Expected |
|----|-------|----------|
| TC-F-S01 | Run backend and frontend | Items page loads |
| TC-F-S02 | Stop backend, reload page | Error message about backend / failed load |

## List

| ID | Steps | Expected |
|----|-------|----------|
| TC-F-L01 | Open app with empty API | “No items yet” empty state |
| TC-F-L02 | Seed items via API | Cards show title, description, updated time |

## Create

| ID | Steps | Expected |
|----|-------|----------|
| TC-F-C01 | Click “New item”, fill title, Save | Dialog closes, new card appears |
| TC-F-C02 | Submit with empty title | Inline error, no request |
| TC-F-C03 | Cancel dialog | No new item |

## Edit

| ID | Steps | Expected |
|----|-------|----------|
| TC-F-E01 | Click edit on a card, change title, Save | Card shows new title |
| TC-F-E02 | Clear title and Save | Validation error |

## Delete

| ID | Steps | Expected |
|----|-------|----------|
| TC-F-D01 | Click delete, confirm | Card removed |
| TC-F-D02 | Click delete, cancel | Card remains |

## API integration

| ID | Steps | Expected |
|----|-------|----------|
| TC-F-A01 | Create item in UI | Same record in `GET /api/items` |
| TC-F-A02 | Create in UI, refresh browser | Item still listed (server persistence) |

## Accessibility (smoke)

| ID | Steps | Expected |
|----|-------|----------|
| TC-F-X01 | Tab to action buttons | Focus visible |
| TC-F-X02 | Edit/delete buttons | `aria-label` includes item title |
