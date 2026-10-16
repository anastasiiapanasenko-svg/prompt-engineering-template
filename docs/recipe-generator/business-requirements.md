# Recipe Generator Based on Fridge Ingredients - Business Requirements

## 1. Project Overview

**Purpose:** Provide a responsive recipe-discovery application that helps users find recipes from fridge ingredients, with optional accounts for private custom-product lists and search history.

**Primary goal:** Users select ingredients from the predefined catalog and their own saved products, apply filters, view relevant recipes, and open complete preparation instructions. Registered users can manage personal products and review recent searches.

## 2. Scope

### In scope

- Predefined ingredient selection
- Vegetarian, Vegan, and Gluten-Free filters
- Maximum preparation-time filters of under 15, 30, or 60 minutes
- Relevance-ranked recipe results
- Partial-match results with missing ingredients clearly identified
- Recipe details with step-by-step instructions
- Fixed local TypeScript dataset of bilingual recipes (currently 72 records; the collection may grow through approved additions)
- Session-only state persistence across page navigation
- Optional email/password registration and sign-in
- SQLite persistence for accounts, custom products, and search history
- User-owned product management and search-history viewing
- User-owned meal plans organized by date and breakfast, lunch, or dinner
- Responsive desktop and mobile experience
- Validation, loading, empty, and error states

### Out of scope

- External recipe APIs or recipe databases
- Password recovery, email verification, social sign-in, and multi-factor authentication
- Administrative account management
- Saved or favorited recipes
- Grocery purchasing or social features
- Serving-size adjustment
- Nutritional or medical advice

## 3. Target Users

- Home cooks seeking meal inspiration
- Users trying to reduce food waste
- Users working with limited ingredients
- Beginner cooks who need clear instructions

## 4. Pages and Requirements

### 4.1 Home / Ingredient Selection

- Display the predefined ingredient list and, for signed-in users, their saved custom products.
- Allow users to select multiple ingredients.
- Allow signed-in users to add or remove custom products with a name and one of the eight existing ingredient categories.
- Suggest matching bilingual common products while entering a custom-product name; choosing a suggestion fills its localized name and category, while unmatched free-text names remain allowed.
- Keep saved custom products private to their owner. Custom products can be selected for matching; recipes only match when their ingredient names match.
- Display selected ingredients as removable items.
- Provide dietary preference controls for Vegetarian, Vegan, and Gluten-Free.
- Provide a maximum preparation-time selector for under 15, 30, or 60 minutes.
- Provide a primary action to generate recipes.
- Require at least one selected ingredient before generating recipes.
- Preserve selected ingredients and active filters during navigation.
- Provide a top-right header account avatar that opens a bilingual panel for account registration, sign-in, profile details, and sign-out.
- Show a signed-in user's custom products and recent search history.
- Record selected ingredients and the locally calculated result count after an authenticated search.

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

- Display the recipe name, image, preparation time, fixed serving size, difficulty, and dietary tags.
- List all required ingredients and quantities.
- Clearly distinguish available ingredients from missing ingredients.
- Display step-by-step preparation instructions.
- Keep serving sizes fixed; no quantity recalculation is required.
- Provide navigation back to the recipe list.
- Preserve the current ingredients and filters when returning to the list.
- Handle missing or unavailable recipe data gracefully.

## 5. Data Requirements

Use the fixed typed recipe dataset embedded in `recipe-app-frontend/src/data/recipes.ts`. Each recipe must follow the shared `Recipe` interface and include:

- Unique identifier
- Name and description
- Placeholder image reference
- Ingredient names and quantities
- Preparation time
- Fixed serving size
- Difficulty level
- Dietary tags
- Step-by-step preparation instructions

The canonical ingredient selector list is maintained alongside the recipe dataset. EN/UA labels and the eight ingredient category assignments are maintained in `recipe-app-frontend/src/lib/i18n.ts`. Ingredient values should be normalized to support reliable matching.

Account data is stored in the SQLite database defined by `recipe-app-backend/prisma/schema.prisma`. Passwords are stored only as bcrypt hashes. Search selections are serialized as JSON in `History.selectedIngredients`; product categories use the existing eight category ids. `MealPlan` stores a recipe identifier and title with a date and meal type. An `AuthSession` model stores a hash of each random session token, never the raw cookie token.

## 6. Functional Requirements

