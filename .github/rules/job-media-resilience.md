# Recipe Media and Resilience

Apply these rules when changing recipe images, image resolvers, image components, or remote media behavior.

## Image Sources and Rendering

- Recipe records use the local dataset and its shared image resolver in `frontend/src/data/recipes.ts`; preserve that boundary.
- Prefer direct Unsplash CDN food photography URLs and keep image resolution deterministic. Do not introduce an external recipe API or generated-image service without approval.
- Ensure image choices are appropriate to the dish and avoid duplicate displayed images where the resolver can distinguish repeated source URLs.
- Render recipe images with meaningful alt text localized to the active language.

## Required Fallback

- Every rendered recipe image must have an `onError` fallback handler.
- Use this default food image:
  `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80`
- Prevent recursive error handling by clearing the error handler before setting the fallback URL, for example:
  ```tsx
  onError={(event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackImageUrl
  }}
  ```
- Keep the fallback treatment consistent in recipe cards and recipe details.

## Verification

- Check all recipe image rendering sites and verify that no image path bypasses the fallback handler.
- Run the build instructions in [job-build-testing.md](job-build-testing.md).