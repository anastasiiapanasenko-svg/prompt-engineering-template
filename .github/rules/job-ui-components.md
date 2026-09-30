# UI Components and Visual Design

Apply these rules when creating or changing React components, cards, dialogs, buttons, controls, layouts, and responsive presentation.

## Glass Design

- Preserve the macOS/iOS frosted-glass visual language: dark espresso surfaces, visible translucency, `backdrop-blur-xl`, soft borders, and restrained shadows.
- Use the established `#120a06` espresso base, cream text, and amber/gold accents. Retain the warm dark-marble culinary hero and ambient background treatment.
- Glass must remain visibly translucent over its background. Do not replace glass panels with opaque fills or remove blur, border, or shadow to simplify styling.
- Keep text on glass crisp and readable. Maintain clear contrast for headings, body text, controls, match percentages, green available-ingredient labels, and amber missing-ingredient labels.
- Keep the established warm palette. Do not introduce unrelated color systems or competing gradients.

## Component Structure and Accessibility

- Prefer small, focused functional components with explicit TypeScript props and responsibilities.
- Reuse existing UI primitives in `frontend/src/components/ui/` and follow nearby feature patterns.
- Keep business rules out of presentation components; render state provided by selectors and domain helpers.
- Keep controls keyboard-operable, provide visible focus states and meaningful accessible names, and use semantic elements.
- Maintain responsive layouts without text or controls overlapping at mobile or desktop widths.
- Ingredient availability must use descriptive text as well as color; color alone is insufficient.
- Preserve meaningful, localized alt text for images.

## Verification

- Run the build instructions in [job-build-testing.md](job-build-testing.md) after UI changes.