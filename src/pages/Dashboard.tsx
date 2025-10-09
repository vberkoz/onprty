// src/pages/Dashboard.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Assuming a better 'User' object with full claims from the context
  const displayName = user?.given_name || user?.email || 'User';

  return (
    <div className="app-screen dashboard-screen">
      <h1>👋 Welcome, {displayName}!</h1>
      <p>This is your protected application dashboard. You are successfully authenticated.</p>
      
      <nav style={{ margin: '20px 0' }}>
        <Link to="/profile" style={{ marginRight: '15px' }}>View Profile</Link>
        <Link to="/settings">Settings (Placeholder)</Link>
      </nav>

      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;