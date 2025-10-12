// S3-based site storage service
export interface StoredSite {
  id: string;
  name: string;
  description: string;
  files: { [fileName: string]: string };
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'live' | 'error';
  url?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

function getAccessToken(): string | null {
  const storedTokens = localStorage.getItem('cognitoTokens');
  if (storedTokens && storedTokens !== 'null') {
    try {
      const tokens = JSON.parse(storedTokens);
      if (tokens && tokens.accessToken && tokens.expiresAt > Date.now()) {
        return tokens.accessToken;
      }
    } catch (error) {
      console.error('Failed to parse stored tokens:', error);
      localStorage.removeItem('cognitoTokens');
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
    body: JSON.stringify(site),
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
    return []; // Return empty array instead of throwing error
  }

  const response = await fetch(`${API_BASE_URL}/sites`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get sites');
  }

  const sites = await response.json();
  return sites.map((site: any) => ({
    ...site,
    createdAt: new Date(site.createdAt),
    updatedAt: new Date(site.updatedAt),
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
  return {
    ...site,
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

export async function downloadSiteAsZip(site: StoredSite): Promise<void> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  Object.entries(site.files).forEach(([fileName, content]) => {
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

// No initialization needed for S3-based storage
export async function initDB(): Promise<void> {
  // No-op for S3 storage
}