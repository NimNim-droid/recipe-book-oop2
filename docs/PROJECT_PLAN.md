# 🍳 Modern Culinary Recipe Book — Architecture & Execution Blueprint

An Object-Oriented, decoupled web application built for an **OOP2 Finals Project**.
* **Backend:** Laravel 11 (REST API, Strict MVC, Eloquent ORM, DB Transactions, API Resources)
* **Frontend:** React 18 + Vite (Editorial Culinary UI, Non-Generic Aesthetic, Accessible & Interactive)
* **Database:** MySQL via XAMPP (Local/Offline presentation safety) or Neon Cloud PostgreSQL
* **Documentation:** Architecture diagrams, ERD, and OOP Defense cheat-sheet for defense day.

---

## 1. Project Directory Structure

```text
recipe-book/
├── backend/                               # Laravel REST API (Strict MVC)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       └── RecipeController.php   # [C] Orchestrator, validation, transactions
│   │   │   └── Resources/
│   │   │       ├── RecipeResource.php         # Clean API JSON formatting
│   │   │       ├── IngredientResource.php
│   │   │       └── StepResource.php
│   │   └── Models/
│   │       ├── Recipe.php                     # [M] Eloquent Model (hasMany ingredients, steps)
│   │       ├── Ingredient.php                 # [M] Eloquent Model (belongsTo Recipe)
│   │       └── Step.php                       # [M] Eloquent Model (belongsTo Recipe)
│   ├── config/
│   │   └── cors.php                           # CORS allowed for Vite frontend (localhost:5173)
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 0001_01_01_000000_create_recipes_table.php
│   │   │   ├── 0001_01_01_000001_create_ingredients_table.php
│   │   │   └── 0001_01_01_000002_create_steps_table.php
│   │   └── seeders/
│   │       └── RecipeSeeder.php               # Realistic gourmet sample recipes
│   ├── routes/
│   │   └── api.php                            # RESTful endpoints (Route::apiResource)
│   └── .env                                   # Database config (MySQL / Neon)
│
├── frontend/                              # React + Vite (The [V] - Presentation Layer)
│   ├── src/
│   │   ├── assets/                            # Brand assets, custom culinary SVG icons
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx                 # Editorial header with quick search & new recipe CTA
│   │   │   │   └── Footer.jsx
│   │   │   ├── recipe/
│   │   │   │   ├── RecipeCard.jsx             # Gourmet card with cook time badge, tags, hover elevation
│   │   │   │   ├── IngredientList.jsx         # Interactive checklist (cross out items while cooking)
│   │   │   │   ├── StepList.jsx               # Numbered step cards with active step tracker
│   │   │   │   └── ServingScaler.jsx          # Interactive servings counter that scales ingredient amounts
│   │   │   └── ui/
│   │   │       ├── Button.jsx                 # Tactile, pill & rounded button states
│   │   │       ├── Input.jsx                  # Floating label / crisp bordered inputs
│   │   │       └── Badge.jsx                  # Time, difficulty, & category pills
│   │   ├── pages/
│   │   │   ├── Home.jsx                       # Editorial hero + featured recipes + category filters
│   │   │   ├── RecipeList.jsx                 # Grid view with live search & multi-tag filtering
│   │   │   ├── RecipeDetails.jsx              # Two-column culinary layout (Checklist + Instructions)
│   │   │   ├── AddRecipe.jsx                  # Dynamic form (add/remove ingredients & steps)
│   │   │   └── EditRecipe.jsx                 # Pre-populated edit view
│   │   ├── services/
│   │   │   └── api.js                         # Centralized Axios instance with error handling
│   │   ├── styles/
│   │   │   └── index.css                      # Custom theme tokens (warm palette, serif typography)
│   │   ├── App.jsx                            # React Router configuration
│   │   └── main.jsx
│   ├── index.html                             # Google Fonts (Fraunces/Playfair + Plus Jakarta Sans)
│   └── package.json
│
└── docs/                                  # Finals Submission Material
    ├── PROJECT_PLAN.md                        # This roadmap & architecture specification
    ├── ERD.png                                # Entity Relationship Diagram
    ├── wireframes/                            # UI Wireframes & Layout sketches
    └── defense_notes.md                       # Q&A guide explaining MVC & OOP concepts to instructor
```

