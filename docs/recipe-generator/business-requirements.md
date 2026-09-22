# Recipe Generator Based on Fridge Ingredients - Business Requirements

## 1. Project Overview

**Purpose:** Provide a simple three-page web application that helps users discover recipes based on ingredients available in their fridge.

**Primary goal:** Users select ingredients from a predefined list, apply optional filters, view relevant recipes, and open complete preparation instructions.

## 2. Scope

### In scope

- Predefined ingredient selection
- Vegetarian, Vegan, and Gluten-Free filters
- Maximum preparation-time filters of under 15, 30, or 60 minutes
- Relevance-ranked recipe results
- Partial-match results with missing ingredients clearly identified
- Recipe details with step-by-step instructions
- Fixed local JSON dataset containing 10-15 recipes
- Session-only state persistence across page navigation
- Responsive desktop and mobile experience
- Validation, loading, empty, and error states

### Out of scope

- Custom ingredient entry
- Authentication, accounts, or database persistence
- External recipe APIs or API keys
- Saved or favorited recipes
- Meal planning, grocery purchasing, or social features
- Serving-size adjustment
- Nutritional or medical advice

## 3. Target Users

- Home cooks seeking meal inspiration
- Users trying to reduce food waste
- Users working with limited ingredients
- Beginner cooks who need clear instructions

## 4. Pages and Requirements

### 4.1 Home / Ingredient Selection

- Display a predefined ingredient list.
- Allow users to select multiple ingredients.
- Do not allow custom ingredients.
- Display selected ingredients as removable items.
- Provide dietary preference controls for Vegetarian, Vegan, and Gluten-Free.
- Provide a maximum preparation-time selector for under 15, 30, or 60 minutes.
- Provide a primary action to generate recipes.
- Require at least one selected ingredient before generating recipes.
- Preserve selected ingredients and active filters during navigation.

### 4.2 Recipe List

- Display the selected ingredients and active filters.
- Show matching recipes in a list or grid.
- Display each recipe's name, placeholder image, preparation time, difficulty, and match percentage.
- Automatically rank recipes by the percentage of required ingredients matched.
- Include partial matches, even when ingredients are missing.
- Clearly highlight missing ingredients.
- Allow users to open a recipe's details.
- Allow users to return to ingredient selection.
- Show useful loading, empty, and error states.

### 4.3 Recipe Details

- Display the recipe name, placeholder image, preparation time, cooking time when available, fixed serving size, difficulty, and dietary tags.
- List all required ingredients and quantities.
- Clearly distinguish available ingredients from missing ingredients.
- Display step-by-step preparation instructions.
- Keep serving sizes fixed; no quantity recalculation is required.
- Provide navigation back to the recipe list.
- Preserve the current ingredients and filters when returning to the list.
- Handle missing or unavailable recipe data gracefully.

## 5. Data Requirements

Use a fixed structured JSON dataset embedded directly in the project. It must contain 10-15 diverse recipes. Each recipe must include:

- Unique identifier
- Name and description
- Placeholder image reference
- Ingredient names and quantities
- Preparation time and optional cooking time
- Fixed serving size
- Difficulty level
- Dietary tags
- Step-by-step preparation instructions

The predefined ingredient list must be curated alongside the recipe dataset. Ingredient values should be normalized to support reliable matching.

## 6. Functional Requirements

| ID | Requirement |
|----|-------------|
| BR-01 | Users must select at least one ingredient before generating recipes. |
| BR-02 | Users may select ingredients only from the predefined list. |
| BR-03 | The application must match selected ingredients against recipe ingredients. |
| BR-04 | The application must show partial matches and identify missing ingredients. |
| BR-05 | Users must be able to filter by Vegetarian, Vegan, and Gluten-Free preferences. |
| BR-06 | Users must be able to filter by maximum preparation times of under 15, 30, or 60 minutes. |
| BR-07 | Results must be sorted automatically by matching ingredient percentage. |
| BR-08 | Users must be able to navigate from the recipe list to recipe details and back. |
| BR-09 | Selected ingredients and active filters must persist across page navigation. |
| BR-10 | The application must provide validation, loading, empty, and error feedback. |
| BR-11 | Recipe serving sizes must remain fixed. |
| BR-12 | Recipe content must load from the local JSON dataset without external services. |

## 7. State and Persistence

- The application is session-only.
- No authentication, accounts, or server-side persistence are required.
- Selected ingredients and active filters must remain available across all three pages.
- State may be held in application memory and/or `localStorage` for the active browser session.
- A reset or new-search action should clear or replace the current selection and filters.
- No user profile, search history, or long-term recipe storage is required.

## 8. Non-Functional Requirements

- Support current desktop, tablet, and mobile browsers.
- Keep local searches fast and independent of network availability.
- Provide keyboard-accessible controls with visible focus states.
- Use accessible labels and meaningful alternative text for images.
- Do not rely on color alone to communicate missing ingredients or dietary status.
- Keep text and controls readable at supported screen sizes.

## 9. Business Rules

1. At least one predefined ingredient is required to generate results.
2. Custom ingredients are not supported.
3. Recipes can appear when some required ingredients are missing.
4. Missing ingredients must be clearly identified.
5. Relevance is calculated from the percentage of required ingredients matched.
6. Dietary filters return only recipes compatible with the selected preferences.
7. Preparation-time filters exclude recipes exceeding the selected limit.
8. Recipe serving sizes are fixed.
9. User selections persist during the active browsing session.
10. Recipe content comes from the embedded local JSON dataset.

## 10. Success Criteria

- Users can select predefined ingredients and generate recipes without assistance.
- Results are ranked by ingredient-match relevance.
- Partial matches are useful and missing ingredients are obvious.
- Dietary and preparation-time filters work as specified.
- Users can follow complete recipe instructions from the details page.
- Ingredients and filters persist while navigating between pages.
- The application works without external APIs or authentication.
- The interface is usable on mobile and desktop.
- Invalid, empty, loading, and unavailable states are understandable.
