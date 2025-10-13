// src/main.tsx (Updated Routing)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { queryClient } from './lib/queryClient';
import './index.css'; 

// Components & Pages
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute'; 
import ProjectPage from './pages/ProjectPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth-callback" element={<AuthCallback />} />

          {/* Protected Routes (Wrapped in AppLayout & ProtectedRoute) */}
          <Route 
            path="/*" // Match all paths under the root
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    {/* Nested Routes within the layout */}
                    <Route path="/" element={<ProjectPage />} />
                    
                    {/* Optional: Add a 404 handler inside the layout */}
                    {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);