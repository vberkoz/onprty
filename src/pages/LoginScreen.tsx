// src/pages/LoginScreen.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { isAuthenticated, user, loginWithHostedUI, logout } = useAuth();

  // If authenticated, show the app content
  if (isAuthenticated) {
    return (
      <div className="app-screen">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Your session is active. You are viewing the protected content.</p>
        <p>Email: {user?.email}</p>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    );
  }

  // If not authenticated, show Google sign-in button
  return (
    <div className="login-screen">
      <h1>OnPRTY</h1>
      <p>Please sign in to continue</p>
      <button
        onClick={() => loginWithHostedUI('Google')}
        className="google-login-button"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginScreen;