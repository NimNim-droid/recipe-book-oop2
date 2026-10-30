import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function IngredientList({ ingredients = [], servings = 4, baseServings = 4 }) {
  const [checkedIds, setCheckedIds] = useState(new Set());

  const toggleCheck = (id) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scaleAmount = (amount) => {
    if (amount === null || amount === undefined) return '';
    const str = String(amount).trim();
    if (!str) return '';

    // Handle fractions like "1/2" or "3/4"
    let numeric = Number(str);
    if (isNaN(numeric) && str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && Number(parts[1]) !== 0) {
        numeric = Number(parts[0]) / Number(parts[1]);
      }
    }

    if (isNaN(numeric)) {
      return str;
    }

    const ratio = (servings || 4) / (baseServings || 4);
    const scaled = numeric * ratio;

    if (Number.isInteger(scaled)) return scaled.toString();
    const formatted = scaled.toFixed(2);
    return formatted.replace(/\.?0+$/, '');
  };

  const checkedCount = checkedIds.size;
  const totalCount = ingredients.length;

  return (
    <aside className="ingredients-card">
      <div className="ingredients-title">
        <span>Ingredients</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {totalCount > 0 ? `${checkedCount}/${totalCount} checked` : ''}
        </span>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
        Tap an item to cross off while cooking:
      </p>

      {ingredients.length === 0 ? (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No ingredients listed for this recipe.
        </p>
      ) : (
        <ul style={{ listStyle: 'none' }}>
          {ingredients.map((ing, index) => {
            const ingId = ing.id || index;
            const isChecked = checkedIds.has(ingId);
            const scaledAmount = scaleAmount(ing.amount);

            return (
              <li
                key={ingId}
                className={`ingredient-item ${isChecked ? 'checked' : ''}`}
                onClick={() => toggleCheck(ingId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleCheck(ingId);
                  }
                }}
              >
                <div className="ingredient-checkbox">
                  {isChecked && <Check size={13} strokeWidth={3} />}
                </div>
                <div className="ingredient-text">
                  {scaledAmount && (
                    <span className="ingredient-amount">{scaledAmount}</span>
                  )}
                  {ing.unit && (
                    <span style={{ color: 'var(--text-muted)', marginRight: '0.35rem' }}>
                      {ing.unit}
                    </span>
                  )}
                  <span>{ing.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
