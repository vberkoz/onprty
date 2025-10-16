import type { StoredSite } from '../../types';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';

function getAccessToken(): string | null {
  const storedTokens = localStorage.getItem(STORAGE_KEYS.COGNITO_TOKENS);
  if (storedTokens && storedTokens !== 'null') {
    try {
      const tokens = JSON.parse(storedTokens);
      if (tokens && tokens.accessToken && tokens.expiresAt > Date.now()) {
        return tokens.accessToken;
      }
    } catch (error) {
      console.error('Failed to parse stored tokens:', error);
      localStorage.removeItem(STORAGE_KEYS.COGNITO_TOKENS);
    }
  }
  return null;
}

export async function saveSite(site: Omit<StoredSite, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('Please log in to save sites');
  }

  const response = await fetch(`${API_BASE_URL}/sites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name: site.name,
      description: site.description,
      schema: site.schema,
      slug: site.slug,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save site');
  }

  const { id } = await response.json();
  return id;
}

export async function getSites(): Promise<StoredSite[]> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/sites`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get sites');
  }

  const sites = await response.json() as Array<{
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'published' | 'error';
    publishedUrl?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  return sites.map((site) => ({
    ...site,
    createdAt: new Date(site.createdAt),
    updatedAt: new Date(site.updatedAt),
    files: undefined,
  }));
}

export async function getSite(id: string): Promise<StoredSite | null> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to get site');
  }

  const site = await response.json();
  
  if (site.schema) {
    const { generateHTML } = await import('./siteGenerator');
    const siteData = site.schema.generatedData || site.schema.siteData;
    const template = site.schema.template || 'monospace';
    const files = generateHTML(siteData, template);
    
    return {
      ...site,
      files,
      createdAt: new Date(site.createdAt),
      updatedAt: new Date(site.updatedAt),
    };
  }
  
  return {
    ...site,
    files: {},
    createdAt: new Date(site.createdAt),
    updatedAt: new Date(site.updatedAt),
  };
}

export async function updateSite(id: string, updates: Partial<StoredSite>): Promise<void> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update site');
  }
}

export async function deleteSite(id: string): Promise<void> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete site');
  }
}

export async function publishSite(slug: string, files: { [fileName: string]: string }): Promise<string> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${API_BASE_URL}/sites/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ slug, files }),
  });

  if (!response.ok) {
    throw new Error('Failed to publish site');
  }

  const { publishedUrl } = await response.json();
  return publishedUrl;
}

export async function unpublishSite(slug: string): Promise<void> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(`${API_BASE_URL}/sites/unpublish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {
    throw new Error('Failed to unpublish site');
  }
}

export async function downloadSiteAsZip(site: StoredSite): Promise<void> {
  const files = site.files || {};
  
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  Object.entries(files).forEach(([fileName, content]) => {
    zip.file(fileName, content);
  });
  
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${site.name}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function initDB(): Promise<void> {
  // No-op for S3 storage
}