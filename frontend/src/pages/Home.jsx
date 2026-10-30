import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, ChefHat, Sparkles, RefreshCw } from 'lucide-react';
import api from '../services/api';
import RecipeCard from '../components/recipe/RecipeCard';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Baking', 'Vegetarian'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;

      const response = await api.get('/recipes', { params });
      // Laravel API Resource returns array inside { data: [...] } or direct array
      const list = response.data?.data || response.data || [];
      setRecipes(list);
    } catch (err) {
      console.error('Failed to load recipes:', err);
      setError('Could not connect to the recipe server. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  return (
    <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
      {/* Editorial Hero Section */}
      <section className="hero">
        <div className="hero-eyebrow">
          <ChefHat size={15} />
          <span>Object-Oriented Culinary Journal</span>
        </div>

        <h1 className="hero-title">
          Handcrafted Recipes, <em>Engineered</em> for Taste.
        </h1>

        <p className="hero-subtitle">
          Explore gourmet dishes, dynamically scale servings for your table, and cook with an interactive step-by-step kitchen guide.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/recipes/create" className="btn btn-primary btn-lg">
            <PlusCircle size={19} />
            <span>Create New Recipe</span>
          </Link>
          <a href="#browse-recipes" className="btn btn-secondary btn-lg">
            <span>Browse Recipes</span>
          </a>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div id="browse-recipes" className="filter-bar">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: '1 1 300px' }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search recipes by name, description, or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search recipes"
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                borderRadius: 'var(--radius-pill)',
                padding: '0.8rem 1.25rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
              aria-label="Filter by difficulty"
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="category-chips">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={36} className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>Fetching recipes from kitchen API...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Unable to Load Recipes</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            {error}
          </p>
          <button type="button" className="btn btn-secondary" onClick={fetchRecipes}>
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍳</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No Recipes Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            {searchTerm || selectedCategory !== 'All' || selectedDifficulty !== 'All'
              ? 'Try adjusting your search criteria or category filter to discover more dishes.'
              : 'Your recipe book is currently empty. Add your very first culinary creation!'}
          </p>
          <Link to="/recipes/create" className="btn btn-primary">
            <PlusCircle size={17} />
            <span>Add New Recipe</span>
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </span>
          </div>

          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
