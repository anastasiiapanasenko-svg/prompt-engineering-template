# Recipe Generator - Test Cases

## Home / Ingredient Selection

| ID      | Steps                                                                      | Expected                                                                                                                  |
| ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| TC-H-01 | Open the application                                                       | Home page shows the predefined ingredient list, filter controls, and optional account panel.                              |
| TC-H-02 | Select multiple predefined ingredients                                     | Selected ingredients are visible and removable.                                                                           |
| TC-H-03 | Visit Home while signed out                                                | Custom-product management is unavailable; predefined ingredients remain usable.                                           |
| TC-H-04 | Select Vegetarian, Vegan, and Gluten-Free filters                          | Each selected filter shows an active state.                                                                               |
| TC-H-05 | Select each preparation-time option                                        | The selected limit is displayed and retained.                                                                             |
| TC-H-06 | Generate with no ingredients selected                                      | Submission is blocked and a validation message is shown.                                                                  |
| TC-H-07 | Generate with ingredients and filters                                      | User is taken to the Recipe List page.                                                                                    |
| TC-H-08 | Sign in and create a custom product                                        | The product is saved to the account and appears in its assigned ingredient category.                                      |
| TC-H-09 | Select a custom product and generate recipes                               | The product participates in local matching; unmatched product names do not cause a request to an external recipe service. |
| TC-H-10 | Remove a custom product while it is selected                               | The product is removed from the account and from the current ingredient selection.                                        |
| TC-H-11 | Open the header account avatar                                             | A bilingual account panel opens with profile details, custom-product management, and recent search history.               |
| TC-H-12 | Dismiss the account panel with Escape or outside click                     | The panel closes, and Escape returns focus to the avatar trigger.                                                         |
| TC-H-13 | Type an English or Ukrainian common ingredient in the custom-product field | Matching localized suggestions appear; selecting one fills its name and category.                                         |
| TC-H-14 | Navigate custom-product suggestions with arrow keys and Enter              | The active suggestion is visibly highlighted and selection fills its name and category.                                   |
| TC-H-15 | Enter a name absent from the suggestion dictionary                         | Free-text product entry remains available; clicking outside the field closes the suggestions.                             |
| TC-H-16 | Select “Strawberries” or “Полуниця” in the suggestion list                 | Name and category update to the active language; category is “Fruits & Berries” / “Фрукти та ягоди.”                      |
| TC-H-17 | Switch the app language while using the custom-product form                | Suggestion labels, category options, field labels, and Add button use the newly selected language.                        |

## Recipe List

| ID      | Steps                                                | Expected                                                                             |
| ------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| TC-L-01 | Generate recipes with common ingredients             | Matching recipes are displayed with names, times, difficulty, and match percentages. |
| TC-L-02 | Compare recipes with different match levels          | Recipes with the highest match percentage appear first.                              |
| TC-L-03 | Search with ingredients that partially match recipes | Partial matches are displayed.                                                       |
| TC-L-04 | Inspect a partial-match result                       | Missing ingredients are clearly identified.                                          |
| TC-L-05 | Apply each dietary filter                            | Only compatible recipes remain visible.                                              |
| TC-L-06 | Apply each preparation-time limit                    | Recipes exceeding the selected limit are excluded.                                   |
| TC-L-07 | Use filters that produce no results                  | A clear empty state explains that the search can be adjusted.                        |
| TC-L-08 | Open a recipe card                                   | The corresponding Recipe Details page opens.                                         |
| TC-L-09 | Return to Home from the list                         | Selected ingredients and filters are retained.                                       |

## Recipe Details

| ID      | Steps                       | Expected                                                                         |
| ------- | --------------------------- | -------------------------------------------------------------------------------- |
| TC-D-01 | Open a recipe from the list | Name, image, times, difficulty, tags, and fixed servings are shown.              |
| TC-D-02 | Review the ingredient list  | Quantities are shown and available versus missing ingredients are distinguished. |
| TC-D-03 | Review preparation steps    | Complete instructions are shown in the correct order.                            |
| TC-D-04 | Look for serving controls   | No serving-size adjustment control is available.                                 |
| TC-D-05 | Return to the Recipe List   | The prior search, filters, and result context are retained.                      |
| TC-D-06 | Open an invalid recipe id   | A not-found state and return action are shown.                                   |

## State and Persistence

