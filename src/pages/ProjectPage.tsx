// src/pages/ProjectPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from '../context/AuthContext';
import { generateSite } from '../services/siteGenerator';
import { initDB, saveSite, getSites, deleteSite, type StoredSite } from '../services/siteStorageS3';
import GlobalHeader from '../components/GlobalHeader';
import SiteGenerator from '../components/SiteGenerator';
import SiteManager from '../components/SiteManager';
import SitePreview from '../components/SitePreview';
import ConfirmDialog from '../components/ConfirmDialog';

const ProjectPage: React.FC = () => {
  const [sites, setSites] = useState<StoredSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<StoredSite | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('mono');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [previewFile, setPreviewFile] = useState('index.html');
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; siteId: string; siteName: string }>({ isOpen: false, siteId: '', siteName: '' });
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();

  const displayName = user?.given_name || user?.email || 'User';

  const loadSites = useCallback(async () => {
    if (!isAuthenticated) {
      setSites([]);
      setIsLoadingSites(false);
      return;
    }
    
    setIsLoadingSites(true);
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
    } finally {
      setIsLoadingSites(false);
    }
  }, [isAuthenticated, selectedSite, logout]);

  useEffect(() => {
    const init = async () => {
      await initDB();
      await loadSites();
    };
    init();
  }, [isAuthenticated, loadSites]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const { siteData, siteFiles } = await generateSite(prompt, selectedTemplate);
      
      // Create temporary site object for immediate preview
      const tempSite: StoredSite = {
        id: 'temp-' + Date.now(),
        name: siteData.siteMetadata.title,
        description: siteData.siteMetadata.description,
        files: siteFiles,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Display immediately
      setSelectedSite(tempSite);
      setPreviewFile('index.html');
      
      // Save to storage in background
      try {
        await saveSite({
          name: siteData.siteMetadata.title,
          description: siteData.siteMetadata.description,
          files: siteFiles,
          status: 'draft'
        });
        await loadSites();
      } catch (saveError) {
        console.error('Failed to save site:', saveError);
      }
      
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="app-container">
      <GlobalHeader
        displayName={displayName}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        onLogout={logout}
      />
      
      <div className="split-view-container">
        {sidebarVisible && (
          <aside className="control-panel-aside">
            <SiteGenerator
              prompt={prompt}
              selectedTemplate={selectedTemplate}
              isGenerating={isGenerating}
              onPromptChange={setPrompt}
              onTemplateChange={setSelectedTemplate}
              onGenerate={handleGenerate}
            />

            <hr className="divider" />

            <SiteManager
              sites={sites}
              selectedSite={selectedSite}
              previewFile={previewFile}
              isLoading={isLoadingSites}
              onSiteSelect={setSelectedSite}
              onFileSelect={setPreviewFile}
              onDeleteSite={handleDeleteSite}
            />
          </aside>
        )}

        <section className="preview-iframe-section">
          <SitePreview
            selectedSite={selectedSite}
            previewFile={previewFile}
            onFileNavigate={setPreviewFile}
          />
        </section>
      </div>
      
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