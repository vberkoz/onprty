// src/pages/LoginScreen.tsx

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const LoginScreen: React.FC = () => {
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
      <h1>On Pretty - Secure App</h1>
      <p>Please sign in to access your dashboard.</p>
      <button
        onClick={() => loginWithHostedUI('Google')}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginScreen;