import React, { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function StepList({ steps = [] }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (stepNumber) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  };

  const sortedSteps = [...steps].sort((a, b) => (a.step_number || 0) - (b.step_number || 0));

  return (
    <section className="steps-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2>Method & Instructions</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {steps.length} {steps.length === 1 ? 'Step' : 'Steps'}
        </span>
      </div>

      {sortedSteps.length === 0 ? (
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No instructions provided for this recipe.
        </p>
      ) : (
        <div className="steps-wrapper">
          {sortedSteps.map((step, index) => {
            const stepNum = step.step_number || index + 1;
            const isCompleted = completedSteps.has(stepNum);

            return (
              <div
                key={step.id || index}
                className="step-card"
                style={{
                  opacity: isCompleted ? 0.7 : 1,
                  borderColor: isCompleted ? 'var(--sage)' : undefined,
                  cursor: 'pointer',
                }}
                onClick={() => toggleStep(stepNum)}
              >
                <div
                  className="step-number-badge"
                  style={{
                    backgroundColor: isCompleted ? 'var(--sage)' : undefined,
                    color: isCompleted ? '#ffffff' : undefined,
                    borderColor: isCompleted ? 'var(--sage)' : undefined,
                  }}
                  title="Click to toggle step completion"
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : stepNum}
                </div>

                <div className="step-content">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: isCompleted ? 'var(--sage)' : 'var(--text-dim)',
                      }}
                    >
                      Step {stepNum} {isCompleted ? '• Completed' : ''}
                    </span>
                  </div>

                  <p
                    className="step-instruction"
                    style={{
                      textDecoration: isCompleted ? 'line-through' : 'none',
                    }}
                  >
                    {step.instruction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
