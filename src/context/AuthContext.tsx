// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const USER_POOL_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI;
const LOGOUT_URI = import.meta.env.VITE_COGNITO_LOGOUT_URI;

interface AuthTokens {
  idToken: string;
  accessToken: string;
  expiresAt: number;
}

export interface User {
  email?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: string | number | boolean | undefined;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithHostedUI: (provider?: 'Google') => void;
  logout: () => void;
  processAuthRedirect: (hash: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- JWT HELPER FUNCTION ---
// Utility to decode the base64 part of a JWT (without validation for simplicity here)
const decodeJwt = (token: string): { email: string; name?: string; 'cognito:username'?: string } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return { email: '', name: undefined, 'cognito:username': undefined };
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Load tokens from storage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('cognitoTokens');
    if (storedTokens) {
      const parsedTokens: AuthTokens = JSON.parse(storedTokens);
      if (parsedTokens.expiresAt > Date.now()) {
        setTokens(parsedTokens);
        const payload = decodeJwt(parsedTokens.idToken);
        setUser({ email: payload.email, name: payload.name || payload['cognito:username'] || '' });
      } else {
        localStorage.removeItem('cognitoTokens'); // Token expired
      }
    }
  }, []);

  // --- 1. Initiate Login (Redirect to Hosted UI) ---
  const loginWithHostedUI = useCallback((provider?: 'Google') => {
    const providerParam = provider ? `&identity_provider=${provider}` : '';
    
    // Authorization Code Grant Flow (more secure) or Implicit Grant Flow (simpler to implement)
    // We use 'token' (Implicit Grant) as requested for minimal setup without a backend
    const authUrl = `${COGNITO_DOMAIN}/oauth2/authorize?` +
      `response_type=token&` + 
      `client_id=${USER_POOL_CLIENT_ID}&` +
      `scope=openid%20email%20profile&` +
      `redirect_uri=${REDIRECT_URI}` +
      providerParam;
      
    window.location.assign(authUrl);
  }, []);

  // --- 2. Handle Token Acquisition on Callback Route ---
  const processAuthRedirect = useCallback((hash: string) => {
    const params = new URLSearchParams(hash.substring(1)); // Remove '#'
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (idToken && accessToken && expiresIn) {
      const expiresAt = Date.now() + (parseInt(expiresIn) * 1000);
      const newTokens: AuthTokens = { idToken, accessToken, expiresAt };
      
      localStorage.setItem('cognitoTokens', JSON.stringify(newTokens));
      setTokens(newTokens);
      
      const payload = decodeJwt(idToken);
      setUser({ email: payload.email, name: payload.name || payload['cognito:username'] || '' });
      
      navigate('/'); // Redirect to the main app screen
    } else {
      console.error("Authentication failed: Missing tokens in URL fragment.");
      navigate('/login');
    }
  }, [navigate]);

  // --- 3. Logout ---
  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('cognitoTokens');
    
    // Redirect to Cognito's logout endpoint to clear the session there
    const logoutUrl = `${COGNITO_DOMAIN}/logout?` +
      `client_id=${USER_POOL_CLIENT_ID}&` +
      `logout_uri=${LOGOUT_URI}`;
      
    window.location.assign(logoutUrl);
  }, []);

  const getIsAuthenticated = (t: AuthTokens | null): boolean => {
    return !!t && t.expiresAt > Date.now();
  };

  const isAuthenticated = getIsAuthenticated(tokens);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginWithHostedUI, logout, processAuthRedirect }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};