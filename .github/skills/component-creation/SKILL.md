---
name: component-creation
description: Use this skill when creating or updating React UI components for the recipe generator.
---

# Component Creation Skill

## When to use

Use this skill for:

- Ingredient selector controls
- Recipe cards and result lists
- Filter controls
- Recipe detail panels
- Empty, loading, and not-found states

## Rules

- Keep components small, focused, and reusable.
- Prefer typed props and explicit state responsibilities.
- Do not embed recipe matching logic directly inside presentational components.
- Separate view logic from business rules and data transformation.
- Use existing UI primitives where possible and keep styling consistent with the project.

## Good patterns

- Presentational components receive data and callbacks as props.
- Feature-specific container components manage state and pass down typed payloads.
- Use semantic labels, keyboard accessibility, and clear empty states.
- Keep placeholder images and dietary badges consistent.

## Validation checklist

- Is the component focused on one responsibility?
- Are props and outputs strongly typed?
- Does it avoid direct mutation or hidden business logic?
- Is the UI accessible and readable at different screen sizes?
