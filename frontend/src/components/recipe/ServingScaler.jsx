import React from 'react';
import { Minus, Plus, Users } from 'lucide-react';

export default function ServingScaler({ servings, onServingsChange }) {
  const handleDecrement = () => {
    if (servings > 1) {
      onServingsChange(servings - 1);
    }
  };

  const handleIncrement = () => {
    if (servings < 24) {
      onServingsChange(servings + 1);
    }
  };

  return (
    <div className="serving-scaler" title="Adjust recipe yield in real time">
      <Users size={16} color="var(--primary)" style={{ marginLeft: '4px' }} />
      <button
        type="button"
        className="scaler-btn"
        onClick={handleDecrement}
        disabled={servings <= 1}
        aria-label="Decrease portions"
      >
        <Minus size={14} />
      </button>

      <span className="scaler-count">{servings} Servings</span>

      <button
        type="button"
        className="scaler-btn"
        onClick={handleIncrement}
        disabled={servings >= 24}
        aria-label="Increase portions"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
