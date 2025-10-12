import React from 'react';
import { type StoredSite, downloadSiteAsZip } from '../services/siteStorageS3';
import Dropdown from './Dropdown';
import Button from './Button';
import Spinner from './Spinner';

interface SiteManagerProps {
  sites: StoredSite[];
  selectedSite: StoredSite | null;
  previewFile: string;
  isLoading: boolean;
  onSiteSelect: (site: StoredSite) => void;
  onFileSelect: (fileName: string) => void;
  onDeleteSite: (siteId: string, siteName: string) => void;
  onPublishSite: (siteId: string) => void;
  onUnpublishSite: (siteId: string) => void;
}

const SiteManager: React.FC<SiteManagerProps> = ({
  sites,
  selectedSite,
  previewFile,
  isLoading,
  onSiteSelect,
  onFileSelect,
  onDeleteSite,
  onPublishSite,
  onUnpublishSite
}) => {
  return (
    <div className="my-sites-section">
      <h2>📂 My Sites ({sites.length})</h2>
      {isLoading ? (
        <div className="loading-sites">
          <Spinner />
          <span>Loading sites...</span>
        </div>
      ) : sites.length > 0 ? (
        <>
          <label>
            Select Site:
            <Dropdown
              value={selectedSite?.name || 'Select a site'}
              options={sites.map(site => site.name)}
              onChange={(siteName) => {
                const site = sites.find(s => s.name === siteName);
                if (site) onSiteSelect(site);
              }}
            />
          </label>
          {selectedSite && (
            <>
              <label>
                File:
                <Dropdown
                  value={previewFile}
                  options={Object.keys(selectedSite.files)}
                  onChange={onFileSelect}
                />
              </label>
              {selectedSite.status === 'published' && selectedSite.publishedUrl && (
                <div className="published-url">
                  <label>Published URL:</label>
                  <a href={selectedSite.publishedUrl} target="_blank" rel="noopener noreferrer" className="url-link">
                    {selectedSite.publishedUrl}
                  </a>
                </div>
              )}
              <div className="site-controls">
                {selectedSite.status === 'published' ? (
                  <Button onClick={() => onUnpublishSite(selectedSite.id)} size="small" variant="secondary">
                    Unpublish
                  </Button>
                ) : (
                  <Button onClick={() => onPublishSite(selectedSite.id)} size="small">
                    Publish
                  </Button>
                )}
                <Button onClick={() => downloadSiteAsZip(selectedSite)} size="small">
                  Download
                </Button>
                <Button 
                  onClick={() => onDeleteSite(selectedSite.id, selectedSite.name)} 
                  variant="danger" 
                  size="small"
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
        <p className="no-sites">No sites yet. Generate your first site above!</p>
      )}
    </div>
  );
};

export default SiteManager;