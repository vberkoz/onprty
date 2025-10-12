// src/pages/ProjectPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from '../context/AuthContext';
import { generateSite } from '../services/siteGenerator';
import { initDB, saveSite, getSites, getSite, deleteSite, publishSite, unpublishSite, type StoredSite } from '../services/siteStorageS3';
import GlobalHeader from '../components/GlobalHeader';
import SiteGenerator from '../components/SiteGenerator';
import SiteManager from '../components/SiteManager';
import SitePreview from '../components/SitePreview';
import ConfirmDialog from '../components/ConfirmDialog';

const ProjectPage: React.FC = () => {
  const [sites, setSites] = useState<StoredSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<StoredSite | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('monospace');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
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
        const firstSite = await getSite(loadedSites[0].id);
        if (firstSite) {
          setSelectedSite(firstSite);
        }
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
      const { siteData, siteFiles, schema } = await generateSite(prompt, selectedTemplate);
      
      const tempSite: StoredSite = {
        id: 'temp-' + Date.now(),
        name: siteData.siteMetadata.title,
        description: siteData.siteMetadata.description,
        files: siteFiles,
        schema,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setSelectedSite(tempSite);
      setPreviewFile('index.html');
      
      try {
        await saveSite({
          name: siteData.siteMetadata.title,
          description: siteData.siteMetadata.description,
          schema,
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

  const handlePublishSite = async (siteId: string) => {
    setIsPublishing(true);
    try {
      if (!selectedSite?.files) {
        alert('No files to publish');
        return;
      }
      const publishedUrl = await publishSite(siteId, selectedSite.files);
      setSelectedSite({ ...selectedSite, status: 'published', publishedUrl });
      await loadSites();
    } catch (error) {
      console.error('Failed to publish site:', error);
      alert('Failed to publish site. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublishSite = async (siteId: string) => {
    setIsPublishing(true);
    try {
      await unpublishSite(siteId);
      if (selectedSite) {
        setSelectedSite({ ...selectedSite, status: 'draft', publishedUrl: undefined });
      }
      await loadSites();
    } catch (error) {
      console.error('Failed to unpublish site:', error);
      alert('Failed to unpublish site. Please try again.');
    } finally {
      setIsPublishing(false);
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
              isPublishing={isPublishing}
              onSiteSelect={setSelectedSite}
              onFileSelect={setPreviewFile}
              onDeleteSite={handleDeleteSite}
              onPublishSite={handlePublishSite}
              onUnpublishSite={handleUnpublishSite}
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