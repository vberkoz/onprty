import React from 'react';
import ProfileDropdown from './ProfileDropdown';

interface GlobalHeaderProps {
  displayName: string;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  displayName,
  sidebarVisible,
  onToggleSidebar,
  onLogout
}) => {
  return (
    <header className="global-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle" 
          onClick={onToggleSidebar}
          title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
        >
          ☰
        </button>
      </div>
      <div className="header-right">
        <ProfileDropdown displayName={displayName} onLogout={onLogout} />
      </div>
    </header>
  );
};

export default GlobalHeader;