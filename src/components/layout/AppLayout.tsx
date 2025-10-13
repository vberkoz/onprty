// src/components/AppLayout.tsx

import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;