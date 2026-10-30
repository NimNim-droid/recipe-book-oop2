import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, BookOpen, UtensilsCrossed } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <span className="brand-name">Savoria</span>
            <span className="brand-tag">Culinary Journal</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <BookOpen size={18} />
            <span>Recipes</span>
          </Link>

          <Link to="/recipes/create" className="btn btn-primary btn-sm">
            <PlusCircle size={17} />
            <span>New Recipe</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
