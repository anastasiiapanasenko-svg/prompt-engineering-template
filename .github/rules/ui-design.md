# UI Design and Components

Apply this guide when building or changing React components, cards, dialogs, buttons, controls, filters, layouts, or responsive presentation.

## Glassmorphism and Visual System

- Preserve the established macOS/iOS frosted-glass design: translucent dark espresso surfaces, visible `backdrop-blur-xl`, soft amber borders, and restrained shadows.
- Use the `#120a06` espresso base, cream text, amber/gold accents, and the existing dark-marble/luxury-kitchen hero and ambient background treatment.
- Glass must remain visibly translucent over its background. Do not replace glass panels with opaque fills or remove blur, borders, or shadows.
- Keep title text, body copy, controls, match percentages, available-ingredient labels, and missing-ingredient labels crisp and high contrast.
- Keep ingredient status understandable through labels as well as color.

## Component Quality and Accessibility

- Prefer focused functional components with explicit TypeScript props and responsibilities.
- Reuse shared primitives in `frontend/src/components/ui/` and follow nearby feature patterns.
- Keep business rules out of components; render state supplied by selectors and domain helpers.
- Keep controls semantic, keyboard accessible, and equipped with visible focus states and meaningful accessible names.
- Ensure responsive layouts do not overlap or clip text and controls.
- Provide meaningful localized alt text for visual assets.

## Related Skill

For recipe cards, ingredient selectors, filters, detail panels, and UI states, also follow [component-creation](../skills/component-creation/SKILL.md).