---

## 2. Strict MVC Mapping (For Your OOP2 Defense)

When your instructor asks: *"How is this MVC if you're using React?"*, this is your structured response:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DECOUPLED MVC ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ VIEW ]              [ CONTROLLER ]                  [ MODEL ]            │
│  React 18 (Vite)       Laravel RecipeController        Eloquent ORM         │
│  frontend/src/         backend/app/Http/Controllers/   backend/app/Models/  │
│                                                                             │
│  ┌──────────────┐      ┌─────────────────────────┐     ┌──────────────────┐ │
│  │ UI Pages &   │◄────►│ Validates HTTP Request  │◄───►│ Recipe.php       │ │
│  │ Components   │ JSON │ Dispatches DB Transact. │ SQL │ Ingredient.php   │ │
│  │ State / DOM  │ REST │ Formats via Resources   │     │ Step.php         │ │
│  └──────────────┘      └─────────────────────────┘     └──────────────────┘ │
│                                                                  ▲          │
│                                                                  │          │
│                                                        ┌─────────┴────────┐ │
│                                                        │ MySQL / Neon DB  │ │
│                                                        └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Model (`M`) – `backend/app/Models/`**:
   * **Encapsulation**: Models safeguard database interactions (`$fillable` properties prevent mass-assignment vulnerabilities).
   * **OOP Association (1-to-Many Relationships)**:
     * `Recipe hasMany Ingredient` (`$recipe->ingredients`)
     * `Recipe hasMany Step` (`$recipe->steps`)
     * `Ingredient belongsTo Recipe` (`$ingredient->recipe`)
     * `Step belongsTo Recipe` (`$step->recipe`)
   * **Cascading Integrity**: When a recipe is deleted, child records are automatically cascaded.

2. **Controller (`C`) – `backend/app/Http/Controllers/Api/RecipeController.php`**:
   * Acts as the business logic orchestrator.
   * Validates incoming data shapes (`StoreRecipeRequest`).
   * Executes atomic writes via `DB::transaction()`: guarantees that if creating a step fails, the parent recipe isn't left as an orphan.
   * Transforms raw SQL data into standardized JSON contracts using `RecipeResource`.

3. **View (`V`) – `frontend/src/`**:
   * React is the modern presentation layer (Headless View). It consumes the API contracts, maintains UI state, and handles rendering without polluting the backend with presentation templates.

---

## 3. High-End Editorial UI Design System ("No AI Flop")

### ❌ What We Are Avoiding ("The AI Flop Look"):
* Generic indigo/purple gradients (`from-indigo-600 to-purple-600`).
* Clunky default glassmorphism with harsh white borders and excessive blur.
* Monotonous centered cards with no hierarchy.
* Robotic placeholder icons and plain system fonts.
* Static lists that don't consider real kitchen behavior (e.g. no way to mark ingredients off as you cook).

### ✨ What We Are Building: "The Modern Kitchen Journal"
An editorial, tactile, human-crafted design inspired by *NYT Cooking*, *Bon Appétit*, and *Kinfolk*.

#### A. Color Palette
* **Warm Canvas (Background):** `#FDFBF7` (Soft Linen Cream) & `#F4EFE6` (Warm Oat secondary). No stark `#FFFFFF` glare.
* **Charred Ink (Text & Headings):** `#1E1B18` (Deep Charcoal Espresso, readable & sophisticated).
* **Primary Warmth (Accents & Buttons):** `#D95338` (Rustic Terracotta) and `#C4452C` (Deep Paprika hover).
* **Herb Green (Tags & Checkmarks):** `#2D5A27` (Rosemary Sage) for dietary tags, successful checkmarks, and freshness cues.
* **Warm Amber (Times & Ratings):** `#E08A1E` (Honey Amber) for cook time badges and difficulty stars.
* **Dividers & Borders:** `#E7E1D5` (Soft stone borders with subtle 1px line definition).

