// src/pages/LoginPage.tsx

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const LoginPage: React.FC = () => {
  const { isAuthenticated, loginWithHostedUI } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      // Could redirect to a saved 'from' location from the state, but '/' is simple
      navigate('/', { replace: true }); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>OnPrty</h1>
        <p>AI-powered website generator</p>
        <button
          className="login-button"
          onClick={() => loginWithHostedUI('Google')}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;