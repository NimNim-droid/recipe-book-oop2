import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>
          <UtensilsCrossed size={18} color="var(--primary)" />
          <span>Savoria — Culinary Journal</span>
        </div>
        <p style={{ maxWidth: '500px', fontSize: '0.85rem' }}>
          Discover, create, and organize recipes your whole table will love — from quick weeknight dinners to weekend baking projects.
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          &copy; {new Date().getFullYear()} Savoria. Made for people who love to cook.
        </p>
      </div>
    </footer>
  );
}
