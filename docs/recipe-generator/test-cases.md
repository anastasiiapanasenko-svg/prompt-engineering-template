# Recipe Generator - Test Cases

## Home / Ingredient Selection

| ID | Steps | Expected |
|----|-------|----------|
| TC-H-01 | Open the application | Home page shows the predefined ingredient list and filter controls. |
| TC-H-02 | Select multiple predefined ingredients | Selected ingredients are visible and removable. |
| TC-H-03 | Attempt to enter an ingredient not in the predefined list | Custom ingredient entry is unavailable or rejected. |
| TC-H-04 | Select Vegetarian, Vegan, and Gluten-Free filters | Each selected filter shows an active state. |
| TC-H-05 | Select each preparation-time option | The selected limit is displayed and retained. |
| TC-H-06 | Generate with no ingredients selected | Submission is blocked and a validation message is shown. |
| TC-H-07 | Generate with ingredients and filters | User is taken to the Recipe List page. |

## Recipe List

| ID | Steps | Expected |
|----|-------|----------|
| TC-L-01 | Generate recipes with common ingredients | Matching recipes are displayed with names, times, difficulty, and match percentages. |
| TC-L-02 | Compare recipes with different match levels | Recipes with the highest match percentage appear first. |
| TC-L-03 | Search with ingredients that partially match recipes | Partial matches are displayed. |
| TC-L-04 | Inspect a partial-match result | Missing ingredients are clearly identified. |
| TC-L-05 | Apply each dietary filter | Only compatible recipes remain visible. |
| TC-L-06 | Apply each preparation-time limit | Recipes exceeding the selected limit are excluded. |
| TC-L-07 | Use filters that produce no results | A clear empty state explains that the search can be adjusted. |
| TC-L-08 | Open a recipe card | The corresponding Recipe Details page opens. |
| TC-L-09 | Return to Home from the list | Selected ingredients and filters are retained. |

## Recipe Details

| ID | Steps | Expected |
|----|-------|----------|
| TC-D-01 | Open a recipe from the list | Name, image, times, difficulty, tags, and fixed servings are shown. |
| TC-D-02 | Review the ingredient list | Quantities are shown and available versus missing ingredients are distinguished. |
| TC-D-03 | Review preparation steps | Complete instructions are shown in the correct order. |
| TC-D-04 | Look for serving controls | No serving-size adjustment control is available. |
| TC-D-05 | Return to the Recipe List | The prior search, filters, and result context are retained. |
| TC-D-06 | Open an invalid recipe id | A not-found state and return action are shown. |

## State and Persistence

| ID | Steps | Expected |
|----|-------|----------|
| TC-S-01 | Select ingredients and filters, then navigate across all pages | Selection and filters remain unchanged. |
| TC-S-02 | Refresh during an active search | Session state is restored when `localStorage` persistence is enabled. |
| TC-S-03 | Use Reset or New Search | Previous ingredients and filters are cleared or replaced. |
| TC-S-04 | Close and reopen a new browser session | No account or long-term user profile data is required. |

## Dataset and Resilience

| ID | Steps | Expected |
|----|-------|----------|
| TC-DATA-01 | Inspect the local dataset | It contains 10-15 recipes with required metadata and detailed steps. |
| TC-DATA-02 | Load the app without network access | Recipe data remains available from the local dataset. |
| TC-DATA-03 | Simulate dataset initialization failure | A clear recoverable error state is shown. |

## Accessibility and Responsive Behavior

| ID | Steps | Expected |
|----|-------|----------|
| TC-A-01 | Navigate controls using only the keyboard | All controls are reachable and have visible focus. |
| TC-A-02 | Inspect ingredient, filter, and navigation controls | Accessible labels and states are available. |
| TC-A-03 | Use the app on a mobile viewport | Ingredient controls, filters, recipe cards, and instructions remain readable without overlap. |
| TC-A-04 | Inspect recipe images and status indicators | Images have meaningful alternative text and status is not conveyed by color alone. |
