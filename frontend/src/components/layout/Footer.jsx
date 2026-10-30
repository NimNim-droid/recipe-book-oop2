import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>
          <UtensilsCrossed size={18} color="var(--primary)" />
          <span>Savoria — Object-Oriented Culinary Management</span>
        </div>
        <p style={{ maxWidth: '500px', fontSize: '0.85rem' }}>
          Decoupled Full-Stack Architecture powered by Laravel 11 REST API &amp; React 18 View. Built for OOP2 Finals.
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          &copy; {new Date().getFullYear()} Savoria. Designed for thoughtful cooks and clean architecture.
        </p>
      </div>
    </footer>
  );
}
