// src/pages/AuthCallback.tsx

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const { processAuthRedirect } = useAuth();

  useEffect(() => {
    // Process the hash fragment from Cognito's OAuth redirect
    if (window.location.hash) {
      processAuthRedirect(window.location.hash);
    }
  }, [processAuthRedirect]);

  return (
    <div className="auth-callback-screen">
      <h2>Processing authentication...</h2>
      <p>Please wait while we complete your sign-in.</p>
    </div>
  );
};

export default AuthCallback;
