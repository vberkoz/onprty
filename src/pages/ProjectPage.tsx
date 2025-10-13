// src/pages/ProjectPage.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { generateSite, generateHTML, type SiteData } from '../services/siteGenerator';
import { initDB, type StoredSite } from '../services/siteStorageS3';
import { useSites, useSite, useSaveSite, useUpdateSite, useDeleteSite, usePublishSite, useUnpublishSite } from '../hooks/useSites';
import GlobalHeader from '../components/GlobalHeader';
import SiteGenerator from '../components/SiteGenerator';
import SiteManager from '../components/SiteManager';
import SitePreview from '../components/SitePreview';
import ConfirmDialog from '../components/ConfirmDialog';

const ProjectPage: React.FC = () => {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<StoredSite | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<string | undefined>(undefined);
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('monospace');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewFile, setPreviewFile] = useState('index.html');
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; siteId: string; siteName: string }>({ isOpen: false, siteId: '', siteName: '' });
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'generate' | 'sites'>('generate');
  const { user, isAuthenticated, logout } = useAuth();

  const { data: sites = [], isLoading: isLoadingSites } = useSites();
  const { data: fullSite } = useSite(selectedSiteId);
  const saveSiteMutation = useSaveSite();
  const updateSiteMutation = useUpdateSite();
  const deleteSiteMutation = useDeleteSite();
  const publishSiteMutation = usePublishSite();
  const unpublishSiteMutation = useUnpublishSite();

  const displayName = user?.given_name || user?.email || 'User';

  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    if (fullSite) {
      setSelectedSite(fullSite);
    }
  }, [fullSite]);

  useEffect(() => {
    if (sites.length > 0 && !selectedSiteId) {
      const lastSite = sites[sites.length - 1];
      setSelectedSiteId(lastSite.id);
    }
  }, [sites, selectedSiteId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const { siteData, siteFiles, schema } = await generateSite(prompt, selectedTemplate);
      
      let siteName = siteData.siteMetadata.title;
      let updatedSchema = schema;
      
      if (sites.some(s => s.name === siteName)) {
        const timestamp = new Date().toLocaleString();
        siteName = `${siteName} - ${timestamp}`;
        updatedSchema = {
          ...schema,
          generatedData: {
            ...schema.generatedData,
            siteMetadata: {
              ...schema.generatedData.siteMetadata,
              title: siteName,
              navTitle: siteName
            }
          }
        };
      }
      
      const tempSite: StoredSite = {
        id: 'temp-' + Date.now(),
        name: siteName,
        description: siteData.siteMetadata.description,
        files: siteFiles,
        schema: updatedSchema,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setSelectedSite(tempSite);
      setPreviewFile('index.html');
      
      const savedId = await saveSiteMutation.mutateAsync({
        name: siteName,
        description: siteData.siteMetadata.description,
        schema: updatedSchema,
        status: 'draft'
      });
      setSelectedSiteId(savedId);
      setActiveTab('sites');
      setPrompt('');
    } catch (error) {
      console.error('Failed to generate site:', error);
      alert('Failed to generate site. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishSite = async (siteId: string) => {
    try {
      if (!selectedSite?.files) {
        alert('No files to publish');
        return;
      }
      const publishedUrl = await publishSiteMutation.mutateAsync({ id: siteId, files: selectedSite.files });
      setSelectedSite({ ...selectedSite, status: 'published', publishedUrl });
    } catch (error) {
      console.error('Failed to publish site:', error);
      alert('Failed to publish site. Please try again.');
    }
  };

  const handleUnpublishSite = async (siteId: string) => {
    try {
      await unpublishSiteMutation.mutateAsync(siteId);
      if (selectedSite) {
        setSelectedSite({ ...selectedSite, status: 'draft', publishedUrl: undefined });
      }
    } catch (error) {
      console.error('Failed to unpublish site:', error);
      alert('Failed to unpublish site. Please try again.');
    }
  };

  const handleUpdateSite = async (siteId: string) => {
    try {
      if (!selectedSite?.schema || !selectedSite?.files) {
        alert('No changes to update');
        return;
      }
      await updateSiteMutation.mutateAsync({ id: siteId, updates: { schema: selectedSite.schema } });
      const publishedUrl = await publishSiteMutation.mutateAsync({ id: siteId, files: selectedSite.files });
      setSelectedSite({ ...selectedSite, publishedUrl });
      setOriginalTemplate(selectedSite.schema.template);
    } catch (error) {
      console.error('Failed to update site:', error);
      alert('Failed to update site. Please try again.');
    }
  };

  const handleDeleteSite = (siteId: string, siteName: string) => {
    setConfirmDialog({ isOpen: true, siteId, siteName });
  };

  const confirmDelete = async () => {
    try {
      if (selectedSite?.id === confirmDialog.siteId) {
        setSelectedSite(null);
        setSelectedSiteId(null);
        setPreviewFile('index.html');
      }
      await deleteSiteMutation.mutateAsync(confirmDialog.siteId);
    } catch (error) {
      console.error('Failed to delete site:', error);
      alert('Failed to delete site. Please try again.');
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
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
                onClick={() => setActiveTab('generate')}
              >
                Generate New Site
              </button>
              <button 
                className={`tab ${activeTab === 'sites' ? 'active' : ''}`}
                onClick={() => setActiveTab('sites')}
              >
                My Sites ({sites.length})
              </button>
            </div>

            {activeTab === 'generate' ? (
              <SiteGenerator
                prompt={prompt}
                selectedTemplate={selectedTemplate}
                isGenerating={isGenerating}
                onPromptChange={setPrompt}
                onTemplateChange={setSelectedTemplate}
                onGenerate={handleGenerate}
              />
            ) : (
              <SiteManager
                sites={sites}
                selectedSite={selectedSite}
                previewFile={previewFile}
                isLoading={isLoadingSites}
                isPublishing={publishSiteMutation.isPending || unpublishSiteMutation.isPending}
                templateChanged={selectedSite?.status === 'published' && originalTemplate !== undefined && selectedSite?.schema?.template !== originalTemplate}
                onSiteSelect={(site) => {
                  setSelectedSiteId(site.id);
                  setSelectedSite(site);
                  setOriginalTemplate(site.schema?.template);
                }}
                onFileSelect={setPreviewFile}
                onDeleteSite={handleDeleteSite}
                onPublishSite={handlePublishSite}
                onUnpublishSite={handleUnpublishSite}
                onUpdateSite={handleUpdateSite}
                onTemplateChange={(template) => {
                  if (selectedSite?.schema?.generatedData) {
                    const updatedSchema = { ...selectedSite.schema, template };
                    const files = generateHTML(updatedSchema.generatedData as SiteData, template);
                    setSelectedSite({ ...selectedSite, schema: updatedSchema, files });
                  }
                }}
              />
            )}
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