#### B. Typography Hierarchy
* **Headings & Display:** `Playfair Display` or `Fraunces` (Google Serif Font) — gives an authentic, high-end cookbook feel.
* **Interface & Body:** `Plus Jakarta Sans` or `Outfit` (Clean, legible, modern geometric sans-serif for numbers, measurements, and steps).

#### C. Tactile UI Components Built for Real Cooking
1. **Interactive Ingredient Checklist**: Users can click or tap an ingredient to cross it off with an animated strike-through while cooking.
2. **Dynamic Servings Scaler**: A `[ - 4 Servings + ]` interactive toggle on the recipe page that dynamically calculates ingredient quantities in real-time.
3. **Step-by-Step Cooking Mode**: Numbered circular badges (`01`, `02`, `03`) that highlight the active step as the cook progresses.
4. **Editorial Recipe Cards**:
   * Clean 4:3 food imagery with subtle zoom on hover.
   * Floating metadata tags: Prep Time (`⏱ 15m`), Cook Time (`🔥 30m`), Difficulty (`Easy / Med / Chef`).
   * Clean typography with teaser descriptions that truncate gracefully.
5. **Interactive Dynamic Form**:
   * Add/Remove ingredients with separate inputs for **Amount** (e.g., `2`), **Unit** (e.g., `cups`), and **Ingredient** (e.g., `Almond Flour`).
   * Add/Remove steps with auto-numbering and re-order capability.
   * Live image URL preview so the user instantly sees what their card will look like.

---

## 4. Database Schema

### Table: `recipes`
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | Primary Key, Auto Increment | Unique recipe ID |
| `title` | `varchar(255)` | Not Null | Recipe title (e.g., "Artisan Sourdough") |
| `description` | `text` | Nullable | Brief culinary introduction or story |
| `prep_time` | `int` | Nullable | Preparation time in minutes |
| `cook_time` | `int` | Nullable | Cooking time in minutes |
| `servings` | `int` | Default: 4 | Base yield / serving count |
| `difficulty` | `enum` | Easy, Medium, Hard | Difficulty tier |
| `category` | `varchar(100)`| Nullable | Breakfast, Lunch, Dinner, Dessert, etc. |
| `image_url` | `text` | Nullable | Food photo URL or local asset path |
| `created_at` | `timestamp` | Current timestamp | Creation timestamp |
| `updated_at` | `timestamp` | Current timestamp | Last updated timestamp |

### Table: `ingredients`
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | Primary Key, Auto Increment | Unique ingredient item ID |
| `recipe_id` | `bigint` | Foreign Key &rarr; `recipes.id` | Cascades on delete (`onDelete('cascade')`) |
| `name` | `varchar(255)` | Not Null | Ingredient name (e.g., "Fresh Rosemary") |
| `amount` | `decimal(8,2)` | Nullable | Numeric amount for serving calculations (e.g., `2.5`) |
| `unit` | `varchar(50)` | Nullable | Measurement unit (e.g., `tbsp`, `g`, `cups`, `cloves`) |

### Table: `steps`
| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | Primary Key, Auto Increment | Unique step ID |
| `recipe_id` | `bigint` | Foreign Key &rarr; `recipes.id` | Cascades on delete (`onDelete('cascade')`) |
| `step_number` | `int` | Not Null | Sequential order (1, 2, 3...) |
| `instruction` | `text` | Not Null | Clear cooking directions |

---

## 5. RESTful API Contract

