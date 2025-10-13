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
  isPublishing: boolean;
  templateChanged: boolean;
  onSiteSelect: (site: StoredSite) => void;
  onFileSelect: (fileName: string) => void;
  onDeleteSite: (siteId: string, siteName: string) => void;
  onPublishSite: (siteId: string) => void;
  onUnpublishSite: (siteId: string) => void;
  onUpdateSite: (siteId: string) => void;
  onTemplateChange: (template: string) => void;
}

const SiteManager: React.FC<SiteManagerProps> = ({
  sites,
  selectedSite,
  previewFile,
  isLoading,
  isPublishing,
  templateChanged,
  onSiteSelect,
  onFileSelect,
  onDeleteSite,
  onPublishSite,
  onUnpublishSite,
  onUpdateSite,
  onTemplateChange
}) => {
  const handleSiteSelect = (siteName: string) => {
    const site = sites.find(s => s.name === siteName);
    if (site) {
      onSiteSelect(site);
    }
  };
  return (
    <div className="my-sites-section">
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
              onChange={handleSiteSelect}
            />
          </label>
          {selectedSite && (
            <>
              <label>
                Template:
                <Dropdown
                  value={selectedSite.schema?.template === 'neubrutalism' ? 'Neubrutalism' : 'Monospace'}
                  options={['Monospace', 'Neubrutalism']}
                  onChange={(value) => onTemplateChange(value === 'Monospace' ? 'monospace' : 'neubrutalism')}
                />
              </label>
              <label>
                File:
                <Dropdown
                  value={previewFile}
                  options={Object.keys(selectedSite.files || {})}
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
                  <>
                    {templateChanged && (
                      <Button onClick={() => onUpdateSite(selectedSite.id)} size="small" loading={isPublishing}>
                        Update
                      </Button>
                    )}
                    <Button onClick={() => onUnpublishSite(selectedSite.id)} size="small" variant="secondary" loading={isPublishing}>
                      Unpublish
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => onPublishSite(selectedSite.id)} size="small" loading={isPublishing}>
                    Publish
                  </Button>
                )}
                <Button onClick={() => downloadSiteAsZip(selectedSite)} size="small" disabled={isPublishing}>
                  Download
                </Button>
                <Button 
                  onClick={() => onDeleteSite(selectedSite.id, selectedSite.name)} 
                  variant="danger" 
                  size="small"
                  disabled={isPublishing}
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