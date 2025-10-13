import React, { useEffect } from 'react';
import type { StoredSite } from '../../types';
import Spinner from '../ui/Spinner';

interface SitePreviewProps {
  selectedSite: StoredSite | null;
  previewFile: string;
  onFileNavigate: (fileName: string) => void;
  isLoading?: boolean;
}

const SitePreview: React.FC<SitePreviewProps> = ({
  selectedSite,
  previewFile,
  onFileNavigate,
  isLoading = false
}) => {
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'navigate' && e.data.file) {
        onFileNavigate(e.data.file);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onFileNavigate]);

  if (isLoading) {
    return (
      <div className="no-preview">
        <Spinner />
        <p style={{ marginLeft: '0.5rem' }}>Loading sites...</p>
      </div>
    );
  }

  if (!selectedSite || !selectedSite.files || !selectedSite.files[previewFile]) {
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

  return (
    <div className="site-preview-wrapper">
      <iframe
        ref={(iframe) => {
          if (!iframe || !selectedSite?.files?.[previewFile]) return;
          const doc = iframe.contentDocument;
          if (!doc) return;

          let content = selectedSite.files[previewFile];
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
          content = content.replace('</body>', navigationScript + '</body>');

          doc.open();
          doc.write(content);
          doc.close();
        }}
        key={selectedSite.id + previewFile}
        className="site-preview-iframe"
        title="Site Preview"
      />
    </div>
  );
};

export default SitePreview;