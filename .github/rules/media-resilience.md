# Media Resilience and Assets

Apply this guide when changing recipe images, image resolvers, image rendering, remote asset loading, or failure recovery.

## Image Sources and Rendering

- Recipe content remains in the local dataset and uses the existing image resolver in `frontend/src/data/recipes.ts`.
- Prefer direct Unsplash CDN food photography URLs; keep resolution deterministic and relevant to the dish.
- Do not add external recipe APIs or generated-image services without approval.
- Avoid duplicate displayed imagery where the resolver can distinguish repeated source URLs.
- Every rendered recipe image must include meaningful alt text localized to the active language.

## Required Image Fallback

- Every rendered recipe image must include an `onError` fallback handler to prevent broken-image icons.
- Use the default food image:
  `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`
- Prevent recursive failure by clearing the error handler before assigning the fallback URL, for example:
  ```tsx
  onError={(event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackImageUrl
  }}
  ```
- Keep fallback behavior consistent in recipe cards and recipe details.

## Verification

- Check every recipe image rendering site and confirm none bypasses fallback handling.
- Run `npm run build` from `frontend/` after media changes.