import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Flame, Users } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

export default function RecipeCard({ recipe }) {
  const difficultyClass = {
    Easy: 'pill-easy',
    Medium: 'pill-medium',
    Hard: 'pill-hard',
  }[recipe.difficulty || 'Medium'] || 'pill-medium';

  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe.id}`} className="card-image-wrap">
        <img
          src={recipe.image_url || FALLBACK_IMAGE}
          alt={recipe.title}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {recipe.category && (
          <span className="card-category-pill">{recipe.category}</span>
        )}
        <span className={`card-difficulty-pill ${difficultyClass}`}>
          {recipe.difficulty || 'Medium'}
        </span>
      </Link>

      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
        </h3>
        
        <p className="card-desc">
          {recipe.description || 'A delicious handcrafted recipe.'}
        </p>

        <div className="card-meta">
          <div className="meta-item" title="Prep time">
            <Clock size={15} color="var(--primary)" />
            <span>{recipe.prep_time || 0}m prep</span>
          </div>

          <div className="meta-item" title="Cook time">
            <Flame size={15} color="var(--amber)" />
            <span>{recipe.cook_time || 0}m cook</span>
          </div>

          <div className="meta-item" title="Servings">
            <Users size={15} color="var(--sage)" />
            <span>{recipe.servings || 4} serv</span>
          </div>
        </div>
      </div>
    </article>
  );
}
