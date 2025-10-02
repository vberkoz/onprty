// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Basic styling
import LoginScreen from './pages/LoginScreen';
import AuthCallback from './pages/AuthCallback';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Main App Screen - Protected Content is *inside* LoginScreen */}
          <Route path="/" element={<LoginScreen />} />

          {/* OAuth Redirect Callback */}
          <Route path="/auth-callback" element={<AuthCallback />} />

          {/* Redirect any other path to the main screen */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);