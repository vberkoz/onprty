// src/pages/ProjectPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../context/AuthContext';
import { generateSite } from '../services/siteGenerator';
import { initDB, saveSite, getSites, deleteSite, downloadSiteAsZip, type StoredSite } from '../services/siteStorageS3';

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="dialog-button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="dialog-button primary" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const FileDropdown: React.FC<{
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{value}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option}
              className={`dropdown-item ${option === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectPage: React.FC = () => {
  const [sites, setSites] = useState<StoredSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<StoredSite | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewFile, setPreviewFile] = useState('index.html');
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; siteId: string; siteName: string }>({ isOpen: false, siteId: '', siteName: '' });
  const { user, isAuthenticated, logout } = useAuth();

  const displayName = user?.given_name || user?.email || 'User';

  useEffect(() => {
    const init = async () => {
      await initDB();
      await loadSites();
    };
    init();
  }, [isAuthenticated]);

  const loadSites = async () => {
    if (!isAuthenticated) {
      setSites([]);
      return;
    }
    
    try {
      const loadedSites = await getSites();
      setSites(loadedSites);
      if (loadedSites.length > 0 && !selectedSite) {
        setSelectedSite(loadedSites[0]);
      }
    } catch (error) {
      console.error('Failed to load sites:', error);
      if (error instanceof Error && error.message.includes('authorization')) {
        logout();
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const { siteData, siteFiles } = await generateSite(prompt);
      
      const siteId = await saveSite({
        name: siteData.siteMetadata.title,
        description: siteData.siteMetadata.description,
        files: siteFiles,
        status: 'draft'
      });

      await loadSites();
      const newSite = sites.find(s => s.id === siteId);
      if (newSite) setSelectedSite(newSite);
      setPrompt('');
    } catch (error) {
      console.error('Failed to generate site:', error);
      alert('Failed to generate site. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteSite = (siteId: string, siteName: string) => {
    setConfirmDialog({ isOpen: true, siteId, siteName });
  };

  const confirmDelete = async () => {
    try {
      await deleteSite(confirmDialog.siteId);
      await loadSites();
      if (selectedSite?.id === confirmDialog.siteId) {
        setSelectedSite(null);
        setPreviewFile('index.html');
      }
    } catch (error) {
      console.error('Failed to delete site:', error);
    }
    setConfirmDialog({ isOpen: false, siteId: '', siteName: '' });
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, siteId: '', siteName: '' });
  };

  const renderPreview = () => {
    if (!selectedSite || !selectedSite.files[previewFile]) {
      return <div className="no-preview"><p>Select a site to view preview</p></div>;
    }

    // Check if it's a code file (CSS, JS, or JSON)
    if (previewFile.endsWith('.css') || previewFile.endsWith('.js') || previewFile.endsWith('.json')) {
      const content = selectedSite.files[previewFile];
      return (
        <div className="code-preview">
          <pre className="code-content">
            <code>{content}</code>
          </pre>
        </div>
      );
    }

    let content = selectedSite.files[previewFile];
    
    // Inject navigation handler script
    const navigationScript = `
      <script>
        document.addEventListener('click', function(e) {
          if (e.target.tagName === 'A' && e.target.href) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (href && href.endsWith('.html')) {
              window.parent.postMessage({type: 'navigate', file: href}, '*');
            }
          }
        });
      </script>
    `;
    
    // Insert script before closing body tag
    content = content.replace('</body>', navigationScript + '</body>');
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    return (
      <iframe
        key={selectedSite.id + previewFile}
        src={url}
        title="Site Preview"
        className="site-preview-iframe"
        onLoad={() => {
          URL.revokeObjectURL(url);
          // Listen for navigation messages from iframe
          const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'navigate' && event.data.file) {
              setPreviewFile(event.data.file);
            }
          };
          window.addEventListener('message', handleMessage);
          return () => window.removeEventListener('message', handleMessage);
        }}
      />
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="split-view-container">
      <aside className="control-panel-aside">
        <div className="generate-section">
          <h2>✨ Generate New Site</h2>
          <form className="generation-form" onSubmit={handleGenerate}>
            <label>
              Describe your website:
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A modern landing page for a tech startup with hero section, features, and team"
                rows={3}
                disabled={isGenerating}
              />
            </label>
            <button type="submit" disabled={!prompt.trim() || isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Site'}
            </button>
          </form>
        </div>

        <hr className="divider" />

        <div className="my-sites-section">
          <h2>📂 My Sites ({sites.length})</h2>
          <ul className="site-list">
            {sites.map((site) => (
              <li
                key={site.id}
                className={`site-card ${selectedSite?.id === site.id ? "active-preview" : ""}`}
              >
                <div className="site-info">
                  <span className="site-name">{site.name}</span>
                  <span className={`site-status status-${site.status}`}>
                    {site.status}
                  </span>
                </div>
                <div className="site-actions">
                  <button onClick={() => setSelectedSite(site)}>View</button>
                  <button onClick={() => downloadSiteAsZip(site)}>Download</button>
                  <button onClick={() => handleDeleteSite(site.id, site.name)} className="delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
          {sites.length === 0 && (
            <p className="no-sites">No sites yet. Generate your first site above!</p>
          )}
        </div>
      
        <div className="nav-user-controls">
          <span className="user-greeting">Hello, {displayName}</span>
          <button onClick={logout} className="logout-button-small">
            Logout
          </button>
        </div>
      </aside>

      <section className="preview-iframe-section">
        {selectedSite && (
          <div className="preview-header">
            <strong>{selectedSite.name}</strong>
            <FileDropdown
              value={previewFile}
              options={Object.keys(selectedSite.files)}
              onChange={setPreviewFile}
            />
          </div>
        )}
        {renderPreview()}
      </section>
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Site"
        message={`Are you sure you want to delete "${confirmDialog.siteName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ProjectPage;