| Method | Endpoint | Controller Method | Payload / Action |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/recipes` | `RecipeController@index` | Fetch all recipes with optional query filters (`?category=Dinner&search=pasta`) |
| **GET** | `/api/recipes/{id}` | `RecipeController@show` | Fetch single recipe with eager-loaded `ingredients` and `steps` |
| **POST** | `/api/recipes` | `RecipeController@store` | Create recipe, insert ingredients and steps in a `DB::transaction` |
| **PUT** | `/api/recipes/{id}` | `RecipeController@update` | Update recipe attributes and synchronize ingredients/steps |
| **DELETE**| `/api/recipes/{id}` | `RecipeController@destroy`| Delete recipe (cascades all related ingredients & steps) |

---

## 6. Execution Roadmap (Step-by-Step)

### Phase 1: Environment & Backend Foundation (Laravel)
1. **Initialize Project Skeleton**:
   * Create `backend/` and `frontend/` folders.
   * Generate clean Laravel 11 project inside `backend/`.
2. **Database Connection Setup**:
   * Configure `.env` for local MySQL (XAMPP `127.0.0.1:3306`, user `root`, no password) or Neon credentials.
   * Configure CORS in `config/cors.php` to accept `http://localhost:5173`.
3. **Migrations & Seeders**:
   * Create migrations for `recipes`, `ingredients`, and `steps` with foreign keys and cascading deletes.
   * Build `RecipeSeeder.php` with 4–5 mouth-watering sample recipes (e.g., *Creamy Tuscan Garlic Chicken*, *Authentic Neapolitan Pizza Dough*, *Classic French Lemon Tart*) with real images and structured steps.
   * Execute `php artisan migrate --seed`.

### Phase 2: Eloquent Models & API Controllers
1. **Build Models**:
   * `Recipe.php`, `Ingredient.php`, `Step.php` with relationships (`hasMany`, `belongsTo`) and `$fillable`.
2. **Build API Resources**:
   * `RecipeResource`, `IngredientResource`, `StepResource` to return clean JSON envelopes.
3. **Build `RecipeController`**:
   * Implement `index()`, `show()`, `store()`, `update()`, and `destroy()` with `DB::transaction()`.
   * Test all endpoints via automated cURL / PowerShell tests.

### Phase 3: Frontend Setup & Editorial Design System (React + Vite)
1. **Initialize Vite App**:
   * Create React application with modern tooling.
   * Install `axios`, `react-router-dom`, `lucide-react` (clean, minimalist SVG icons).
2. **Craft the Theme & Design System**:
   * Set up `index.css` with CSS variables: warm linen backgrounds, terracotta buttons, playfair display typography, and smooth micro-interactions.
3. **Build Core Reusable Components**:
   * `Navbar` (brand logo, search bar, "+ New Recipe" button).
   * `RecipeCard` (image, tags, cook time, smooth hover lift).
   * `ServingScaler` (interactive portions calculator).
   * `IngredientList` (checklist with strike-through animations).
   * `StepList` (numbered recipe guide with active step highlights).

### Phase 4: Pages & User Flows
1. **Home / Recipe Feed (`Home.jsx` & `RecipeList.jsx`)**:
   * Hero banner with culinary tagline.
   * Category filter chips (`All`, `Quick < 30m`, `Pasta`, `Baking`, `Vegetarian`).
   * Live search by title or ingredient.
   * Responsive recipe card grid.
2. **Recipe Details (`RecipeDetails.jsx`)**:
   * Editorial hero with large photo, badges, and quick stats (Prep, Cook, Servings, Difficulty).
   * Two-column split layout: Left = interactive ingredients checklist; Right = step-by-step instructions.
   * Edit and Delete action buttons with confirmation modals.
3. **Add & Edit Recipe (`AddRecipe.jsx` & `EditRecipe.jsx`)**:
   * Multi-section form: Title, description, times, category, photo URL with live thumbnail.
   * Dynamic Ingredients List: `+ Add Ingredient` button, customizable amount, unit, and name.
   * Dynamic Steps List: `+ Add Step` button, drag/re-order or auto-numbered list.
   * Full client-side validation and friendly error messages.

### Phase 5: Verification & Finals Submission Materials
1. **Full Integration Testing**: Verify create, read, update, delete cycle end-to-end.
2. **Submission Materials in `docs/`**:
   * Export database diagram to `docs/ERD.png`.
   * Export SQL dump to `docs/recipe_book.sql` for offline grading.
   * Create `docs/defense_notes.md` with anticipated teacher questions on OOP and MVC.
