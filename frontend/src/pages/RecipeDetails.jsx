import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, ChefHat, Edit3, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import ServingScaler from '../components/recipe/ServingScaler';
import IngredientList from '../components/recipe/IngredientList';
import StepList from '../components/recipe/StepList';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=85';

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(4);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.get(`/recipes/${id}`)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data || res.data;
        setRecipe(data);
        setServings(data.servings || 4);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load recipe details:', err);
        setError('Recipe could not be found or has been removed.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/recipes/${id}`);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      alert('Failed to delete recipe. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        <RefreshCw size={36} className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Plating recipe details...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="empty-state">
          <AlertCircle size={44} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3>Recipe Not Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem', maxWidth: '400px' }}>
            {error || 'This recipe does not exist or may have been deleted.'}
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to All Recipes</span>
          </Link>
        </div>
      </div>
    );
  }

  const difficultyClass = {
    Easy: 'pill-easy',
    Medium: 'pill-medium',
    Hard: 'pill-hard',
  }[recipe.difficulty || 'Medium'] || 'pill-medium';

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
      {/* Navigation and Actions Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Recipes</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to={`/recipes/${id}/edit`} className="btn btn-secondary btn-sm">
            <Edit3 size={15} />
            <span>Edit Recipe</span>
          </Link>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(30, 27, 24, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              maxWidth: '440px',
              width: '100%',
              boxShadow: 'var(--shadow-lift)',
              border: '1px solid var(--border-light)',
            }}
          >
            <h3 style={{ marginBottom: '0.75rem', color: '#DC2626' }}>Delete This Recipe?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              Are you sure you want to delete <strong>"{recipe.title}"</strong>? This will cascade-delete all related ingredients and steps and cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Food Banner */}
      <div className="details-banner">
        <img
          src={recipe.image_url || FALLBACK_IMAGE}
          alt={recipe.title}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {recipe.category && (
          <span className="card-category-pill" style={{ top: '1.5rem', left: '1.5rem' }}>
            {recipe.category}
          </span>
        )}
        <span
          className={`card-difficulty-pill ${difficultyClass}`}
          style={{ top: '1.5rem', right: '1.5rem' }}
        >
          {recipe.difficulty || 'Medium'}
        </span>
      </div>

      {/* Header Info */}
      <div className="details-header">
        <h1 className="details-title">{recipe.title}</h1>
        {recipe.description && (
          <p className="details-desc">{recipe.description}</p>
        )}
      </div>

      {/* Key Stats and Portion Scaler Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Prep Time</span>
          <span className="stat-value">
            <Clock size={18} color="var(--primary)" />
            {recipe.prep_time || 0} mins
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Cook Time</span>
          <span className="stat-value">
            <Flame size={18} color="var(--amber)" />
            {recipe.cook_time || 0} mins
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Total Time</span>
          <span className="stat-value">
            <ChefHat size={18} color="var(--text-muted)" />
            {totalTime} mins
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Adjust Servings</span>
          <div style={{ marginTop: '0.15rem' }}>
            <ServingScaler
              servings={servings}
              onServingsChange={(newServings) => setServings(newServings)}
            />
          </div>
        </div>
      </div>

      {/* Two-Column Culinary Layout */}
      <div className="culinary-layout">
        {/* Left Column: Interactive Ingredient Checklist */}
        <IngredientList
          ingredients={recipe.ingredients || []}
          servings={servings}
          baseServings={recipe.servings || 4}
        />

        {/* Right Column: Step-by-Step Cooking Guide */}
        <StepList steps={recipe.steps || []} />
      </div>
    </div>
  );
}
