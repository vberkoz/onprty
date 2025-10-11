// src/components/AppNavbar.tsx

import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const AppNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  // Determine the display name for the user
  const displayName = user?.given_name || user?.email || 'User';

  if (!isAuthenticated) {
    return null; // Don't show the navbar if the user is not authenticated
  }

  return (
    <nav className="app-navbar">
      <div className="nav-logo">
        <Link to="/">**On Pretty**</Link>
      </div>
      
      <div className="nav-links">
        {/* Navigation Items */}
        <Link to="/" className="nav-item">Generate Site</Link>
        <Link to="/my-sites" className="nav-item">My Sites</Link>
      </div>
      
      <div className="nav-user-controls">
        <span className="user-greeting">Hello, {displayName}</span>
        <button onClick={logout} className="logout-button-small">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AppNavbar;