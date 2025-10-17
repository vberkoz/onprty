import React from 'react';
import { downloadSiteAsZip } from '../../services/api/siteStorageS3';
import type { StoredSite } from '../../types';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface SiteManagerProps {
  sites: StoredSite[];
  selectedSite: StoredSite | null;
  previewFile: string;
  isLoading: boolean;
  isPublishing: boolean;
  templateChanged: boolean;
  contentChanged: boolean;
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
  contentChanged,
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
                  value={selectedSite.schema?.template === 'neubrutalism' ? 'Neubrutalism' : selectedSite.schema?.template === 'swiss' ? 'Swiss' : selectedSite.schema?.template === 'terminal' ? 'Terminal' : 'Monospace'}
                  options={['Monospace', 'Neubrutalism', 'Swiss', 'Terminal']}
                  onChange={(value) => onTemplateChange(value === 'Monospace' ? 'monospace' : value === 'Neubrutalism' ? 'neubrutalism' : value === 'Swiss' ? 'swiss' : 'terminal')}
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
              <div className="site-actions-section">
                <h4>Publishing</h4>
                <p className="section-description">
                  {selectedSite.status === 'published' 
                    ? 'Your site is live. Unpublish to take it offline or republish to update changes.'
                    : 'Publish your site to make it publicly accessible via CloudFront CDN.'}
                </p>
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
                      {(templateChanged || contentChanged) && (
                        <Button onClick={() => onUpdateSite(selectedSite.id)} size="small" loading={isPublishing}>
                          Republish
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
                </div>
              </div>

              <div className="site-actions-section">
                <h4>Export</h4>
                <p className="section-description">
                  Download your site as a ZIP file to host it on your own server or platform.
                </p>
                <div className="site-controls">
                  <Button onClick={() => downloadSiteAsZip(selectedSite)} size="small" disabled={isPublishing}>
                    Download ZIP
                  </Button>
                </div>
              </div>

              <div className="site-actions-section">
                <h4>Danger Zone</h4>
                <p className="section-description">
                  Permanently delete this site. This action cannot be undone.
                </p>
                <div className="site-controls">
                  <Button 
                    onClick={() => onDeleteSite(selectedSite.id, selectedSite.name)} 
                    variant="danger" 
                    size="small"
                    disabled={isPublishing}
                  >
                    Delete Site
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <p className="no-sites">No sites yet.<br />Generate your first site!</p>
      )}
    </div>
  );
};

export default SiteManager;