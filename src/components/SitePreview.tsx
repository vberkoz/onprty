import React from 'react';
import { type StoredSite } from '../services/siteStorageS3';

interface SitePreviewProps {
  selectedSite: StoredSite | null;
  previewFile: string;
  onFileNavigate: (fileName: string) => void;
}

const SitePreview: React.FC<SitePreviewProps> = ({
  selectedSite,
  previewFile,
  onFileNavigate
}) => {
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
            onFileNavigate(event.data.file);
          }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      }}
    />
  );
};

export default SitePreview;