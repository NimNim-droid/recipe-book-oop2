# 🍳 Modern Culinary Recipe Book

An Object-Oriented, decoupled web application built for an **OOP2 Finals Project**.

## 🏗️ Architecture: Decoupled MVC
- **Backend (Model & Controller):** Laravel 11 REST API with Strict MVC, Eloquent ORM, Database Transactions, and API Resources.
- **Frontend (Headless View):** React 18 + Vite with an editorial culinary design system (Warm linen, Terracotta accents, Playfair Display typography).
- **Database:** SQLite (default for development/portable grading) / MySQL.

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
│                                                        │   SQLite / DB    │ │
│                                                        └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Setup & Run

### 1. Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```
Backend runs at `http://localhost:8000`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## 📚 Documentation
- [Project Plan & Architecture Blueprint](docs/PROJECT_PLAN.md)
- [OOP & MVC Defense Notes](docs/defense_notes.md)