| ID    | Requirement                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| BR-01 | Users must select at least one ingredient before generating recipes.                                                                      |
| BR-02 | Users may select predefined ingredients and signed-in custom products.                                                                    |
| BR-03 | The application must match selected ingredients against recipe ingredients.                                                               |
| BR-04 | The application must show partial matches and identify missing ingredients.                                                               |
| BR-05 | Users must be able to filter by Vegetarian, Vegan, and Gluten-Free preferences.                                                           |
| BR-06 | Users must be able to filter by maximum preparation times of under 15, 30, or 60 minutes.                                                 |
| BR-07 | Results must be sorted automatically by matching ingredient percentage.                                                                   |
| BR-08 | Users must be able to navigate from the recipe list to recipe details and back.                                                           |
| BR-09 | Selected ingredients and active filters must persist across page navigation.                                                              |
| BR-10 | The application must provide validation, loading, empty, and error feedback.                                                              |
| BR-11 | Recipe serving sizes must remain fixed.                                                                                                   |
| BR-12 | Recipe content must load from the local TypeScript dataset without external services.                                                     |
| BR-13 | Users may register, sign in, inspect their account, and sign out using email and password.                                                |
| BR-14 | Passwords must be hashed, and authenticated browser sessions must use HttpOnly cookies.                                                   |
| BR-15 | Signed-in users may create, list, and delete only their own custom products.                                                              |
| BR-16 | Signed-in searches must store selected ingredient names and the locally calculated match count; users may view their recent searches.     |
| BR-17 | Signed-in users may add, list, and delete meal plans for a recipe, date, and breakfast/lunch/dinner meal type.                            |
| BR-18 | User, product, history, meal-plan, and session records must be stored in SQLite with user-owned rows deleted when their owner is deleted. |

## 7. State and Persistence

- Recipe selection, filters, page, selected recipe, and language remain session-only in browser `sessionStorage`.
- Account, custom-product, search-history, and meal-plan records persist in the local SQLite database.
- Unauthenticated visitors retain the existing local recipe-search behavior; account features are optional.
- Selected ingredients and active filters must remain available across all three pages.
- Search results remain calculated from the local dataset in the frontend; the API stores only search history, not recipes or matching results.
- A reset or new-search action should clear or replace the current selection and filters.
- No profile beyond email and optional display name, no saved recipes, and no long-term search analytics are required. The UI displays at most the 5 newest entries from the API's 50-entry recent-history response.
- The API retains only the 50 most recent search records per user.

## 8. Non-Functional Requirements

- Support current desktop, tablet, and mobile browsers.
- Keep recipe matching deterministic and local. Account actions require the local API and display recoverable errors when it is unavailable.
- Never return password hashes or raw session tokens from the API. Store only hashed random session tokens, expire sessions, and limit authentication attempts.
- Restrict product and history reads/writes to the authenticated owner.
- Protect state-changing cookie-authenticated requests with same-origin validation and `SameSite=Lax` cookies.
- Provide keyboard-accessible controls with visible focus states.
- Use accessible labels and meaningful alternative text for images.
- Do not rely on color alone to communicate missing ingredients or dietary status.
- Keep text and controls readable at supported screen sizes.

## 9. Business Rules

1. At least one catalog or signed-in custom ingredient is required to generate results.
2. Custom products require authentication and use exactly one of the eight ingredient categories.
3. Recipes can appear when some required ingredients are missing.
4. Missing ingredients must be clearly identified.
5. Relevance is calculated from the percentage of required ingredients matched.
6. Dietary filters return only recipes compatible with the selected preferences.
7. Preparation-time filters exclude recipes exceeding the selected limit.
8. Recipe serving sizes are fixed.
9. Search selections persist during the active browsing session; account products and search history persist in SQLite.
10. Recipe content comes from the embedded local TypeScript dataset.
11. A user can access or mutate only products and history associated with their own account.
12. Passwords are hashed with bcrypt and browser session tokens are stored only as SHA-256 hashes.
13. Selected custom-product names are normalized with the same canonical ingredient matching as standard ingredients.
14. Meal plans use a valid ISO calendar date and one of the supported meal types, and remain private to their owner.

## 10. Success Criteria

- Users can select predefined ingredients and generate recipes without assistance.
- Results are ranked by ingredient-match relevance.
- Partial matches are useful and missing ingredients are obvious.
- Dietary and preparation-time filters work as specified.
- Users can follow complete recipe instructions from the details page.
- Ingredients and filters persist while navigating between pages.
- Recipe discovery works without an external recipe service and remains available to unauthenticated users.
- Registered users can manage products and retrieve their own recent search history.
- The interface is usable on mobile and desktop.
- Invalid, empty, loading, and unavailable states are understandable.