| ID      | Steps                                                          | Expected                                                                                                   |
| ------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| TC-S-01 | Select ingredients and filters, then navigate across all pages | Selection and filters remain unchanged.                                                                    |
| TC-S-02 | Refresh during an active search in the same browser session    | Selection, filters, current page, selected recipe, and language are restored from `sessionStorage`.        |
| TC-S-03 | Use Reset or New Search                                        | Previous ingredients and filters are cleared or replaced.                                                  |
| TC-S-04 | Close and reopen a browser session while signed in             | The session cookie restores the account until its expiry; browser search selection remains session-scoped. |
| TC-S-05 | Sign out and attempt to reuse the prior session cookie         | The cookie is cleared and the server rejects the revoked session.                                          |
| TC-S-06 | Access products or history without signing in                  | API returns 401 and does not disclose user data.                                                           |
| TC-S-07 | Attempt to read or delete another user's product/history       | No records belonging to another user are returned, modified, or deleted.                                   |

## Accounts and API

| ID          | Steps                                                                           | Expected                                                                                   |
| ----------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| TC-AUTH-01  | Register with a valid email and password of at least 12 characters              | Account is created and authenticated with an HttpOnly session cookie.                      |
| TC-AUTH-02  | Register with a duplicate email or invalid/short password                       | A safe 4xx validation error is shown; no account is created.                               |
| TC-AUTH-03  | Sign in with an incorrect password                                              | A generic authentication error is shown and no session is created.                         |
| TC-AUTH-04  | Inspect the database after registration                                         | Password is stored as a bcrypt hash; session table contains only a SHA-256 token hash.     |
| TC-AUTH-05  | Exceed the authentication rate limit                                            | Further registration/login attempts are temporarily rejected.                              |
| TC-AUTH-06  | Submit a state-changing request from an unexpected Origin                       | API rejects the request.                                                                   |
| TC-API-01   | Add a custom product using an unknown category                                  | API rejects it with a validation error.                                                    |
| TC-API-02   | Create two custom products with case-insensitively identical names for one user | The duplicate is rejected.                                                                 |
| TC-API-03   | Save a search while authenticated, then view recent searches                    | Stored ingredient names and local match count are returned only to the owner.              |
| TC-API-04   | Run the frontend without the API server                                         | Local recipe matching remains usable; account actions show a recoverable error.            |
| TC-API-05   | Delete a user with related products, history, and sessions                      | Related rows are deleted through cascade relations.                                        |
| TC-API-06   | Record more than 50 searches for one user                                       | Only the 50 newest search records remain in SQLite and are returned by the API.            |
| TC-API-07   | Create, list, and delete a meal-plan entry                                      | Valid recipe/date/meal-type data is stored and the owner can remove the entry.             |
| TC-API-08   | Read or delete another user's meal-plan entry                                   | No meal-plan data is returned and the other user's entry cannot be deleted.                |
| TC-API-09   | Submit an invalid meal-plan date or meal type                                   | The API returns a validation error and creates no entry.                                   |
| TC-MATCH-01 | Select a custom product whose name is a localized catalog ingredient            | The product normalizes to the same canonical ingredient and contributes to recipe matches. |
| TC-MATCH-02 | Select a custom product with a recipe-matching name in different casing         | Normalization matches the recipe ingredient and includes it in available ingredients.      |

## Dataset and Resilience

| ID         | Steps                                                                | Expected                                                                                                                                           |
| ---------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-DATA-01 | Inspect the local dataset                                            | The current TypeScript dataset contains 72 recipes; every record follows the shared schema and includes complete EN/UA content and detailed steps. |
| TC-DATA-02 | Load the app without network access                                  | Recipe data remains available from the local dataset.                                                                                              |
| TC-DATA-03 | Simulate a remote recipe image failure                               | The configured fallback image is shown without a broken-image icon.                                                                                |
| TC-DATA-04 | Inspect every selectable ingredient across all eight category panels | Each option has one category and bilingual labels; no option is missing or duplicated.                                                             |

## Accessibility and Responsive Behavior

| ID      | Steps                                               | Expected                                                                                      |
| ------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| TC-A-01 | Navigate controls using only the keyboard           | All controls are reachable and have visible focus.                                            |
| TC-A-02 | Inspect ingredient, filter, and navigation controls | Accessible labels and states are available.                                                   |
| TC-A-03 | Use the app on a mobile viewport                    | Ingredient controls, filters, recipe cards, and instructions remain readable without overlap. |
| TC-A-04 | Inspect recipe images and status indicators         | Images have meaningful alternative text and status is not conveyed by color alone.            |
